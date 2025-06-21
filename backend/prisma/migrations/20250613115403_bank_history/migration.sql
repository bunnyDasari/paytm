-- CreateTable
CREATE TABLE "history" (
    "userId" INTEGER NOT NULL,
    "moneysent" INTEGER NOT NULL,
    "reciver" INTEGER NOT NULL,

    CONSTRAINT "history_pkey" PRIMARY KEY ("userId")
);
