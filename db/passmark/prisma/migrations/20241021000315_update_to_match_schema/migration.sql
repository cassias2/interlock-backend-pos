/*
  Warnings:

  - You are about to drop the `Details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Results` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Details" DROP CONSTRAINT "Details_session_id_fkey";

-- DropForeignKey
ALTER TABLE "Reports" DROP CONSTRAINT "Reports_session_id_fkey";

-- DropTable
DROP TABLE "Details";

-- DropTable
DROP TABLE "Reports";

-- DropTable
DROP TABLE "Results";

-- CreateTable
CREATE TABLE "ram_details" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "name" VARCHAR(32),
    "manufacturer" VARCHAR(64),
    "model" VARCHAR(64),
    "serial" VARCHAR(64),
    "size" VARCHAR(16),
    "date" TIMESTAMP,
    "manufacturer_specific" VARCHAR(64),
    "profiles" VARCHAR(255),

    CONSTRAINT "ram_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memtest_reports" (
    "result_id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "memory_range" VARCHAR(45),
    "cpu_selection" VARCHAR(40),
    "cpu_temp" VARCHAR(20),
    "ram_temp" VARCHAR(20),
    "tests_passed" VARCHAR(20),
    "erroraddr_low" VARCHAR(45),
    "erroraddr_high" VARCHAR(45),
    "error_bitmask" VARCHAR(20),
    "error_numbits" VARCHAR(20),
    "errors_maxcont" VARCHAR(20),
    "err_cpus" VARCHAR(100),

    CONSTRAINT "memtest_reports_pkey" PRIMARY KEY ("result_id")
);

-- CreateTable
CREATE TABLE "memtest_results" (
    "result_id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "timestart" TIMESTAMP NOT NULL,
    "timeupdate" TIMESTAMP,
    "timestop" TIMESTAMP,
    "duration" INTEGER,
    "result" VARCHAR(16),

    CONSTRAINT "memtest_results_pkey" PRIMARY KEY ("result_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ram_details_session_id_key" ON "ram_details"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "memtest_reports_session_id_key" ON "memtest_reports"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "memtest_results_session_id_key" ON "memtest_results"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "memtest_results_timestart_key" ON "memtest_results"("timestart");
