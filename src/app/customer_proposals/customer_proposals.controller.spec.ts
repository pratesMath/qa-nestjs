import { Test, TestingModule } from '@nestjs/testing';
import { CustomerProposalsController } from './customer_proposals.controller';
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

describe('CustomerProposalsController', () => {
  let customerProposalsController: CustomerProposalsController;
  let customerProposalsService: CustomerProposalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerProposalsController],
      providers: [
        {
          provide: CustomerProposalsService,
          useValue: {
            create: jest.fn().mockResolvedValue(newCustomerProposalEntity),
            findAll: jest.fn().mockResolvedValue(customerProposalsEntityList),
            findCustomerOrFail: jest
              .fn()
              .mockResolvedValue(customerProposalsEntityList[0]),
            deleteById: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    customerProposalsController = module.get<CustomerProposalsController>(
      CustomerProposalsController,
    );
    customerProposalsService = module.get<CustomerProposalsService>(
      CustomerProposalsService,
    );
  });

  it('should be defined', () => {
    expect(customerProposalsController).toBeDefined();
    expect(customerProposalsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new customer proposal successfully', async () => {
      // Arrange
      const body: CreateCustomerProposalDTO = {
        customerGoal: 'Financiamento de Imóvel',
        propertyType: 'Residencial',
        periodIntendPurchase: 'EM ATÉ 3 MESES',
        propertyLocation: 'SP',
        propertyValue: 300000,
        amountFinance: 120000,
        termYears: 15,
        statusITBI: 'Y',
      };
      // Act
      const result = await customerProposalsController.create('1', body);
      // Assert
      expect(result).toEqual(newCustomerProposalEntity);
      expect(customerProposalsService.create).toHaveBeenCalledTimes(1);
      expect(customerProposalsService.create).toHaveBeenCalledWith('1', body);
    });
    it('should throw an exception', () => {
      // Arrange
      jest
        .spyOn(customerProposalsService, 'create')
        .mockRejectedValueOnce(new Error());

      const body: CreateCustomerProposalDTO = {
        customerGoal: 'Financiamento de Imóvel',
        propertyType: 'Residencial',
        periodIntendPurchase: 'EM ATÉ 3 MESES',
        propertyLocation: 'SP',
        propertyValue: 300000,
        amountFinance: 120000,
        termYears: 15,
        statusITBI: 'Y',
      };
      // Assert
      expect(customerProposalsController.create('1', body)).rejects.toThrow();
    });
  });

  describe('all proposals', () => {
    it('should return a customer entity list successfully', async () => {
      // Act
      const result = await await customerProposalsController.allProposals('1');
      // Assert
      expect(result).toEqual(customerProposalsEntityList);
      expect(typeof result).toEqual('object'); // Array é um objeto em JS
      expect(customerProposalsService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // Arrange
      jest
        .spyOn(customerProposalsService, 'findAll')
        .mockRejectedValueOnce(new Error());
      // Assert
      expect(customerProposalsController.allProposals('1')).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should remove a customer successfully', async () => {
      // Act
      const result = await customerProposalsController.cancelProposal('1', '2');
      // Assert
      expect(result).toBeUndefined();
    });
    it('should throw an exception', () => {
      // Arrange
      jest
        .spyOn(customerProposalsService, 'deleteById')
        .mockRejectedValueOnce(new Error());
      // Assert
      expect(
        customerProposalsController.cancelProposal('1', '2'),
      ).rejects.toThrow();
    });
  });
});
