import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerProposalsEntity } from '../../customer_proposals/entity/customerProposals.entity';

@Entity({ name: 'result_simulations' })
export class ResultSimulationsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'result_simulation_id' })
  resultSimulationId: string;

  @ApiProperty()
  @Column({ name: 'proposal_id' })
  proposalId: string;
  @OneToOne(
    () => CustomerProposalsEntity,
    (customerProposal: CustomerProposalsEntity) => customerProposal.customerId,
  )
  @JoinColumn({ name: 'proposal_id' })
  proposalIdFK: CustomerProposalsEntity;

  @ApiProperty()
  @Column({ name: 'fgts_value' })
  fgtsValue: number;

  @ApiProperty()
  @Column({ name: 'entry_value' })
  entryValue: number;

  @ApiProperty()
  @Column({ name: 'financed_expenses_value' })
  financedExpensesValue: number;

  @ApiProperty()
  @Column({ name: 'total_financing_amount' })
  totalFinancingAmount: number;

  @ApiProperty()
  @Column({ name: 'first_installment_value' })
  firstInstallmentValue: number;

  @ApiProperty()
  @Column({ name: 'subsidized_effective_interest_rate' })
  subsidizedEffectiveInterestRate: number;

  @ApiProperty()
  @Column({ name: 'segment' })
  segment: string;

  @ApiProperty()
  @Column({ name: 'insurance' })
  insurance: string;

  @ApiProperty()
  @Column({ name: 'offer' })
  offer: string;

  @ApiProperty()
  @Column({ name: 'installment_type' })
  installmentType: string;

  @ApiProperty()
  @Column({ name: 'campaign' })
  campaign: string;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: string;

  constructor(resultSimulation?: Partial<ResultSimulationsEntity>) {
    this.resultSimulationId = resultSimulation?.resultSimulationId;
    this.proposalId = resultSimulation?.proposalId;
    this.fgtsValue = resultSimulation?.fgtsValue;
    this.entryValue = resultSimulation?.entryValue;
    this.financedExpensesValue = resultSimulation?.financedExpensesValue;
    this.totalFinancingAmount = resultSimulation?.totalFinancingAmount;
    this.firstInstallmentValue = resultSimulation?.firstInstallmentValue;
    this.subsidizedEffectiveInterestRate =
      resultSimulation?.subsidizedEffectiveInterestRate;
    this.segment = resultSimulation?.segment;
    this.insurance = resultSimulation?.insurance;
    this.offer = resultSimulation?.campaign;
    this.installmentType = resultSimulation?.campaign;
    this.campaign = resultSimulation?.campaign;
    this.createdAt = resultSimulation?.createdAt;
    this.updatedAt = resultSimulation?.updatedAt;
  }
}
