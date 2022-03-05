import { CUSTOMER_REPOSITORY } from '../constants';
import { Customer } from './customer.entity';

export const customersProviders = [
  {
    provide: CUSTOMER_REPOSITORY,
    useValue: Customer,
  },
];
