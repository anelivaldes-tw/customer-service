import { Column, Table, Model, HasMany } from 'sequelize-typescript';
import { CreditReservation } from './credit-reservation.entity';

@Table
export class Customer extends Model {
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  creditLimit: number;

  @HasMany(() => CreditReservation)
  creditReservations: CreditReservation[];
}
