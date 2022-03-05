import { Inject, Injectable } from '@nestjs/common';
import { Customer } from './customer.entity';
import { CustomerDto } from './dto/customer.dto';
import {
  CustomerEventTypes,
  OrderEvent,
} from '../event-publisher/models/events.model';
import { CUSTOMER_REPOSITORY } from '../constants';

@Injectable()
export class CustomersService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: typeof Customer,
  ) {}

  create(createCustomerDto: CustomerDto): Promise<Customer> {
    return this.customerRepository.create<Customer>(createCustomerDto);
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }

  async findOne(id: string): Promise<Customer> {
    return this.customerRepository.findOne({
      where: {
        id,
      },
    });
  }

  async validateOrder(orderEvent: OrderEvent): Promise<CustomerEventTypes> {
    const customer = await this.findOne(orderEvent.customerId);
    if (customer && customer.id) {
      if (orderEvent.orderTotal <= customer.creditLimit) {
        // Decrease the credit limit
        this.customerRepository.update(
          { creditLimit: customer.creditLimit - orderEvent.orderTotal },
          { where: { id: customer.id } },
        );
        return CustomerEventTypes.CREDIT_RESERVED;
      } else {
        return CustomerEventTypes.CREDIT_RESERVATION_FAILED;
      }
    } else {
      return CustomerEventTypes.CUSTOMER_VALIDATION_FAILED;
    }
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}
