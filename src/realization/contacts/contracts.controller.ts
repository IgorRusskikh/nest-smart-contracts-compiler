import { Body, Controller, Post } from '@nestjs/common';
import { ContractDto } from 'src/rest/dto/ContractDto';
import { ContractsService } from './contracts.service';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly ContractsService: ContractsService) {}

  @Post('/compile')
  compile(@Body() { filename, solidityCode }: ContractDto) {
    return this.ContractsService.compileContract(filename, solidityCode);
  }
}
