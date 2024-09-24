/*
  Warnings:

  - Added the required column `stateName` to the `Ads` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ads" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "priceNegotiable" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    "categoryId" INTEGER,
    "stateName" TEXT NOT NULL,
    CONSTRAINT "Ads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ads_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Ads" ("categoryId", "createdAt", "description", "id", "price", "priceNegotiable", "title", "updatedAt", "userId", "views") SELECT "categoryId", "createdAt", "description", "id", "price", "priceNegotiable", "title", "updatedAt", "userId", "views" FROM "Ads";
DROP TABLE "Ads";
ALTER TABLE "new_Ads" RENAME TO "Ads";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
