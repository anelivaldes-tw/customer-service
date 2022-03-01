import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Customer } from './models/customer.model';
import { EventPublisherService } from '../event-publisher/event-publisher.service';
import { EventHandlerService } from '../event-handler/event-handler.service';

@Module({
  imports: [SequelizeModule.forFeature([Customer])],
  providers: [CustomersService, EventPublisherService, EventHandlerService],
  controllers: [CustomersController],
})
export class CustomersModule {}
