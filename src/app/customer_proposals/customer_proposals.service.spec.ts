import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import HttpException from '../../utils/HttpException';
import { CustomersEntity } from '../customers/entity/customers.entity';
import { CustomerProposalsService } from './customer_proposals.service';
import { CreateCustomerProposalDTO } from './dto/create-customer-proposal.dto';
import { CustomerProposalsEntity } from './entity/customerProposals.entity';

const newCustomerProposalEntity = new CustomerProposalsEntity({
  customerGoal: 'Financiamento de Imóvel',
  propertyType: 'Residencial',
  periodIntendPurchase: 'EM ATÉ 3 MESES',
  propertyLocation: 'SP',
  propertyValue: 300000,
  amountFinance: 120000,
  termYears: 15,
  statusITBI: 'Y',
});

const customerProposalsEntityList: CustomerProposalsEntity[] = [
  new CustomerProposalsEntity({
    customerGoal: 'Financiamento de Imóvel',
    propertyType: 'Residencial',
    periodIntendPurchase: 'EM ATÉ 3 MESES',
    propertyLocation: 'SP',
    propertyValue: 300000,
    amountFinance: 120000,
    termYears: 15,
    statusITBI: 'Y',
  }),
  new CustomerProposalsEntity({
    customerGoal: 'Financiamento de Imóvel',
    propertyType: 'Residencial',
    periodIntendPurchase: 'EM ATÉ 3 MESES',
    propertyLocation: 'SP',
    propertyValue: 300000,
    amountFinance: 120000,
    termYears: 15,
    statusITBI: 'Y',
  }),
];

const customerEntity = new CustomersEntity({
  fullName: 'Marcos',
  birthDate: '1996-11-23',
  cpf: '653.064.250-11',
  email: 'marcos.test.qa@teddy.com',
  monthlyIncome: 12000,
  phoneNumber: '(11) 91244-3356',
});

describe('CustomerProposalsService', () => {
  let customerProposalsService: CustomerProposalsService;
  let customerProposalsRepository: Repository<CustomerProposalsEntity>;
  let customersRepository: Repository<CustomersEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerProposalsService,
        {
          provide: getRepositoryToken(CustomerProposalsEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(customerProposalsEntityList[0]),
            create: jest.fn().mockReturnValue(newCustomerProposalEntity),
            find: jest.fn().mockResolvedValue(customerProposalsEntityList),
            delete: jest.fn().mockReturnValue(undefined),
          },
        },
        {
          provide: getRepositoryToken(CustomersEntity),
          useValue: {
            findOneOrFail: jest.fn().mockResolvedValue(customerEntity),
          },
        },
      ],
    }).compile();

    customerProposalsService = module.get<CustomerProposalsService>(
      CustomerProposalsService,
    );
    customerProposalsRepository = module.get<
      Repository<CustomerProposalsEntity>
    >(getRepositoryToken(CustomerProposalsEntity));
    customersRepository = module.get<Repository<CustomersEntity>>(
      getRepositoryToken(CustomersEntity),
    );
  });

  it('should be defined', () => {
    expect(customerProposalsService).toBeDefined();
    expect(customerProposalsRepository).toBeDefined();
    expect(customersRepository).toBeDefined();
  });

  describe('findCustomerOrFail', () => {
    it('should return a customer entity successfully', async () => {
      // Act
      const result = await customerProposalsService.findCustomerOrFail('1');
      // Assert
      expect(result).toEqual(customerEntity);
      expect(customersRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });
    it('should throw an exception', () => {
      // Assert
      jest
        .spyOn(customersRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());
      // Assert
      expect(customerProposalsService.findCustomerOrFail('1')).resolves.toThrow(
        HttpException,
      );
    });
  });

  describe('findAll', () => {
    it('should return a customer proposal entity list successfully', async () => {
      // Arrange
      jest
        .spyOn(customerProposalsService, 'findCustomerOrFail')
        .mockResolvedValue(customerEntity[0]);
      // Act
      const result = await customerProposalsService.findAll('1');
      // Assert
      expect(result).toEqual(customerProposalsEntityList);
      expect(customerProposalsService.findCustomerOrFail).toHaveBeenCalledTimes(
        1,
      );
      expect(customerProposalsRepository.find).toHaveBeenCalledTimes(1);
    });
    it('should throw an exception', () => {
      // Arrange
      jest
        .spyOn(customerProposalsRepository, 'find')
        .mockRejectedValueOnce(new Error());
      // Assert
      expect(customerProposalsService.findAll('1')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a new customer proposal entity successfully', async () => {
      const data: CreateCustomerProposalDTO = {
        customerGoal: 'Financiamento de Imóvel',
        propertyType: 'Residencial',
        periodIntendPurchase: 'EM ATÉ 3 MESES',
        propertyLocation: 'SP',
        propertyValue: 300000,
        amountFinance: 120000, // Respeita limite de 70%
        termYears: 15,
        statusITBI: 'Y',
      };

      // Act
      const result = await customerProposalsService.create('1', data);

      // Assert
      expect(result).toEqual(customerProposalsEntityList[0]);
      expect(customersRepository.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(customersRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { customerId: '1' },
      });
      expect(customerProposalsRepository.create).toHaveBeenCalledTimes(1);
      expect(customerProposalsRepository.save).toHaveBeenCalledTimes(1);
      expect(customerProposalsRepository.save).toHaveBeenCalledWith({
        customerId: customerEntity.customerId,
        ...data,
      });
    });
    it('should throw an exception', () => {
      // Arrange
      const data: CreateCustomerProposalDTO = {
        customerGoal: 'Financiamento de Imóvel',
        propertyType: 'Residencial',
        periodIntendPurchase: 'EM ATÉ 3 MESES',
        propertyLocation: 'SP',
        propertyValue: 300000,
        amountFinance: 120000, // Respeita limite de 70%
        termYears: 15,
        statusITBI: 'Y',
      };

      jest
        .spyOn(customerProposalsRepository, 'save')
        .mockRejectedValueOnce(new Error());

      // Assert
      expect(customerProposalsService.create('1', data)).rejects.toThrow();
    });
    it('should throw an exception when amountFinance is greater than 70% of propertyValue', async () => {
      // Arrange
      const data: CreateCustomerProposalDTO = {
        customerGoal: 'Financiamento de Imóvel',
        propertyType: 'Residencial',
        periodIntendPurchase: 'EM ATÉ 3 MESES',
        propertyLocation: 'SP',
        propertyValue: 300000,
        amountFinance: 210001, // Excede 70% do valor do imóvel
        termYears: 15,
        statusITBI: 'Y',
      };

      // Act
      await expect(customerProposalsService.create('1', data)).resolves.toThrow(
        HttpException,
      );
      // Assert
      expect(customerProposalsRepository.save).toHaveBeenCalledTimes(0);
    });
    it('should throw an HttpException when customer age + term exceeds 80 years', async () => {
      // Arrange
      const data: CreateCustomerProposalDTO = {
        customerGoal: 'Financiamento de Imóvel',
        propertyType: 'Residencial',
        periodIntendPurchase: 'EM ATÉ 3 MESES',
        propertyLocation: 'SP',
        propertyValue: 300000,
        amountFinance: 120000,
        termYears: 35,
        statusITBI: 'Y',
      };

      // Modificar diretamente a propriedade birthDate
      customerEntity.birthDate = '1944-11-23';

      // Act
      await expect(customerProposalsService.create('1', data)).resolves.toThrow(
        HttpException,
      );
      // Assert
      expect(customerProposalsRepository.save).toHaveBeenCalledTimes(0);
    });
  });
});
