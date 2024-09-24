-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ads" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "image" TEXT NOT NULL,
    "priceNegotiable" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Ads" ("description", "id", "image", "price", "title") SELECT "description", "id", "image", "price", "title" FROM "Ads";
DROP TABLE "Ads";
ALTER TABLE "new_Ads" RENAME TO "Ads";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
