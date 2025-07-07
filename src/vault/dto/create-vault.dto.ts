import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateVaultDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsDateString()
  expiresAt: string;
}
