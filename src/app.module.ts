import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './app/customers/customers.module';
import { CustomerProposalsModule } from './app/customer_proposals/customer_proposals.module';
import { ResultSimulationsModule } from './app/result_simulations/result_simulations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.example'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      database: process.env.POSTGRES_DB,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      synchronize: true,
    }),
    CustomersModule,
    CustomerProposalsModule,
    ResultSimulationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
