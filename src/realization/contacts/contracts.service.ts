import { Injectable } from '@nestjs/common';
import { JsonRpcProvider } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import * as prettier from 'prettier';
import * as solc from 'solc';

@Injectable()
export class ContractsService {
  // provider = new InfuraProvider(null, process.env.ALCHEMY_APP_ID);
  provider = new JsonRpcProvider(
    `https://linea-sepolia.infura.io/v3/ffc2553613e240d8a38bf359b99f7508`,
  );

  async compileContract(filename: string, solidityCode: string) {
    const contractDirectory = path.resolve(__dirname, '../../../node_modules/');

    const importRegex = /import\s+(?:"([^"]+)"|'([^']+)')/g;
    const matches: string[] = [];

    const formattedCode = await prettier.format(solidityCode, {
      parser: 'solidity-parse',
      plugins: [require.resolve('prettier-plugin-solidity')],
    });

    const input = {
      language: 'Solidity',
      sources: {
        [`${filename}.sol`]: {
          content: formattedCode,
        },
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['*'],
          },
        },
      },
    };

    const importCallback = (importPath: string) => {
      const absolutePath = path.resolve(contractDirectory, importPath);

      if (fs.existsSync(absolutePath)) {
        const content = fs.readFileSync(absolutePath, 'utf-8');
        return {
          contents: content,
        };
      } else {
        throw new Error(`File not found: ${importPath}`);
      }
    };

    let match;

    while ((match = importRegex.exec(formattedCode)) !== null) {
      matches.push(match[1] || match[2]);
    }

    matches.forEach((importPath) => {
      importCallback(importPath);
    });

    const output = JSON.parse(
      solc.compile(JSON.stringify(input), { import: importCallback }),
    );

    if (output.errors) {
      output.errors.forEach((err) => {
        if (err.severity === 'error') {
          console.error('Error:', err.formattedMessage);
          throw new Error('Failed compile');
        } else {
          console.warn('Warning:', err.formattedMessage);
        }
      });
    }

    const response = {
      abi: output.contracts[`${filename}.sol`][`${filename}`].abi,
      bytecode: output.contracts[`${filename}.sol`],
    };

    return response;
  }
}
