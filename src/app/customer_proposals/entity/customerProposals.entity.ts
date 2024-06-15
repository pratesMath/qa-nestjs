import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomersEntity } from '../../customers/entity/customers.entity';
import { ResultSimulationsEntity } from '../../result_simulations/entity/resultSimulations.entity';

@Entity({ name: 'customer_proposals' })
export class CustomerProposalsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'proposal_id' })
  @ApiProperty()
  proposalId: string;

  @ApiProperty()
  @Column({ name: 'customer_id' })
  customerId: string;
  @ManyToOne(
    () => CustomersEntity,
    (customer: CustomersEntity) => customer.customerId,
  )
  @JoinColumn({ name: 'customer_id' })
  customerIdFK: CustomersEntity;

  @ApiProperty()
  @Column({ name: 'customer_goal' })
  customerGoal: string;

  @ApiProperty()
  @Column({ name: 'property_type' })
  propertyType: string;

  @ApiProperty()
  @Column({ name: 'period_intend_purchase' })
  periodIntendPurchase: string;

  @ApiProperty()
  @Column({ name: 'property_location' })
  propertyLocation: string;

  @ApiProperty()
  @Column({ name: 'property_value' })
  propertyValue: number;

  @ApiProperty()
  @Column({ name: 'amount_finance' })
  amountFinance: number;

  @ApiProperty()
  @Column({ name: 'term_years' })
  termYears: number;

  @ApiProperty()
  @Column({ name: 'status_itbi' })
  statusITBI: string;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: string;

  @OneToOne(
    () => ResultSimulationsEntity,
    (resultSimulation: ResultSimulationsEntity) => resultSimulation.proposalId,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  resultSimulation: ResultSimulationsEntity;

  constructor(customerProposals?: Partial<CustomerProposalsEntity>) {
    this.proposalId = customerProposals?.proposalId;
    this.customerId = customerProposals?.customerId;
    this.customerGoal = customerProposals?.customerGoal;
    this.propertyType = customerProposals?.propertyType;
    this.periodIntendPurchase = customerProposals?.periodIntendPurchase;
    this.propertyLocation = customerProposals?.propertyLocation;
    this.propertyValue = customerProposals?.propertyValue;
    this.amountFinance = customerProposals?.amountFinance;
    this.termYears = customerProposals?.termYears;
    this.statusITBI = customerProposals?.statusITBI;
    this.createdAt = customerProposals?.createdAt;
    this.updatedAt = customerProposals?.updatedAt;
  }
}
