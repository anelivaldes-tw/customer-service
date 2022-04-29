import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomerDto } from './dto/customer.dto';
import { EventPattern } from '@nestjs/microservices';
import { EventHandlerService } from '../event-handler/event-handler.service';
import {
  CustomerCreatedEvent,
  CustomerEvent,
  CustomerEventTypes,
  OrderEvent,
  OrderEventsTypes,
} from '../event-publisher/models/events.model';
import { EventPublisherService } from '../event-publisher/event-publisher.service';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly eventHandlerService: EventHandlerService,
    private readonly eventPublisher: EventPublisherService,
  ) {}

  @Post()
  async create(@Body() createCustomerDto: CustomerDto) {
    const customer = await this.customersService.create(createCustomerDto);
    if (customer) {
      const customerEvent: CustomerCreatedEvent = {
        type: CustomerEventTypes.CUSTOMER_CREATED,
        customerId: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        creditLimit: customer.creditLimit,
        orders: [],
      };
      // TODO: Implement Transactional outbox pattern here. https://javascript.plainenglish.io/sequelize-transactions-4ca7b6491e86
      this.eventPublisher.publish(customerEvent);
    }
    return customer;
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }

  @EventPattern('order')
  async handleOrderEvents(payload: any) {
    this.eventHandlerService.handleEvent('order', payload, async () => {
      const orderEvent: OrderEvent = payload.value;
      const alreadyProcessed =
        await this.customersService.orderHasBeenProcessed(orderEvent.orderId);
      if (!alreadyProcessed) {
        if (orderEvent.state === OrderEventsTypes.ORDER_CREATED) {
          const status = await this.customersService.reserveCredit(orderEvent);
          const customerEvent: CustomerEvent = {
            customerId: orderEvent.customerId,
            orderId: orderEvent.orderId,
            orderTotal: orderEvent.orderTotal,
            type: status,
          };
          // TODO: Implement Transactional outbox pattern here. https://javascript.plainenglish.io/sequelize-transactions-4ca7b6491e86
          this.eventPublisher.publish(customerEvent);
        }
      } else {
        console.log(
          `A duplicated order has been received: OrderId: ${orderEvent.orderId} - WILL BE IGNORED`,
        );
      }
    });
  }
}
