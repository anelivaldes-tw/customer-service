import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { EventPublisherService } from '../event-publisher/event-publisher.service';
import { EventHandlerService } from '../event-handler/event-handler.service';
import { customersProviders } from './customers.providers';
import { outboxProviders } from './outbox/outbox.providers';
import { databaseProviders } from '../database/database.providers';
import { creditReservationProviders } from './credit-reservation.providers';
import { CustomersController } from './customers.controller';

@Module({
  providers: [
    CustomersService,
    ...customersProviders,
    ...creditReservationProviders,
    ...outboxProviders,
    ...databaseProviders,
    EventPublisherService,
    EventHandlerService,
  ],
  controllers: [CustomersController],
})
export class CustomersModule {}
