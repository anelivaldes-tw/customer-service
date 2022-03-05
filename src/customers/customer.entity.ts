import { Column, Table, Model } from 'sequelize-typescript';

@Table
export class Customer extends Model {
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  creditLimit: number;
}
