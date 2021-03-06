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

  async findOne(id: string): Promise<any> {
    const customer: Customer = await this.customerRepository.findOne<Customer>({
      where: {
        id,
      },
    });
    if (customer) {
      const reservedCredit = await this.getReservedCredit(parseInt(id));
      const { firstName, lastName, creditLimit } = customer;
      return {
        id,
        firstName,
        lastName,
        creditLimit,
        availableCredit: customer.creditLimit - reservedCredit,
      };
    }
    return customer;
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

  async orderHasBeenProcessed(orderId: string) {
    // TODO:
    //  We must save all processed messages, and persist at least the orderId, now we are checking
    //  only against the messages that where successfully reserved. That is not enough
    //  but for now we avoid a possible double credit reservation
    const order =
      await this.creditReservationRepository.findOne<CreditReservation>({
        where: {
          orderId,
        },
      });
    return order != null;
  }

  async reserveCredit(orderEvent: OrderEvent): Promise<CustomerEventTypes> {
    const customer = await this.findOne(orderEvent.customerId);
    if (customer && customer.id) {
      const reservedCredit = await this.getReservedCredit(customer.id);
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
