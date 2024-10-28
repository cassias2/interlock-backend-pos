import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Results } from './entities/results.entity';

@Injectable()
export class PassmarkService {
  private readonly logger = new Logger(PassmarkService.name);

  constructor(
    @InjectRepository(Results, 'passmark')
    private readonly repositoryResults: Repository<Results>,
  ) {}

  async getAllByArrSerial(arrSerial: Array<string>) {
    try {
      const passmark = await this.repositoryResults
        .createQueryBuilder('results')
        .select('results.result_id')
        .addSelect('results.session_id')
        .addSelect('results.result')
        .addSelect('details.serial')
        .addSelect('details.model')
        .addSelect('details.name')
        .leftJoin('results.details', 'details')
        .where('details.serial IN (:...id)', { id: arrSerial })
        .andWhere('details.name like :name', { name: '%SPD%' })
        .orderBy('results.session_id', 'DESC')
        //.orWhere('details.name like :name', { name: '%SPD #1%' })
        .getMany();

      this.logger.debug('Passmark data: ', passmark);

      const arr = [];
      passmark.map((obj) => {
        if (obj.details.length) {
          obj.details.map((item) => {
            arr.push({
              result_id: obj.result_id,
              arr_id: obj.session_id,
              result: obj.result,
              name: item.name,
              serial: item.serial,
              model: item.model,
            });
          });
        }
      });

      return arr;
    } catch (error) {
      console.log(error);
    }
  }
}
