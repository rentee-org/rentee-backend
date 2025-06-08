import { ApiProperty } from '@nestjs/swagger';

export class CustomApiResponse<T> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  data?: T;
}
