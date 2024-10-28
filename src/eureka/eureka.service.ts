import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Eureka } from './entities/eureka.entity';

@Injectable()
export class EurekaService {
  constructor(
    @InjectRepository(Eureka, 'eureka')
    private readonly repository: Repository<Eureka>,
  ) {}

  async getAll() {
    try {
      const eureka = await this.repository
        .createQueryBuilder()
        .select()
        .getMany();

      const groupBy = (key, array) =>
        array.reduce((objectsByKeyValue, obj) => {
          const value = obj[key];
          objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(
            obj.sn_he,
          );
          return objectsByKeyValue;
        }, {});

      const grouped = groupBy('lote', eureka);

      return grouped;
    } catch (error) {
      console.log(error);
    }
  }

  async getByLot(lot: string) {
    try {
      const eureka = await this.repository
        .createQueryBuilder()
        .select()
        .where('lote = :lot', { lot })
        .andWhere('status = :status', { status: 'GOOD' })
        .getMany();

      const groupBy = (key, array) =>
        array.reduce((objectsByKeyValue, obj) => {
          const value = obj[key];
          objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(
            obj.sn_he,
          );
          return objectsByKeyValue;
        }, {});

      const grouped = groupBy('lote', eureka);

      const reformatted = Object.entries(grouped).map(([lote, sn]) => ({
        lote,
        sn,
      }));

      return reformatted;
    } catch (error) {
      console.log(error);
    }
  }

  async getByLotAndSerialNumber(lot: string, sn: string) {
    try {
      const eureka = await this.repository
        .createQueryBuilder()
        .select()
        .where('lote = :lot', { lot })
        .andWhere('status = :status', { status: 'GOOD' })
        .andWhere('sn_he = :sn', { sn })
        .getMany();

      const groupBy = (key, array) =>
        array.reduce((objectsByKeyValue, obj) => {
          const value = obj[key];
          objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(
            obj.sn_he,
          );
          return objectsByKeyValue;
        }, {});

      const grouped = groupBy('lote', eureka);

      const reformatted = Object.entries(grouped).map(([lote, sn]) => ({
        lote,
        sn,
      }));

      return reformatted;
    } catch (error) {
      console.log(error);
    }
  }
}
