-- CreateTable
CREATE TABLE "Results" (
    "result_id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "timestart" TIMESTAMP(3) NOT NULL,
    "timeupdate" TIMESTAMP(3) NOT NULL,
    "timestop" TIMESTAMP(3) NOT NULL,
    "duration" VARCHAR(50) NOT NULL,
    "result" VARCHAR(50) NOT NULL,

    CONSTRAINT "Results_pkey" PRIMARY KEY ("result_id")
);

-- CreateTable
CREATE TABLE "Details" (
    "name" TEXT NOT NULL,
    "serial" TEXT NOT NULL,
    "session_id" INTEGER NOT NULL,
    "model" TEXT,
    "size" TEXT,
    "date" TIMESTAMP(3),
    "manufacturer_specific" TEXT,

    CONSTRAINT "Details_pkey" PRIMARY KEY ("name","serial")
);

-- CreateTable
CREATE TABLE "Reports" (
    "result_id" SERIAL NOT NULL,
    "session_id" INTEGER,
    "memory_range" TEXT,
    "cpu_selection" TEXT,
    "cpu_temp" TEXT,
    "ram_temp" TEXT,
    "tests_passed" TEXT NOT NULL,
    "erroraddr_low" TEXT,
    "erroraddr_high" TEXT,
    "error_bitmask" TEXT,
    "error_numbits" TEXT,
    "errors_maxcont" TEXT,
    "err_cpus" TEXT,

    CONSTRAINT "Reports_pkey" PRIMARY KEY ("result_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Results_session_id_key" ON "Results"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "Reports_session_id_key" ON "Reports"("session_id");

-- AddForeignKey
ALTER TABLE "Details" ADD CONSTRAINT "Details_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Results"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Results"("session_id") ON DELETE SET NULL ON UPDATE CASCADE;
