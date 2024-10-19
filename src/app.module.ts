import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContractsCompileController } from './realization/contacts/contracts.controller';
import { ContractsCompileService } from './realization/contacts/contracts.service';

@Module({
  imports: [],
  controllers: [AppController, ContractsCompileController],
  providers: [AppService, ContractsCompileService],
})
export class AppModule {}
