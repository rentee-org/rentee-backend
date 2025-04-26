import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  data?: T;
}
