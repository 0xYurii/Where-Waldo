-- CreateTable
CREATE TABLE "Photo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "URL" TEXT NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "x_percent" DOUBLE PRECISION NOT NULL,
    "y_percent" DOUBLE PRECISION NOT NULL,
    "photoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "photoId" INTEGER NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Photo_name_key" ON "Photo"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Photo_URL_key" ON "Photo"("URL");

-- CreateIndex
CREATE UNIQUE INDEX "Character_name_key" ON "Character"("name");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
