import { PrismaClient, eureka, interlock } from '@prisma/client';

const prisma = new PrismaClient();

const now = new Date();

/**
 * [serial number, passmark result, lot, eureka result]
 */
const serialNumberMap = [
  ['92D684EE', 'PASS', 'OP001-01', 'GOOD'],
  ['B5C53B83', 'PASS', 'OP001-01', 'GOOD'],
  ['28BBEC1F', 'PASS', 'OP001-01', 'GOOD'],
  ['8026963A', 'PASS', 'OP001-01', 'GOOD'],
  ['63A76196', 'PASS', 'OP001-01', 'GOOD'],
  ['3A21B7B3', 'PASS', 'OP001-01', 'GOOD'],
  ['43BCC834', 'FAIL', 'OP001-01', 'GOOD'],
  ['F4B98F1A', 'PASS', 'OP001-01', 'GOOD'],
  ['7216F78A', 'PASS', 'OP001-01', 'GOOD'],
  ['D13134AF', 'PASS', 'OP001-01', 'GOOD'],
  ['CCBBB0DF', 'PASS', 'OP001-02', 'GOOD'],
  ['0A46302F', 'PASS', 'OP001-02', 'GOOD'],
  ['E0639E4D', 'PASS', 'OP001-02', 'GOOD'],
  ['14C27DFD', 'PASS', 'OP001-02', 'GOOD'],
  ['C230F46D', 'PASS', 'OP001-02', 'GOOD'],
  ['4069012D', 'PASS', 'OP001-02', 'GOOD'],
  ['0A490510', 'FAIL', 'OP001-02', 'GOOD'],
  ['320FD8F0', 'PASS', 'OP001-02', 'GOOD'],
  ['FAA20185', 'PASS', 'OP001-02', 'GOOD'],
  ['28C143C0', 'PASS', 'OP001-02', 'GOOD'],
  ['CC30E23C', 'PASS', 'OP001-03', 'GOOD'],
  ['20121589', 'FAIL', 'OP001-03', 'GOOD'],
  ['58026768', 'PASS', 'OP001-03', 'GOOD'],
  ['F86C9D00', 'PASS', 'OP001-03', 'GOOD'],
  ['E3CB5487', 'FAIL', 'OP001-03', 'GOOD'],
  ['7D27D8CD', 'PASS', 'OP001-03', 'GOOD'],
  ['CC76D2A5', 'PASS', 'OP001-03', 'GOOD'],
  ['01223960', 'FAIL', 'OP001-03', 'GOOD'],
  ['1DB5EBA1', 'PASS', 'OP001-03', 'GOOD'],
  ['FA008FCD', 'FAIL', 'OP001-03', 'GOOD'],
  ['04AE51C6', 'PASS', 'OP001-04', 'GOOD'],
  ['67322933', 'FAIL', 'OP001-04', 'GOOD'],
  ['2D694A9D', 'PASS', 'OP001-04', 'GOOD'],
  ['4A7B0600', 'PASS', 'OP001-04', 'GOOD'],
  ['DED89D73', 'PASS', 'OP001-04', 'GOOD'],
  ['06D82524', 'FAIL', 'OP001-04', 'GOOD'],
  ['54A05319', 'PASS', 'OP001-04', 'GOOD'],
  ['C0DA6325', 'PASS', 'OP001-04', 'GOOD'],
  ['20728168', 'PASS', 'OP001-04', 'GOOD'],
  ['6AD84114', 'PASS', 'OP001-04', 'GOOD'],
  ['8A9AC980', 'PASS', 'OP001-05', 'BAD'],
  ['03D33BC7', 'PASS', 'OP001-05', 'FAIL'],
  ['D89786A3', 'PASS', 'OP001-05', 'SN FAIL'],
  ['5B0DAF00', 'PASS', 'OP001-05', 'SN WRITTEN'],
  ['8C8ECC1E', 'PASS', 'OP001-05', 'PASS'],
  ['20B8F5EE', 'PASS', '', ''], // Fora do Eureka
  ['D1D0D0FB', 'PASS', '', ''], // Fora do Eureka
  ['8D5B20F8', 'PASS', '', ''], // Fora do Eureka
  ['F94D214B', 'PASS', '', ''], // Fora do Eureka
  ['9257B0C8', 'PASS', '', ''], // Fora do Eureka
];

enum interlockStatusCodesEnum {
  PASS = '0',
  RETEST_1 = '1',
  RETEST_2 = '2',
  RETEST_3 = '3',
  IGNORED = '4',
}

const preInterlockData: interlock[] = serialNumberMap
  .filter((sn: string[]) => {
    return sn[2] === 'OP001-04';
  })
  .map((sn: string[], index) => {
    return {
      id: ++index,
      lote: 'OP001-04',
      sn_he: sn[0],
      part_number: 'PNMOCK-000000001',
      result: sn[1],
      status:
        sn[1] === 'PASS'
          ? interlockStatusCodesEnum.PASS
          : interlockStatusCodesEnum.IGNORED,
      userId: sn[1] === 'PASS' ? 2 : null,
      admUserId: sn[1] === 'PASS' ? null : 1,
      createdAt: new Date(now.getTime() - 8000),
      updatedAt: new Date(now.getTime() - 8000),
    };
  });

enum Roles {
  OPERADOR = '0',
  ADMIN = '1',
}

const eurekaData: eureka[] = serialNumberMap
  .filter((sn: string[]) => {
    return Boolean(sn[2]);
  })
  .map((sn: string[], index) => {
    const spd_write =
      Math.floor(new Date().getTime()) - Math.floor(Math.random() * 3600000000);
    const et = spd_write + Math.floor(Math.random() * 180000);
    return {
      id: ++index,
      lote: sn[2],
      sn_he: sn[0],
      sn_cust: null,
      sn_rdimm: null,
      ppid: null,
      date_spd_write: new Date(spd_write),
      date_et: new Date(et),
      et_retest: '',
      spd_retest: '',
      status: sn[3],
      operator: 'eureka operator',
    } as eureka;
  });

async function seed() {
  await prisma.user.createMany({
    data: [
      {
        id: 1,
        name: 'admin',
        password: '000',
        matricula: '123',
        role: Roles.ADMIN,
      },
      {
        id: 2,
        name: 'operador',
        password: '000',
        matricula: '124',
        role: Roles.OPERADOR,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.eureka.createMany({
    data: [...eurekaData],
    skipDuplicates: true,
  });

  await prisma.interlock.createMany({
    data: [...preInterlockData],
    skipDuplicates: true,
  });

  await prisma.close_lote.createMany({
    data: [
      {
        lote: 'OP001-04',
        createdAt: now,
        updatedAt: now,
        userId: null,
        admUserId: 2,
      },
    ],
    skipDuplicates: true,
  });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
