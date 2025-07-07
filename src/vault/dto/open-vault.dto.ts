import { IsString, IsNotEmpty } from 'class-validator';

export class OpenVaultDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  ip: string;

  @IsString()
  @IsNotEmpty()
  userAgent: string;
}
