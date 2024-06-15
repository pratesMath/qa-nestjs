import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, Min } from 'class-validator';
import {
  campaignOptions,
  installmentTypeOptions,
  insuranceOptions,
  offerOptions,
  segmentOptions,
} from '../../../utils/Validate';

export class UpdateResultSimulationDTO {
  @IsNotEmpty({ message: 'Informe um FGTS válido' })
  @ApiProperty()
  @Min(0, { message: 'FGTS não pode estar abaixo de R$ 0,00' })
  fgtsValue: number;

  @IsNotEmpty({ message: 'Informe um segmento válido' })
  @ApiProperty()
  @IsIn(segmentOptions)
  segment: string;

  @IsNotEmpty({ message: 'Informe uma seguradora válida' })
  @ApiProperty()
  @IsIn(insuranceOptions)
  insurance: string;

  @IsNotEmpty({ message: 'Informe uma oferta válida' })
  @ApiProperty()
  @IsIn(offerOptions)
  offer: string;

  @IsNotEmpty({ message: 'Informe um tipo de parcela válida' })
  @ApiProperty()
  @IsIn(installmentTypeOptions)
  installmentType: string;

  @IsNotEmpty({ message: 'Informe uma campanha válida' })
  @ApiProperty()
  @IsIn(campaignOptions)
  campaign: string;
}
