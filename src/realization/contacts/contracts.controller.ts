import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContractDto } from 'src/rest/dto/ContractDto';
import { ContractsCompileService } from './contracts.service';

@Controller('contracts')
export class ContractsCompileController {
  constructor(
    private readonly contractCompileService: ContractsCompileService,
  ) {}

  @Post('/compile')
  compile(@Body() { filename, solidityCode }: ContractDto) {
    return this.contractCompileService.compileContract(filename, solidityCode);
  }

  @Get('/deploy')
  deploy() {
    return this.contractCompileService.deployContract();
  }
}
