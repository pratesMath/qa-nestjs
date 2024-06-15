import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerProposalsService } from './customer_proposals.service';
import { CreateCustomerProposalDTO } from './dto/create-customer-proposal.dto';
import { CreateCustomerProposalsSwagger } from './swagger/create-customer-proposals.swagger';

@Controller('api/v1/customer-proposals')
@ApiTags('proposals')
export class CustomerProposalsController {
  constructor(
    private readonly customerProposalsService: CustomerProposalsService,
  ) {}

  @Post('/:customer_id/new')
  @ApiOperation({ summary: 'Cadastrar proposta de cliente' })
  @ApiResponse({ status: 201, description: 'cadastro de proposta do cliente' })
  @ApiResponse({ status: 400, description: 'corpo da requisição inválido' })
  async create(
    @Param('customer_id', new ParseUUIDPipe()) customerId: string,
    @Body() body: CreateCustomerProposalDTO,
  ) {
    return await this.customerProposalsService.create(customerId, body);
  }

  @Get('/:customer_id/all-proposals')
  @ApiOperation({ summary: 'Listar propostas do cliente' })
  @ApiResponse({
    status: 200,
    description: 'listagem de clientes',
    type: CreateCustomerProposalsSwagger,
    isArray: true,
  })
  async allProposals(
    @Param('customer_id', new ParseUUIDPipe()) customerId: string,
  ) {
    return await this.customerProposalsService.findAll(customerId);
  }

  @Delete('/:customer_id/cancel/:proposal_id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204
  @ApiOperation({ summary: 'Cancelar proposta' })
  async cancelProposal(
    @Param('customer_id', new ParseUUIDPipe()) customerId: string,
    @Param('proposal_id', new ParseUUIDPipe()) proposalId: string,
  ) {
    return await this.customerProposalsService.deleteById(
      customerId,
      proposalId,
    );
  }
}
