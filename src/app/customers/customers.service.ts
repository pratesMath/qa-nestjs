import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDTO } from './dto/create-customers.dto';
import { UpdateCustomerDTO } from './dto/update-customer.dto';
import { CustomersEntity } from './entity/customers.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomersEntity)
    private readonly customersRepository: Repository<CustomersEntity>,
  ) {}

  async create(data: CreateCustomerDTO) {
    return await this.customersRepository.save(
      this.customersRepository.create(data),
    );
  }

  async findAll() {
    return await this.customersRepository.find();
  }

  async findOneOrFail(id: string) {
    try {
      const foundCustomer = await this.customersRepository.findOneOrFail({
        where: { customerId: id },
      });

      return foundCustomer;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(id: string, data: UpdateCustomerDTO) {
    const customer = await this.findOneOrFail(id);

    this.customersRepository.merge(customer, data);

    return await this.customersRepository.save(customer);
  }

  async deleteById(id: string) {
    await this.findOneOrFail(id);

    await this.customersRepository.delete(id);
  }
}
