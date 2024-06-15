import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerProposalsEntity } from '../customer_proposals/entity/customerProposals.entity';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CustomersEntity } from './entity/customers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomersEntity, CustomerProposalsEntity]),
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
