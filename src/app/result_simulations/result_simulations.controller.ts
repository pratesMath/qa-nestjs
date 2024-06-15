import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateResultSimulationDTO } from './dto/update-result-simulation.dto';
import { ResultSimulationsService } from './result_simulations.service';
import { CreateResultSimulationSwagger } from './swagger/create-result-simulation.swagger';

@Controller('api/v1/result-simulations')
@ApiTags('simulations')
export class ResultSimulationsController {
  constructor(
    private readonly resultSimulationsService: ResultSimulationsService,
  ) {}

  @Post('/:proposal_id/generate')
  @ApiOperation({ summary: 'Gerar resultado de simulação de cliente' })
  @ApiResponse({
    status: 201,
    description: 'gera resultado de simulação do crédito imobiliário',
    type: CreateResultSimulationSwagger,
  })
  @ApiResponse({ status: 400, description: 'corpo da requisição inválido' })
  async generate(
    @Param('proposal_id', new ParseUUIDPipe()) proposalId: string,
  ) {
    return await this.resultSimulationsService.generate(proposalId);
  }

  @Put('/update/:result_simulation_id')
  @ApiOperation({
    summary: 'Atualizar resultado da simulação do crédito imobiliário',
  })
  async update(
    @Param('result_simulation_id', new ParseUUIDPipe())
    resultSimulationId: string,
    @Body() body: UpdateResultSimulationDTO,
  ) {
    return await this.resultSimulationsService.update(resultSimulationId, body);
  }
}
