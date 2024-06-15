import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerProposalsEntity } from '../customer_proposals/entity/customerProposals.entity';
import { ResultSimulationsEntity } from './entity/resultSimulations.entity';
import { ResultSimulationsController } from './result_simulations.controller';
import { ResultSimulationsService } from './result_simulations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResultSimulationsEntity,
      CustomerProposalsEntity,
    ]),
  ],
  controllers: [ResultSimulationsController],
  providers: [ResultSimulationsService],
  exports: [ResultSimulationsService],
})
export class ResultSimulationsModule {}
