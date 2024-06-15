import { Test, TestingModule } from '@nestjs/testing';
import { ResultSimulationsEntity } from './entity/resultSimulations.entity';
import { ResultSimulationsController } from './result_simulations.controller';
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

const updatedResultSimulation = {
  fgtsValue: 8000,
  segment: 'PRIVATE',
  insurance: 'HDI SEGUROS S.A',
  offer: 'SEM RELACIONAMENTO',
  installmentType: 'SEM ATUALIZAÇÃO/PRICE',
  campaign: 'NENHUM',
};

describe('ResultSimulationsController', () => {
  let resultSimulationsController: ResultSimulationsController;
  let resultSimulationsService: ResultSimulationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResultSimulationsController],
      providers: [
        {
          provide: ResultSimulationsService,
          useValue: {
            findProposalOrFail: jest.fn(),
            generate: jest.fn().mockReturnValue(generatedResultSimulation),
            findOneOrFail: jest.fn(),
            update: jest.fn().mockResolvedValue(updatedResultSimulation),
          },
        },
      ],
    }).compile();

    resultSimulationsController = module.get<ResultSimulationsController>(
      ResultSimulationsController,
    );
    resultSimulationsService = module.get<ResultSimulationsService>(
      ResultSimulationsService,
    );
  });

  it('should be defined', () => {
    expect(resultSimulationsController).toBeDefined();
    expect(resultSimulationsService).toBeDefined();
  });
  describe('generate', () => {
    it('should generate the result of simulation', async () => {
      // Act
      const result = await resultSimulationsController.generate('1');
      // Assert
      expect(result).toEqual(generatedResultSimulation);
      expect(resultSimulationsService.generate).toHaveBeenCalledTimes(1);
      expect(resultSimulationsService.generate).toHaveBeenCalledWith('1');
    });
    it('should throw an exception', () => {
      // Arrange
      jest
        .spyOn(resultSimulationsService, 'generate')
        .mockRejectedValueOnce(new Error());
      // Assert
      expect(resultSimulationsController.generate('1')).rejects.toThrow();
    });
  });
  describe('update', () => {
    it('should update the result of simulation', async () => {
      // Arrange
      const body = {
        fgtsValue: 8000,
        segment: 'PRIVATE',
        insurance: 'HDI SEGUROS S.A',
        offer: 'SEM RELACIONAMENTO',
        installmentType: 'SEM ATUALIZAÇÃO/PRICE',
        campaign: 'NENHUM',
      };
      // Act
      const result = await resultSimulationsController.update('1', body);
      // Assert
      expect(result).toEqual(updatedResultSimulation);
      expect(resultSimulationsService.update).toHaveBeenCalledTimes(1);
      expect(resultSimulationsService.update).toHaveBeenCalledWith('1', body);
    });
    it('should throw an exception', () => {
      // Arrange
      const body = {
        fgtsValue: 8000,
        segment: 'PRIVATE',
        insurance: 'HDI SEGUROS S.A',
        offer: 'SEM RELACIONAMENTO',
        installmentType: 'SEM ATUALIZAÇÃO/PRICE',
        campaign: 'NENHUM',
      };
      jest
        .spyOn(resultSimulationsService, 'update')
        .mockRejectedValueOnce(new Error());
      // Assert
      expect(resultSimulationsService.update('1', body)).rejects.toThrow();
    });
  });
});
