import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches, Min } from 'class-validator';
import {
  regexPhoneNumberBR,
  ValidateBirthDate,
  ValidateCPF,
} from '../../../utils/Validate';

export class CreateCustomerDTO {
  @IsNotEmpty({ message: 'Nome inválido' })
  @ApiProperty()
  fullName: string;

  @IsNotEmpty()
  @ValidateCPF({ message: 'CPF Inválido' })
  @ApiProperty()
  cpf: string;

  @IsNotEmpty({ message: 'Data de nascimento inválida' })
  @ApiProperty()
  @ValidateBirthDate(16, 75, {
    message: 'A idade deve estar entre 16 e 75 anos',
  })
  birthDate: string;

  @IsNotEmpty({ message: 'E-mail Inválido' })
  @IsEmail({}, { message: 'E-mail inválido' })
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @Matches(regexPhoneNumberBR, { message: 'N° de celular inválido' })
  @ApiProperty()
  phoneNumber: string;

  @IsNotEmpty({ message: 'Renda mensal inválida' })
  @Min(2500, { message: 'Renda mensal deve ser superior a R$ 2.5000,00' })
  @ApiProperty()
  monthlyIncome: number;
}
