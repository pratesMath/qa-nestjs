import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, Max, Min } from 'class-validator';
import {
  BRStates,
  customerGoalOptions,
  minimumAmountFinance,
  minimumPropertyValue,
  periodIntendPurchaseOptions,
  propertyTypeOptions,
} from '../../../utils/Validate';

export class CreateCustomerProposalDTO {
  @IsNotEmpty({ message: 'Informe um objetivo válido' })
  @ApiProperty()
  @IsIn(customerGoalOptions)
  customerGoal: string;

  @IsNotEmpty({ message: 'Informe um tipo de imóvel válido' })
  @ApiProperty()
  @IsIn(propertyTypeOptions)
  propertyType: string;

  @IsNotEmpty({ message: 'Informe um período válido para adquirir o imóvel' })
  @ApiProperty()
  @IsIn(periodIntendPurchaseOptions)
  periodIntendPurchase: string;

  @IsNotEmpty({ message: 'Informe uma localização válida' })
  @ApiProperty()
  @IsIn(BRStates)
  propertyLocation: string;

  @IsNotEmpty()
  @ApiProperty()
  @Min(minimumPropertyValue, {
    message: 'Informe um valor superior a R$ 90.0000,00',
  })
  propertyValue: number;

  @IsNotEmpty({ message: 'Informe o valor a financiar' })
  @ApiProperty()
  @Min(minimumAmountFinance)
  amountFinance: number;

  @IsNotEmpty({ message: 'informe um prazo em anos' })
  @ApiProperty()
  @Min(1, { message: 'O prazo mínimo é de 1 ano' })
  @Max(35, { message: 'O prazo máximo é de 35 anos' })
  termYears: number;

  @ApiProperty()
  @IsIn(['Y', 'N'])
  statusITBI: string;
}
