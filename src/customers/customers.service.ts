import { Inject, Injectable } from '@nestjs/common';
import { Customer } from './customer.entity';
import { CustomerDto } from './dto/customer.dto';
import {
  CustomerEventTypes,
  OrderEvent,
} from '../event-publisher/models/events.model';
import {
  CREDIT_RESERVATION_REPOSITORY,
  CUSTOMER_REPOSITORY,
} from '../constants';
import { CreditReservation } from './credit-reservation.entity';

@Injectable()
export class CustomersService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: typeof Customer,
    @Inject(CREDIT_RESERVATION_REPOSITORY)
    private readonly creditReservationRepository: typeof CreditReservation,
  ) {}

  create(createCustomerDto: CustomerDto): Promise<Customer> {
    return this.customerRepository.create<Customer>({
      creditReservations: [],
      ...createCustomerDto,
    });
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

  async getReservedCredit(customerId: number) {
    const reservations =
      await this.creditReservationRepository.findAll<CreditReservation>({
        where: {
          customerId,
        },
      });
    return reservations.reduce(
      (previousValue, currentValue) => previousValue + currentValue.orderTotal,
      0,
    );
  }

  async validateOrder(orderEvent: OrderEvent): Promise<CustomerEventTypes> {
    const customer = await this.findOne(orderEvent.customerId);
    const reservedCredit = await this.getReservedCredit(customer.id);
    if (customer && customer.id) {
      if (orderEvent.orderTotal <= customer.creditLimit - reservedCredit) {
        // Add a new credit reservation
        this.creditReservationRepository.create<CreditReservation>({
          orderId: orderEvent.orderId,
          orderTotal: orderEvent.orderTotal,
          customerId: customer.id,
        });
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
