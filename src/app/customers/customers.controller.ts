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
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDTO } from './dto/create-customers.dto';
import { UpdateCustomerDTO } from './dto/update-customer.dto';
import { CreateCustomersSwagger } from './swagger/create-customers.swagger';

@Controller('api/v1/customers')
@ApiTags('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('/new')
  @ApiOperation({ summary: 'Cadastrar cliente' })
  @ApiResponse({ status: 201, description: 'cadastro de cliente' })
  @ApiResponse({ status: 400, description: 'corpo da requisição inválido' })
  async create(@Body() body: CreateCustomerDTO) {
    return await this.customersService.create(body);
  }

  @Get('/all-customers')
  @ApiOperation({ summary: 'Listar clientes cadastrados' })
  @ApiResponse({
    status: 200,
    description: 'listagem de clientes',
    type: CreateCustomersSwagger,
    isArray: true,
  })
  async allCustomers() {
    return await this.customersService.findAll();
  }

  @Get('/:customer_id')
  @ApiOperation({ summary: 'Listar cliente pelo id' })
  async show(@Param('customer_id', new ParseUUIDPipe()) customerId: string) {
    return await this.customersService.findOneOrFail(customerId);
  }

  @Put('/update/:customer_id')
  @ApiOperation({ summary: 'Atualizar cliente cadastrado' })
  async update(
    @Param('customer_id', new ParseUUIDPipe()) customerId: string,
    @Body() body: UpdateCustomerDTO,
  ) {
    return await this.customersService.update(customerId, body);
  }

  @Delete('/delete/:customer_id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204
  @ApiOperation({ summary: 'Excluir cliente cadastrado' })
  async delete(@Param('customer_id', new ParseUUIDPipe()) customerId: string) {
    return await this.customersService.deleteById(customerId);
  }
}
