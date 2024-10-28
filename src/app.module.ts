import { Module } from '@nestjs/common';
import { EurekaModule } from './eureka/eureka.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PassmarkModule } from './passmark/passmark.module';
import { InterlockModule } from './interlock/interlock.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EurekaModule,
    PassmarkModule,
    InterlockModule,
    TypeOrmModule.forRoot({
      name: 'eureka',
      type: process.env.DATABASE_TYPE as 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
      entities: ['dist/**/*.entity{.ts,.js}'],
      logging: ['migration', 'warn', 'error'],
    }),
    TypeOrmModule.forRoot({
      name: 'passmark',
      type: process.env.DATABASE_PASSMARK_TYPE as 'postgres',
      host: process.env.DATABASE_PASSMARK_HOST,
      port: Number(process.env.DATABASE_PASSMARK_PORT),
      username: process.env.DATABASE_PASSMARK_USER,
      password: process.env.DATABASE_PASSMARK_PASSWORD,
      database: process.env.DATABASE_PASSMARK,
      entities: ['dist/**/*.entity{.ts,.js}'],
      logging: ['migration', 'warn', 'error'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
