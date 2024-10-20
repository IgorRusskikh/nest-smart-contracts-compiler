import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContractsController } from './realization/contacts/contracts.controller';
import { ContractsService } from './realization/contacts/contracts.service';

@Module({
  imports: [],
  controllers: [AppController, ContractsController],
  providers: [AppService, ContractsService],
})
export class AppModule {}
