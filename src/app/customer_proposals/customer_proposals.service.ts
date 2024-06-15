import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { calculateCustomerAge } from '../../utils/calculateCustomerAge';
import HttpException from '../../utils/HttpException';
import { CustomersEntity } from '../customers/entity/customers.entity';
import { CreateCustomerProposalDTO } from './dto/create-customer-proposal.dto';
import { CustomerProposalsEntity } from './entity/customerProposals.entity';

@Injectable()
export class CustomerProposalsService {
  constructor(
    @InjectRepository(CustomerProposalsEntity)
    private readonly customerProposalsRepository: Repository<CustomerProposalsEntity>,
    @InjectRepository(CustomersEntity)
    private readonly customersRepository: Repository<CustomersEntity>,
  ) {}

  async findCustomerOrFail(customerId: string) {
    try {
      const foundCustomer = await this.customersRepository.findOneOrFail({
        where: { customerId },
      });
      return foundCustomer;
    } catch (error) {
      return new HttpException(HttpStatus.NOT_FOUND, 'Cliente não encontrado');
    }
  }

  async findAll(customerId: string) {
    const foundCustomer = await this.findCustomerOrFail(customerId);

    if (!(foundCustomer instanceof HttpException)) {
      return await this.customerProposalsRepository.find();
    }
  }

  async create(customerId: string, data: CreateCustomerProposalDTO) {
    const foundCustomer = await this.findCustomerOrFail(customerId);

    if (!(foundCustomer instanceof HttpException)) {
      // verificar se o valor a financiar é superior a 70% da propriedade:
      const isGreaterThan70Percent =
        data.amountFinance > (70 / 100) * data.propertyValue;

      if (isGreaterThan70Percent) {
        return new HttpException(
          400,
          'O valor a financiar não pode ser superior a 70% do valor do imóvel',
        );
      }
      // calcular idade do cliente, somar ao "prazo em anos"
      //e verificar se a soma de ambos é superior a 80 anos
      const isGreaterThan80Years =
        calculateCustomerAge(new Date(foundCustomer.birthDate)) +
          data.termYears >
        80;
      if (isGreaterThan80Years) {
        return new HttpException(
          400,
          'A soma do prazo do financiamento com a idade do proponente mais velho não poderá ser superior a 80 anos e 6 meses.',
        );
      }

      return await this.customerProposalsRepository.save(
        this.customerProposalsRepository.create({
          customerId: foundCustomer.customerId,
          ...data,
        }),
      );
    }
  }

  async deleteById(customerId: string, proposalId: string) {
    const foundCustomer = await this.findCustomerOrFail(customerId);

    if (!(foundCustomer instanceof HttpException)) {
      return await this.customerProposalsRepository.delete(proposalId);
    }
  }
}
