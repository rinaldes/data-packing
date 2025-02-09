-- CreateTable
CREATE TABLE "PackingData" (
    "id" TEXT NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "pic" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "qtyA" INTEGER NOT NULL,
    "qtyB" INTEGER NOT NULL,
    "qtyC" INTEGER NOT NULL,
    "reject" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PackingData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PIC" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PIC_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PIC_name_key" ON "PIC"("name");
