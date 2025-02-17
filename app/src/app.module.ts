import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { SERVICE_IDENTIFIER } from './constants/identifiers';
import { ApplicationLogger } from './infrastructure/logger';
import { DirectionHandler } from './models/direction';
import { Table } from './models/table';
import { Robot } from './models';

@Module({
  imports: [],
  providers: [
    AppService,
    {
      provide: SERVICE_IDENTIFIER.IContextAwareLogger,
      useClass: ApplicationLogger,
    },
    {
      provide: SERVICE_IDENTIFIER.ITable,
      useClass: Table,
    },
    {
      provide: SERVICE_IDENTIFIER.IDirectionHandler,
      useClass: DirectionHandler,
    },
    {
      provide: SERVICE_IDENTIFIER.IRobot,
      useClass: Robot,
    },
  ],
})
export class AppModule {}
