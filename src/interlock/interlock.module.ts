import { Module } from '@nestjs/common';
import { InterlockService } from './interlock.service';
import { InterlockController } from './interlock.controller';
import { EurekaModule } from 'src/eureka/eureka.module';
import { PassmarkModule } from 'src/passmark/passmark.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interlock } from './entities/interlock.entity';
import { User } from './entities/user.entity';
import { LoteClose } from './entities/close-lote.entity';

@Module({
  controllers: [InterlockController],
  providers: [InterlockService],
  imports: [
    EurekaModule,
    PassmarkModule,
    TypeOrmModule.forFeature([Interlock, User, LoteClose], 'eureka'),
  ],
})
export class InterlockModule {}
