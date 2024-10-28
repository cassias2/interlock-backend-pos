import { Module } from '@nestjs/common';
import { EurekaService } from './eureka.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Eureka } from './entities/eureka.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Eureka], 'eureka')],
  controllers: [],
  providers: [EurekaService],
  exports: [EurekaService],
})
export class EurekaModule {}
