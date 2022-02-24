import { Injectable } from '@nestjs/common';
import { Customer } from './models/customer.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCustomerDto } from './dto/create-customer.dto';

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

  findOne(id: string): Promise<Customer> {
    return this.customerModel.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}
