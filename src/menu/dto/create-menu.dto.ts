import { IsNotEmpty, IsString, isString } from 'class-validator';

export class CreateMenuDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
