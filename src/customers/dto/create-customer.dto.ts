import { Model } from 'sequelize';

export class CreateCustomerDto extends Model {
  firstName: string;
  lastName: string;
}
