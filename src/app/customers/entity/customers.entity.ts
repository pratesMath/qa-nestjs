import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerProposalsEntity } from '../../customer_proposals/entity/customerProposals.entity';

@Entity({ name: 'customers' })
export class CustomersEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'customer_id' })
  @ApiProperty()
  customerId: string;

  @Column({ name: 'full_name', type: 'varchar', length: '256' })
  @ApiProperty()
  fullName: string;

  @Column('varchar')
  @ApiProperty()
  cpf: string;

  @Column({ name: 'birth_date', type: 'date' })
  @ApiProperty()
  birthDate: string;

  @Column({ name: 'email', type: 'varchar', length: '256' })
  @ApiProperty()
  email: string;

  @Column({ name: 'phone_number', type: 'varchar' })
  @ApiProperty()
  phoneNumber: string;

  @Column({ name: 'monthly_income', type: 'numeric' })
  @ApiProperty()
  monthlyIncome: number;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: string;

  @OneToMany(
    () => CustomerProposalsEntity,
    (customerProposals: CustomerProposalsEntity) =>
      customerProposals.customerId,
  )
  customersProposals: CustomerProposalsEntity[];

  constructor(customer?: Partial<CustomersEntity>) {
    this.customerId = customer?.customerId;
    this.fullName = customer?.fullName;
    this.cpf = customer?.cpf;
    this.birthDate = customer?.birthDate;
    this.email = customer?.email;
    this.phoneNumber = customer?.phoneNumber;
    this.monthlyIncome = customer?.monthlyIncome;
    this.createdAt = customer?.createdAt;
    this.updatedAt = customer?.updatedAt;
    this.customersProposals = customer?.customersProposals;
  }
}
