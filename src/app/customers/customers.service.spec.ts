import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomersService } from './customers.service';
import { CreateCustomerDTO } from './dto/create-customers.dto';
import { UpdateCustomerDTO } from './dto/update-customer.dto';
import { CustomersEntity } from './entity/customers.entity';

const customersEntityList: CustomersEntity[] = [
  new CustomersEntity({
    customerId: '1',
    fullName: 'Matheus',
    cpf: '224.781.170-10',
    birthDate: '2003-07-30',
    email: 'test.qa@teddy.com',
    monthlyIncome: 160000,
    phoneNumber: '(11)92233-4455',
  }),
  new CustomersEntity({
    customerId: '2',
    fullName: 'Pedro',
    cpf: '932.175.300-12',
    birthDate: '2003-12-30',
    email: 'test2.qa@teddy.com',
    monthlyIncome: 160000,
    phoneNumber: '(11)93344-5566',
  }),
];

const newCustomerEntity = new CustomersEntity({
  fullName: 'Marcos',
  birthDate: '1996-11-23',
  cpf: '653.064.250-11',
  email: 'marcos.test.qa@teddy.com',
  monthlyIncome: 12000,
  phoneNumber: '(11) 91244-3356',
});

const updatedCustomerEntity = new CustomersEntity({
  fullName: 'Marcos',
  birthDate: '1996-11-23',
  cpf: '653.064.250-11',
  email: 'updated.marcos.test.qa@teddy.com',
  monthlyIncome: 12000,
  phoneNumber: '(11) 91244-9090',
});

describe('CustomersService', () => {
  let customersService: CustomersService;
  let customersRepository: Repository<CustomersEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(CustomersEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(customersEntityList),
            findOneOrFail: jest.fn().mockResolvedValue(customersEntityList[0]),
            create: jest.fn().mockReturnValue(newCustomerEntity),
            merge: jest.fn().mockReturnValue(updatedCustomerEntity),
            save: jest.fn().mockResolvedValue(customersEntityList[0]),
            delete: jest.fn().mockReturnValue(undefined),
          },
        },
      ],
    }).compile();

    customersService = module.get<CustomersService>(CustomersService);
    customersRepository = module.get<Repository<CustomersEntity>>(
      getRepositoryToken(CustomersEntity),
    );
  });

  it('should be defined', () => {
    expect(customersService).toBeDefined();
    expect(customersRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a customer entity list successfully', async () => {
      // Act
      const result = await customersService.findAll();
      // Assert
      expect(result).toEqual(customersEntityList);
      expect(customersRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      // Arrange
      jest
        .spyOn(customersRepository, 'find')
        .mockRejectedValueOnce(new Error());
      // Assert
      expect(customersService.findAll()).rejects.toThrow();
    });
  });

  describe('findOneOrFail', () => {
    it('should return a customer entity successfully', async () => {
      // Act
      const result = await customersService.findOneOrFail('1');
      // Assert
      expect(result).toEqual(customersEntityList[0]);
      expect(customersRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });
    it('should throw an exception', () => {
      // Arrange
      jest
        .spyOn(customersRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());
      // Assert
      expect(customersService.findOneOrFail('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new customer entity successfully', async () => {
      // Arrange
      const data: CreateCustomerDTO = {
        fullName: 'Marcos',
        birthDate: '1996-11-23',
        cpf: '653.064.250-11',
        email: 'marcos.test.qa@teddy.com',
        monthlyIncome: 12000,
        phoneNumber: '(11) 91244-3356',
      };

      // Act
      const result = await customersService.create(data);

      // Assert
      expect(result).toEqual(customersEntityList[0]);
      expect(customersRepository.create).toHaveBeenCalledTimes(1);
      expect(customersRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // Arrange
      const data: CreateCustomerDTO = {
        fullName: 'Marcos',
        birthDate: '1996-11-23',
        cpf: '653.064.250-11',
        email: 'marcos.test.qa@teddy.com',
        monthlyIncome: 12000,
        phoneNumber: '(11) 91244-3356',
      };

      jest
        .spyOn(customersRepository, 'save')
        .mockRejectedValueOnce(new Error());

      // Assert
      expect(customersService.create(data)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a customer entity successfully', async () => {
      // Arrange
      const data: UpdateCustomerDTO = {
        fullName: 'Marcos',
        birthDate: '1996-11-23',
        cpf: '653.064.250-11',
        email: 'updated.marcos.test.qa@teddy.com',
        monthlyIncome: 12000,
        phoneNumber: '(11) 91244-9090',
      };

      jest
        .spyOn(customersRepository, 'save')
        .mockResolvedValueOnce(updatedCustomerEntity);
      // Act
      const result = await customersService.update('1', data);
      // Assert
      expect(result).toEqual(updatedCustomerEntity);
    });
    it('should throw a not found exception', () => {
      // Arrange
      const data: UpdateCustomerDTO = {
        fullName: 'Marcos',
        birthDate: '1996-11-23',
        cpf: '653.064.250-11',
        email: 'updated.marcos.test.qa@teddy.com',
        monthlyIncome: 12000,
        phoneNumber: '(11) 91244-9090',
      };

      jest
        .spyOn(customersRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());
      // Assert
      expect(customersService.update('1', data)).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should throw an exception', () => {
      // Arrange
      const data: UpdateCustomerDTO = {
        fullName: 'Marcos',
        birthDate: '1996-11-23',
        cpf: '653.064.250-11',
        email: 'updated.marcos.test.qa@teddy.com',
        monthlyIncome: 12000,
        phoneNumber: '(11) 91244-9090',
      };
      jest
        .spyOn(customersRepository, 'save')
        .mockRejectedValueOnce(new Error());

      // Assert
      expect(customersService.update('1', data)).rejects.toThrow();
    });
  });

  describe('deleteById', () => {
    it('should delete a customer entity successfully', async () => {
      // Act
      const result = await customersService.deleteById('1');
      // Assert
      expect(result).toBeUndefined();
      expect(customersRepository.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(customersRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw a not found exception', () => {
      // Arrange
      jest
        .spyOn(customersRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());
      // Assert
      expect(customersService.deleteById('1')).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should throw an exception', () => {
      // Arrange
      jest
        .spyOn(customersRepository, 'delete')
        .mockRejectedValueOnce(new Error());
      // Assert
      expect(customersService.deleteById('1')).rejects.toThrow();
    });
  });
});
