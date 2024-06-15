import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  campaignOptions,
  installmentTypeOptions,
  insuranceOptions,
  offerOptions,
  segmentOptions,
} from '../../utils/Validate';
import { CustomerProposalsEntity } from '../customer_proposals/entity/customerProposals.entity';
import { UpdateResultSimulationDTO } from './dto/update-result-simulation.dto';
import { ResultSimulationsEntity } from './entity/resultSimulations.entity';

@Injectable()
export class ResultSimulationsService {
  constructor(
    @InjectRepository(ResultSimulationsEntity)
    private readonly resultSimulationRepository: Repository<ResultSimulationsEntity>,
    @InjectRepository(CustomerProposalsEntity)
    private readonly customerProposalsRepository: Repository<CustomerProposalsEntity>,
  ) {}

  async findProposalOrFail(proposalId: string) {
    try {
      const foundProposal =
        await this.customerProposalsRepository.findOneOrFail({
          where: { proposalId },
        });
      return foundProposal;
    } catch (error) {
      throw new NotFoundException('Proposta não encontrada');
    }
  }

  async generate(id: string) {
    const { proposalId, propertyValue, amountFinance, termYears } =
      await this.findProposalOrFail(id);

    const financedExpensesValue = 15000;
    const totalFinancingAmount = financedExpensesValue + amountFinance;
    const subsidizedEffectiveInterestRate = 12.29;
    const segment = segmentOptions[0];
    const insurance = insuranceOptions[0];
    const offer = offerOptions[0];
    const installmentType = installmentTypeOptions[0];
    const campaign = campaignOptions[0];

    const generatedResultSimulation = this.resultSimulationRepository.create({
      proposalId,
      fgtsValue: 0,
      entryValue: propertyValue - amountFinance,
      financedExpensesValue,
      totalFinancingAmount,
      firstInstallmentValue: (totalFinancingAmount / (termYears * 12)) * 3.5,
      subsidizedEffectiveInterestRate,
      segment,
      insurance,
      offer,
      installmentType,
      campaign,
    });

    return await this.resultSimulationRepository.save(
      generatedResultSimulation,
    );
  }

  async findOneOrFail(id: string) {
    try {
      const foundResultSimulation =
        await this.resultSimulationRepository.findOneOrFail({
          where: { resultSimulationId: id },
        });
      return foundResultSimulation;
    } catch (error) {
      throw new NotFoundException('Simulação não encontrada');
    }
  }
  async update(id: string, data: UpdateResultSimulationDTO) {
    const resultSimulation = await this.findOneOrFail(id);

    this.resultSimulationRepository.merge(resultSimulation, data);

    return await this.resultSimulationRepository.save(resultSimulation);
  }
}
