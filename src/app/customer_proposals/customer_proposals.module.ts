import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersEntity } from '../customers/entity/customers.entity';
import { CustomerProposalsController } from './customer_proposals.controller';
import { CustomerProposalsService } from './customer_proposals.service';
import { CustomerProposalsEntity } from './entity/customerProposals.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerProposalsEntity, CustomersEntity]),
  ],
  controllers: [CustomerProposalsController],
  providers: [CustomerProposalsService],
  exports: [CustomerProposalsService],
})
export class CustomerProposalsModule {}
