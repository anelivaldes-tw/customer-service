import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomerDto } from './dto/customer.dto';
import { EventPattern } from '@nestjs/microservices';
import { EventHandlerService } from '../event-handler/event-handler.service';
import {
  CustomerEvent,
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
  create(@Body() createCustomerDto: CustomerDto) {
    return this.customersService.create(createCustomerDto);
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
      if (orderEvent.type === OrderEventsTypes.ORDER_CREATED) {
        const status = await this.customersService.validateOrder(orderEvent);
        const customerEvent: CustomerEvent = {
          customerId: orderEvent.customerId,
          orderId: orderEvent.orderId,
          orderTotal: orderEvent.orderTotal,
          type: status,
        };
        // TODO: Implement Transactional outbox pattern here. https://javascript.plainenglish.io/sequelize-transactions-4ca7b6491e86
        this.eventPublisher.publish(customerEvent);
      }
    });
  }
}
