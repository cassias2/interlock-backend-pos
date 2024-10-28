import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Details } from './entities/details.entity';
import { Reports } from './entities/reports.entity';
import { Results } from './entities/results.entity';
import { PassmarkService } from './passmark.service';

@Module({
  imports: [TypeOrmModule.forFeature([Details, Reports, Results], 'passmark')],
  controllers: [],
  providers: [PassmarkService],
  exports: [PassmarkService],
})
export class PassmarkModule {}
