import { Model } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto extends Model {
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
}
