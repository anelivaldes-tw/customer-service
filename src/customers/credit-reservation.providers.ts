import { CREDIT_RESERVATION_REPOSITORY } from '../constants';
import { CreditReservation } from './credit-reservation.entity';

export const creditReservationProviders = [
  {
    provide: CREDIT_RESERVATION_REPOSITORY,
    useValue: CreditReservation,
  },
];
