import { IsEmail, IsISO31661Alpha2, IsMobilePhone, IsNotEmpty, IsString } from 'class-validator';

export class NewUserDTO {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  passwordConfirmed: string;
}

export class PhoneRegistrationDTO extends NewUserDTO {
  @IsNotEmpty()
  @IsISO31661Alpha2()
  countryCode: string;

  @IsNotEmpty()
  @IsMobilePhone()
  phone: string;
}

export class EmailRegistrationDTO extends NewUserDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
