import { Injectable } from '@nestjs/common';
import { Customer } from './models/customer.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { OrderEvent } from '../event-publisher/models/events.model';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer)
    private readonly customerModel: typeof Customer,
  ) {}

  create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customerModel.create<Customer>(createCustomerDto);
  }

  async findAll(): Promise<Customer[]> {
    return this.customerModel.findAll();
  }

  async findOne(id: string): Promise<Customer> {
    return this.customerModel.findOne({
      where: {
        id,
      },
    });
  }

  async validateOrder(orderEvent: OrderEvent) {
    const customer = await this.findOne(orderEvent.customerId);
    if (customer.id) {
      if (orderEvent.orderTotal <= customer.creditLimit) {
        // Decrease the credit limit
        this.customerModel.update(
          { creditLimit: customer.creditLimit - orderEvent.orderTotal },
          { where: { id: customer.id } },
        );
        return true;
      }
    }
    return false;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}
