-- CreateTable
CREATE TABLE "close_lote" (
    "id" SERIAL NOT NULL,
    "lote" VARCHAR,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    "admUserId" INTEGER,

    CONSTRAINT "close_lote_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eureka" (
    "id" SERIAL NOT NULL,
    "lote" VARCHAR(25) NOT NULL,
    "sn_he" VARCHAR(25) NOT NULL,
    "sn_cust" VARCHAR(1000),
    "sn_rdimm" VARCHAR(25),
    "ppid" VARCHAR(25),
    "date_spd_write" TIMESTAMP(6),
    "date_et" TIMESTAMP(6),
    "status" VARCHAR(10),
    "spd_retest" VARCHAR(10),
    "et_retest" VARCHAR(10),
    "operator" VARCHAR(35),

    CONSTRAINT "eureka_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interlock" (
    "id" SERIAL NOT NULL,
    "lote" VARCHAR NOT NULL,
    "part_number" VARCHAR,
    "sn_he" VARCHAR NOT NULL,
    "result" VARCHAR,
    "status" VARCHAR,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    "admUserId" INTEGER,

    CONSTRAINT "PK_53ef6c63a735bbb3a1c757722dd" PRIMARY KEY ("id","lote","sn_he")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "password" VARCHAR,
    "role" VARCHAR,
    "matricula" VARCHAR NOT NULL,

    CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "eureka_sn_he_key" ON "eureka"("sn_he");

-- CreateIndex
CREATE UNIQUE INDEX "eureka_sn_cust_key" ON "eureka"("sn_cust");

-- CreateIndex
CREATE UNIQUE INDEX "eureka_sn_rdimm_key" ON "eureka"("sn_rdimm");

-- CreateIndex
CREATE UNIQUE INDEX "eureka_ppid_key" ON "eureka"("ppid");

-- CreateIndex
CREATE UNIQUE INDEX "interlock_unique" ON "interlock"("sn_he");

-- AddForeignKey
ALTER TABLE "close_lote" ADD CONSTRAINT "close_lote_user_fk" FOREIGN KEY ("admUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "interlock" ADD CONSTRAINT "FK_0147784aef401974bbbe896e41c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "interlock" ADD CONSTRAINT "interlock_user_fk" FOREIGN KEY ("admUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
