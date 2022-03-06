import {
  Column,
  Table,
  Model,
  ForeignKey,
  PrimaryKey,
} from 'sequelize-typescript';
import { Customer } from './customer.entity';

@Table
export class CreditReservation extends Model {
  @Column
  orderId: string;

  @Column
  orderTotal: number;

  @ForeignKey(() => Customer)
  @Column
  customerId: number;
}
