import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerProposalsEntity } from '../customer_proposals/entity/customerProposals.entity';
import { UpdateResultSimulationDTO } from './dto/update-result-simulation.dto';
import { ResultSimulationsEntity } from './entity/resultSimulations.entity';
import { ResultSimulationsService } from './result_simulations.service';

const generatedResultSimulation = new ResultSimulationsEntity({
  proposalId: '1',
  fgtsValue: 0,
  entryValue: 300000 - 180000,
  financedExpensesValue: 15000,
  totalFinancingAmount: 15000 + 180000,
  firstInstallmentValue: ((15000 + 180000) / (20 * 12)) * 3.5,
  subsidizedEffectiveInterestRate: 12.29,
  segment: 'SELECT',
  insurance: 'ZURICH SANTANDER BRASIL SEGUROS S.A',
  offer: 'C/ RELAC POUP ASSALARIADO',
  installmentType: 'ATUALIZÁVEL TR/SAC',
  campaign: 'NENHUM',
});

const generatedResultSimulationList: ResultSimulationsEntity[] = [
  new ResultSimulationsEntity({
    proposalId: '1',
    fgtsValue: 0,
    entryValue: 300000 - 180000,
    financedExpensesValue: 15000,
    totalFinancingAmount: 15000 + 180000,
    firstInstallmentValue: ((15000 + 180000) / (20 * 12)) * 3.5,
    subsidizedEffectiveInterestRate: 12.29,
    segment: 'SELECT',
    insurance: 'ZURICH SANTANDER BRASIL SEGUROS S.A',
    offer: 'C/ RELAC POUP ASSALARIADO',
    installmentType: 'ATUALIZÁVEL TR/SAC',
    campaign: 'NENHUM',
  }),
  new ResultSimulationsEntity({
    proposalId: '2',
    fgtsValue: 0,
    entryValue: 300000 - 180000,
    financedExpensesValue: 15000,
    totalFinancingAmount: 15000 + 180000,
    firstInstallmentValue: ((15000 + 180000) / (20 * 12)) * 3.5,
    subsidizedEffectiveInterestRate: 12.29,
    segment: 'SELECT',
    insurance: 'ZURICH SANTANDER BRASIL SEGUROS S.A',
    offer: 'C/ RELAC POUP ASSALARIADO',
    installmentType: 'ATUALIZÁVEL TR/SAC',
    campaign: 'NENHUM',
  }),
];

const updatedResultSimulation = new ResultSimulationsEntity({
  fgtsValue: 8000,
  segment: 'PRIVATE',
  insurance: 'HDI SEGUROS S.A',
  offer: 'SEM RELACIONAMENTO',
  installmentType: 'SEM ATUALIZAÇÃO/PRICE',
  campaign: 'NENHUM',
});

const customerProposalEntity = new CustomerProposalsEntity({
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

describe('ResultSimulationsService', () => {
  let resultSimulationsService: ResultSimulationsService;
  let resultSimulationsRepository: Repository<ResultSimulationsEntity>;
  let customerProposalsRepository: Repository<CustomerProposalsEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResultSimulationsService,
        {
          provide: getRepositoryToken(ResultSimulationsEntity),
          useValue: {
            create: jest.fn().mockReturnValue(generatedResultSimulation),
            findOneOrFail: jest
              .fn()
              .mockResolvedValue(generatedResultSimulation),
            merge: jest.fn().mockReturnValue(updatedResultSimulation),
            save: jest.fn().mockResolvedValue(generatedResultSimulationList[0]),
          },
        },
        {
          provide: getRepositoryToken(CustomerProposalsEntity),
          useValue: {
            findOneOrFail: jest.fn().mockResolvedValue(customerProposalEntity),
          },
        },
      ],
    }).compile();

    resultSimulationsService = module.get<ResultSimulationsService>(
      ResultSimulationsService,
    );
    resultSimulationsRepository = module.get<
      Repository<ResultSimulationsEntity>
    >(getRepositoryToken(ResultSimulationsEntity));
    customerProposalsRepository = module.get<
      Repository<CustomerProposalsEntity>
    >(getRepositoryToken(CustomerProposalsEntity));
  });

  it('should be defined', () => {
    expect(resultSimulationsService).toBeDefined();
    expect(resultSimulationsRepository).toBeDefined();
    expect(customerProposalsRepository).toBeDefined();
  });

  describe('findProposalOrFail', () => {
    it('should return a customer proposal entity successfully', async () => {
      // Act
      const result = await resultSimulationsService.findProposalOrFail('1');
      // Assert
      expect(result).toEqual(customerProposalsEntityList[0]);
    });
    it('should throw an exception', () => {
      // Arrange
      jest
        .spyOn(customerProposalsRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());
      // Assert
      expect(resultSimulationsService.findProposalOrFail('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('generate', () => {
    it('should generate the result of simulation', async () => {
      // Act
      const result = await resultSimulationsService.generate('1');
      // Assert
      expect(result).toEqual(generatedResultSimulation);
      expect(resultSimulationsRepository.create).toHaveBeenCalledTimes(1);
      expect(resultSimulationsRepository.save).toHaveBeenCalledTimes(1);
    });
    it('should throw an exception', () => {
      // Arrange
      jest
        .spyOn(customerProposalsRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());
      // Assert
      expect(resultSimulationsService.findProposalOrFail('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneOrFail', () => {
    it('should return a result of simulation entity successfully', async () => {
      // Act
      const result = await resultSimulationsService.findOneOrFail('1');
      // Assert
      expect(result).toEqual(generatedResultSimulationList[0]);
      expect(resultSimulationsRepository.findOneOrFail).toHaveBeenCalledTimes(
        1,
      );
    });
    it('Should throw an exception', () => {
      // Arrange
      jest
        .spyOn(resultSimulationsRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());
      // Assert
      expect(resultSimulationsService.findOneOrFail('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a result of simulation entity successfully', async () => {
      // Arrange
      const data: UpdateResultSimulationDTO = {
        fgtsValue: 8000,
        segment: 'PRIVATE',
        insurance: 'HDI SEGUROS S.A',
        offer: 'SEM RELACIONAMENTO',
        installmentType: 'SEM ATUALIZAÇÃO/PRICE',
        campaign: 'NENHUM',
      };
      jest
        .spyOn(resultSimulationsRepository, 'save')
        .mockResolvedValueOnce(updatedResultSimulation);
      // Act
      const result = await resultSimulationsService.update('1', data);
      // Assert
      expect(result).toEqual(updatedResultSimulation);
    });
    it('Should throw an exception', () => {
      // Arrange
      jest
        .spyOn(resultSimulationsRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());
      // Assert
      expect(resultSimulationsService.findOneOrFail('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
