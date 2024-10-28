import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EurekaService } from 'src/eureka/eureka.service';
import { PassmarkService } from 'src/passmark/passmark.service';
import { IsNull, Repository } from 'typeorm';
import { LoteClose } from './entities/close-lote.entity';
import { Interlock } from './entities/interlock.entity';
import { User } from './entities/user.entity';

type user = {
  name: 'string';
  matricula: 'string';
  password: 'string';
  role: 'string';
};

@Injectable()
export class InterlockService {
  private readonly logger = new Logger(InterlockService.name);

  constructor(
    @InjectRepository(Interlock, 'eureka')
    private readonly interlockRepository: Repository<Interlock>,
    @InjectRepository(LoteClose, 'eureka')
    private readonly loteCloseRepository: Repository<LoteClose>,
    @InjectRepository(User, 'eureka')
    private readonly userRepository: Repository<User>,
    private readonly eurekaService: EurekaService,
    private readonly passmarkService: PassmarkService,
  ) {}

  async insertInterlock(data: any) {
    try {
      if (data.length === 0) {
        return {
          status: 400,
          message: 'Informe os dados',
        };
      }
      const existsInterlock = await this.interlockRepository.find({
        where: { lote: data[0].lote },
      });

      if (existsInterlock.length > 0 && existsInterlock.length < data.length) {
        type InterlockType = { sn_he: string; lote: string; result: string };

        const newInterlock: InterlockType[] = data.filter(
          (element: InterlockType) =>
            !existsInterlock.some(
              (interlockItem: InterlockType) =>
                interlockItem.sn_he === element.sn_he &&
                interlockItem.lote === element.lote &&
                interlockItem.result === element.result,
            ),
        );

        // Prepare os dados para a operação de inserir em lote
        const interlockDataInsert = [];
        newInterlock.map((element) => interlockDataInsert.push(element));

        this.interlockRepository.create(interlockDataInsert);
        await this.interlockRepository.save(interlockDataInsert);

        const result = await this.interlockRepository.find({
          where: { lote: data[0].lote },
        });

        // Conte o número total de itens com status não nulo
        const countReady = result.filter((item) => item.status !== null).length;

        const countPassAndIgnore = result.filter(
          (item) =>
            (item.status !== '0' && item.status == '4') ||
            (item.result == 'PASS' && item.status != null),
        ).length;

        return {
          data: result,
          count: result.length,
          ready: countReady,
          passAndIgnore: countPassAndIgnore,
        };
      }

      if (existsInterlock.length > 0 && existsInterlock.length == data.length) {
        type InterlockType = {
          sn_he: string;
          lote: string;
          result: string;
        };

        const newInterlock: InterlockType[] = data.filter(
          (element: InterlockType) =>
            !existsInterlock.some(
              (interlockItem: InterlockType) =>
                interlockItem.sn_he === element.sn_he &&
                interlockItem.lote === element.lote &&
                interlockItem.result === element.result,
            ),
        );

        //Prepare os dados para a operação de atualização em lote
        const updatePromises = newInterlock.map((element) =>
          this.interlockRepository.update(
            { sn_he: element.sn_he, lote: element.lote },
            element,
          ),
        );

        await Promise.all(updatePromises);

        const result = await this.interlockRepository.find({
          where: { lote: data[0].lote },
        });

        // Conte o número total de itens com status não nulo
        const countReady = result.filter((item) => item.status !== null).length;

        const countPassAndIgnore = result.filter(
          (item) =>
            (item.status !== '0' && item.status == '4') ||
            (item.result == 'PASS' && item.status != null),
        ).length;

        return {
          data: result,
          count: result.length,
          ready: countReady,
          passAndIgnore: countPassAndIgnore,
        };
      }

      const interlock = this.interlockRepository.create(data);
      const result = await this.interlockRepository.save(interlock);

      const countReady = result.filter((item) => item.status !== null).length;

      const countPassAndIgnore = result.filter(
        (item) =>
          (item.status !== '0' && item.status == '4') ||
          (item.result == 'PASS' && item.status != null),
      ).length;

      return {
        data: result,
        count: result.length,
        ready: countReady,
        passAndIgnore: countPassAndIgnore,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: 'Error interno',
      };
    }
  }

  async createDashboardList(lot: string) {
    try {
      const eurekaLot = await this.eurekaService.getByLot(lot);

      const getLoteClose: any = await this.loteCloseRepository.find({
        where: { lote: lot },
      });
      const findLoteOnClose = getLoteClose.find((item) => item.lote === lot);

      if (findLoteOnClose?.lote === lot) {
        return {
          status: 400,
          message: 'Lote já finalizado',
        };
      }

      if (eurekaLot.length === 0) {
        return {
          status: 400,
          message: 'Lote não encontrado',
        };
      }

      const passmarkLot = await this.passmarkService.getAllByArrSerial(
        eurekaLot[0].sn as string[],
      );

      this.logger.debug('Passamark lot: ', passmarkLot);

      const result = (eurekaLot[0].sn as string[]).map((sn) => {
        const passmark = passmarkLot.find((passmark) => passmark.serial === sn);
        return {
          lote: lot,
          sn_he: sn,
          result: passmark?.result ?? null,
        };
      });

      const data = await this.insertInterlock(result);

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async createDashboardListBySerialNumber(lot: string, sn: string) {
    try {
      const eurekaLot = await this.eurekaService.getByLotAndSerialNumber(
        lot,
        sn,
      );

      const getLoteClose: any = await this.loteCloseRepository.find({
        where: { lote: lot },
      });

      const findLoteOnClose = getLoteClose.find(
        (item: any) => item.lote === lot,
      );

      if (findLoteOnClose?.lote === lot) {
        return {
          status: 400,
          message: 'Lote já finalizado',
        };
      }

      if (eurekaLot.length === 0) {
        return {
          status: 400,
          message: 'Lote não encontrado',
        };
      }

      const passmarkLot = await this.passmarkService.getAllByArrSerial(
        eurekaLot[0].sn as string[],
      );

      const result = (eurekaLot[0].sn as string[]).map((sn) => {
        const passmark = passmarkLot.find((passmark) => passmark.serial === sn);
        return {
          lote: lot,
          sn_he: sn,
          result: passmark?.result ?? null,
        };
      });

      const data = await this.updateOnlyInterlock(result);

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async dashboardList(lot: string) {
    try {
      const interlock = await this.createDashboardList(lot);

      return interlock;
    } catch (error) {
      console.log(error);
    }
  }

  async createUser(data: user) {
    try {
      const newUser: User = this.userRepository.create(data);
      await this.userRepository.save(newUser);

      return newUser;
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: 'Error interno',
      };
    }
  }

  async login(mat: string, pass: string) {
    try {
      if (!mat && !pass) {
        return {
          status: 400,
          message: 'Informe a matrícula e senha',
        };
      }

      const user = await this.userRepository.findOne({
        where: { matricula: mat, password: pass },
      });

      if (!user) {
        return {
          status: 400,
          message: 'Usuário não encontrado ou senha incorreta',
        };
      }

      const resultDistinct = await this.interlockRepository
        .createQueryBuilder('interlock')
        .select('interlock.lote')
        .distinctOn(['interlock.lote'])
        .getMany();

      const closeLote = await this.loteCloseRepository
        .createQueryBuilder('loteclose')
        .select()
        .getMany();

      const commonItems = resultDistinct.filter(
        (distinctItem) =>
          !closeLote.some((closeItem) => closeItem.lote === distinctItem.lote),
      );

      // Buscar todos os dados necessários em uma única consulta
      const allData = await this.interlockRepository.find({
        where: { lote: commonItems[0]?.lote },
      });

      let newUser;

      const getLoteClose: any = await this.loteCloseRepository.find({
        where: { lote: commonItems[0]?.lote },
      });
      const findLoteOnClose = getLoteClose.find(
        (item) => item.lote === commonItems[0]?.lote,
      );

      if (findLoteOnClose?.lote !== commonItems[0]?.lote) {
        const findAllLote = allData.filter(
          (item) =>
            item.lote === commonItems[0]?.lote && item.part_number !== null,
        );

        const findLoteIsNull = allData.filter(
          (item) => item.lote === commonItems[0]?.lote && item.status === null,
        );

        if (
          findAllLote.length !== findLoteIsNull.length &&
          findAllLote.length !== 0
        ) {
          newUser = {
            partnumber: findAllLote[findAllLote.length - 1]['part_number'],
            lote: commonItems[0]?.lote,
            serial: findAllLote[findAllLote.length - 1]['sn_he'],
          };
        }
      }

      const countReady = allData.filter(
        (item) => item.status !== null && item.lote == newUser?.lote,
      ).length;

      const countPassAndIgnore = allData.filter(
        (item) =>
          (item?.lote == newUser?.lote &&
            item.status !== '0' &&
            item.status == '4') ||
          (item.result == 'PASS' && item.status != null),
      ).length;

      const tot =
        allData.filter((item) => item.lote == newUser?.lote).length || 0;

      return {
        count: tot || 0,
        ready: countReady || 0,
        passAndIgnore: countPassAndIgnore || 0,
        lote: newUser?.lote || null,
        partnumber: newUser?.partnumber || null,
        serial: newUser?.serial || null,
        user,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: 'Error interno',
      };
    }
  }

  async loginAndCloseLot(mat: string, pass: string, lot: string) {
    try {
      if (!mat && !pass) {
        return {
          status: 400,
          message: 'Informe a matrícula e senha',
        };
      }

      const user = await this.userRepository.findOne({
        where: { matricula: mat, password: pass },
      });

      if (!user) {
        return {
          message: 'Usuário não encontrado ou senha incorreta ',
          status: 401,
        };
      }

      if (user.role != '1') {
        return {
          status: 403,
          message: 'Usuário não tem permissão',
        };
      }

      if (lot === null) {
        return {
          message: 'Informe o lote',
          status: 400,
        };
      }

      let getLoteClose = await this.loteCloseRepository.find({
        where: { lote: lot },
      });

      if (!getLoteClose || getLoteClose?.length === 0) {
        const closeLote: LoteClose = this.loteCloseRepository.create({
          lote: lot,
          admUser: user,
        });
        await this.loteCloseRepository.save(closeLote);
      }

      const resultDistinct = await this.interlockRepository
        .createQueryBuilder('interlock')
        .select('interlock.lote')
        .distinctOn(['interlock.lote'])
        .getOne();

      const allData = await this.interlockRepository.find({
        where: { lote: resultDistinct?.lote },
      });

      let newUser;

      getLoteClose = await this.loteCloseRepository.find({
        where: { lote: resultDistinct?.lote },
      });

      const findLoteOnClose = getLoteClose.find(
        (item) => item.lote === resultDistinct.lote,
      );

      if (findLoteOnClose?.lote !== resultDistinct?.lote) {
        const findAllLote = allData.filter(
          (item) =>
            item.lote === resultDistinct.lote && item.part_number !== null,
        );

        const findLoteIsNull = allData.filter(
          (item) => item.lote === resultDistinct.lote && item.status === null,
        );

        if (
          findAllLote.length !== findLoteIsNull.length &&
          findAllLote.length !== 0
        ) {
          newUser = {
            partnumber: findAllLote[findAllLote.length - 1]['part_number'],
            lote: resultDistinct.lote,
            serial: findAllLote[findAllLote.length - 1]['sn_he'],
          };
        }
      }

      const countReady = allData.filter(
        (item) => item.status !== null && item.lote == newUser?.lote,
      ).length;

      const countPassAndIgnore = allData.filter(
        (item) =>
          (item.status !== '0' && item.status == '4') ||
          (item.result == 'PASS' && item.status != null),
      ).length;

      const tot =
        allData.filter((item) => item.lote == newUser?.lote).length || 0;

      return {
        count: tot || 0,
        ready: countReady || 0,
        passAndIgnore: countPassAndIgnore || 0,
        lote: newUser?.lote || null,
        partnumber: newUser?.partnumber || null,
        serial: newUser?.serial || null,
        user,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: 'Error interno',
      };
    }
  }

  async updateInterlock(data: any) {
    try {
      if (!data.user) {
        return {
          status: 400,
          message: 'Informe o usuário',
        };
      }
      const findUser = await this.userRepository.findOne({
        where: { matricula: data.user },
      });

      if (!findUser) {
        return {
          status: 400,
          message: 'Usuário não encontrado',
        };
      }

      const existInterlock = await this.interlockRepository.find({
        where: { sn_he: data.sn_he, lote: data.lote, status: IsNull() },
      });

      if (existInterlock.length === 0) {
        await this.interlockRepository
          .createQueryBuilder()
          .update(Interlock)
          .set({
            sn_he: data.sn_he,
            part_number: data.part_number,
            lote: data.lote,
            user: findUser,
            admUser: null,
            status: data.status,
          })
          .where({ sn_he: data.sn_he })
          .andWhere({ lote: data.lote })
          .execute();
      }

      if (existInterlock) {
        await this.interlockRepository
          .createQueryBuilder()
          .update(Interlock)
          .set({
            sn_he: data.sn_he,
            part_number: data.part_number,
            lote: data.lote,
            user: findUser,
            admUser: null,
            status: '0',
          })
          .where({ sn_he: data.sn_he })
          .andWhere({ lote: data.lote })
          .execute();
      }
      const result = await this.interlockRepository.find({
        where: { lote: data.lote },
      });

      const countReady = result.filter((item) => item.status !== null).length;

      const countPassAndIgnore = result.filter(
        (item) =>
          (item.status !== '0' && item.status == '4') ||
          (item.result == 'PASS' && item.status != null),
      ).length;

      return {
        data: result,
        count: result.length,
        ready: countReady,
        passAndIgnore: countPassAndIgnore,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: 'Error interno',
      };
    }
  }

  async updateOnlyInterlock(data: any) {
    try {
      const existInterlock = await this.interlockRepository.find({
        where: { sn_he: data[0].sn_he, lote: data[0].lote, status: IsNull() },
      });

      if (existInterlock.length === 0) {
        await this.interlockRepository
          .createQueryBuilder()
          .update(Interlock)
          .set({
            sn_he: data.sn_he,
            part_number: data.part_number,
            lote: data.lote,
            user: null,
            admUser: null,
            status: data.status,
          })
          .where({ sn_he: data.sn_he })
          .andWhere({ lote: data.lote })
          .execute();
      }

      if (existInterlock) {
        await this.interlockRepository
          .createQueryBuilder()
          .update(Interlock)
          .set({
            sn_he: data.sn_he,
            part_number: data.part_number,
            lote: data.lote,
            user: null,
            admUser: null,
            status: '0',
          })
          .where({ sn_he: data.sn_he })
          .andWhere({ lote: data.lote })
          .execute();
      }
      const result = await this.interlockRepository.find({
        where: { lote: data[0].lote, sn_he: data[0].sn_he },
      });

      return {
        data: result,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: 'Error interno',
      };
    }
  }

  async validateInterlock(data: any) {
    try {
      if (!data.matricula && !data.password) {
        return {
          status: 400,
          message: 'Informe o usuário ADM',
        };
      }
      let findUser: any;
      if (data.status === '4') {
        findUser = await this.userRepository.findOne({
          where: {
            matricula: data.matricula,
            password: data.password,
            role: '1',
          },
        });

        if (!findUser) {
          return {
            status: 400,
            message: 'Usuário ou senha não encontrado ou usuário não é ADM',
          };
        }
      } else {
        findUser = await this.userRepository.findOne({
          where: {
            matricula: data.matricula,
            password: data.password,
          },
        });

        if (!findUser) {
          return {
            status: 400,
            message: 'Usuário ou senha não encontrado',
          };
        }
      }

      const interlock = await this.interlockRepository.findOne({
        where: { sn_he: data.sn_he, lote: data.lote },
      });

      if (!interlock) {
        return {
          status: 400,
          message: 'Serial Number não encontrado no lote informado',
        };
      }

      if (data.status == '4') {
        interlock.status = '4';
      }

      await this.interlockRepository
        .createQueryBuilder()
        .update(Interlock)
        .set({
          sn_he: interlock.sn_he,
          part_number: data.part_number,
          lote: interlock.lote,
          admUser: findUser,
          status:
            Number(interlock.status) != 4
              ? (Number(interlock.status) + 1).toString()
              : '4',
        })
        .where({ sn_he: data.sn_he })
        .andWhere({ lote: data.lote })
        .execute();

      const result = await this.interlockRepository.find({
        where: { lote: data.lote },
      });

      //const count = result.filter((item) => item.status !== null).length;

      const countReady = result.filter((item) => item.status !== null).length;

      const countPassAndIgnore = result.filter(
        (item) =>
          (item.status !== '0' && item.status == '4') ||
          (item.result == 'PASS' && item.status != null),
      ).length;

      return {
        data: result,
        count: result.length,
        ready: countReady,
        passAndIgnore: countPassAndIgnore,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: 'Error interno',
      };
    }
  }
}
