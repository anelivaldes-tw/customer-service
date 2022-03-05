import { ApiProperty } from '@nestjs/swagger';

export class CustomerDto {
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  creditLimit: number;
}
