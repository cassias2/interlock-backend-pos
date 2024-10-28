// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const serialNumberMap = [
  ['92D684EE', 'PASS'],
  ['B5C53B83', 'PASS'],
  ['28BBEC1F', 'PASS'],
  ['8026963A', 'PASS'],
  ['63A76196', 'PASS'],
  ['3A21B7B3', 'PASS'],
  ['43BCC834', 'FAIL'],
  ['F4B98F1A', 'PASS'],
  ['7216F78A', 'PASS'],
  ['D13134AF', 'PASS'],
  ['CCBBB0DF', 'PASS'],
  ['0A46302F', 'PASS'],
  ['E0639E4D', 'PASS'],
  ['14C27DFD', 'PASS'],
  ['C230F46D', 'PASS'],
  ['4069012D', 'PASS'],
  ['0A490510', 'FAIL'],
  ['320FD8F0', 'PASS'],
  ['FAA20185', 'PASS'],
  ['28C143C0', 'PASS'],
  ['CC30E23C', 'PASS'],
  ['20121589', 'FAIL'],
  ['58026768', 'PASS'],
  ['F86C9D00', 'PASS'],
  ['E3CB5487', 'FAIL'],
  ['7D27D8CD', 'PASS'],
  ['CC76D2A5', 'PASS'],
  ['01223960', 'FAIL'],
  ['1DB5EBA1', 'PASS'],
  ['FA008FCD', 'FAIL'],
  ['04AE51C6', 'PASS'],
  ['67322933', 'FAIL'],
  ['2D694A9D', 'PASS'],
  ['4A7B0600', 'PASS'],
  ['DED89D73', 'PASS'],
  ['06D82524', 'FAIL'],
  ['54A05319', 'PASS'],
  ['C0DA6325', 'PASS'],
  ['20728168', 'PASS'],
  ['6AD84114', 'PASS'],
  ['8A9AC980', 'PASS'],
  ['03D33BC7', 'PASS'],
  ['D89786A3', 'PASS'],
  ['5B0DAF00', 'PASS'],
  ['8C8ECC1E', 'PASS'],
  ['20B8F5EE', 'PASS'],
  ['D1D0D0FB', 'PASS'],
  ['8D5B20F8', 'PASS'],
  ['F94D214B', 'PASS'],
  ['9257B0C8', 'PASS'],
];

async function main() {
  const manufacturers = ['SK Hynix', 'ADATA', 'Intelbras'];
  const names = ['SPD #0', 'SPD #1', 'SPD #2', 'SPD #3'];
  const sizes = ['8192', '4096', '2048'];
  const profiles = 'JEDEC Profile: 5600MT/s 46-45-45-90 1.1V';

  const memoryRanges = ['0x0 - 28F800000', '0x0 - 12F800000'];
  const cpuTemps = ['38C', '47C', '42C', '109C'];
  const ramTemps = ['27500C', '32500C', '30000C'];
  const testsPassedOptions = ['5/5 (100%)', '6/6 (100%)'];
  const testsFailedOptions = ['3/5 (60%)', '1/6 (16%)'];

  for (let session_id = 1; session_id <= 50; session_id++) {
    // Create ram_details
    const ramDetail = {
      session_id,
      name: names[Math.floor(Math.random() * names.length)],
      manufacturer:
        manufacturers[Math.floor(Math.random() * manufacturers.length)],
      model: Math.random().toString(36).substring(2, 17).toUpperCase(), // Random alphanumeric model
      serial: serialNumberMap[session_id - 1][0],
      size: sizes[Math.floor(Math.random() * sizes.length)],
      date: `Week ${Math.floor(Math.random() * 52) + 1} of Year ${
        Math.floor(Math.random() * 2) + 2022
      }`,
      manufacturer_specific: '0'.repeat(64),
      profiles,
    };

    await prisma.ram_details.create({ data: ramDetail });

    // Create memtest_reports
    const memtestReport = {
      session_id,
      memory_range:
        memoryRanges[Math.floor(Math.random() * memoryRanges.length)],
      cpu_selection: 'Parallel (All CPUs)',
      cpu_temp: cpuTemps[Math.floor(Math.random() * cpuTemps.length)],
      ram_temp: ramTemps[Math.floor(Math.random() * ramTemps.length)],
      tests_passed:
        serialNumberMap[session_id - 1][1] === 'PASS'
          ? testsPassedOptions[
              Math.floor(Math.random() * testsPassedOptions.length)
            ]
          : testsFailedOptions[
              Math.floor(Math.random() * testsPassedOptions.length)
            ],
      ...(serialNumberMap[session_id - 1][1] === 'FAIL' && {
        erroraddr_low: `0x${Math.floor(Math.random() * 0xffffffff)
          .toString(16)
          .toUpperCase()}`,
        erroraddr_high: `0x${Math.floor(Math.random() * 0xffffffff)
          .toString(16)
          .toUpperCase()}`,
        error_bitmask: `0x${Math.floor(Math.random() * 0xffffffff)
          .toString(16)
          .toUpperCase()}`,
        error_numbits: `0x${Math.floor(Math.random() * 0xffffffff)
          .toString(16)
          .toUpperCase()}`,
        errors_maxcont: `0x${Math.floor(Math.random() * 0xffffffff)
          .toString(16)
          .toUpperCase()}`,
        err_cpus: `${Math.floor(Math.random() * 8) + 1}`,
      }),
    };

    await prisma.memtest_reports.create({ data: memtestReport });

    // Create memtest_results
    const timestart =
      Math.floor(new Date().getTime()) - Math.floor(Math.random() * 3600000000);
    const timeupdate = timestart + Math.floor(Math.random() * 180000);
    const timestop = timeupdate;

    const memtestResult = {
      session_id,
      timestart: new Date(timestart),
      timeupdate: new Date(timestop),
      timestop: new Date(timestop),
      duration: Math.ceil(
        (new Date(timestop).getTime() - new Date(timestart).getTime()) / 1000,
      ),
      result: serialNumberMap[session_id - 1][1],
    };

    await prisma.memtest_results.create({ data: memtestResult });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
