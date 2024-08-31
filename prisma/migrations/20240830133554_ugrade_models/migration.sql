/*
  Warnings:

  - You are about to drop the column `inspectionType` on the `InspectionType` table. All the data in the column will be lost.
  - You are about to drop the column `utilityType` on the `UtilityType` table. All the data in the column will be lost.
  - Added the required column `numberOfPalours` to the `Apartment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfRooms` to the `Apartment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `InspectionType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comment` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `UtilityType` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Apartment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "cost" REAL NOT NULL,
    "costBy" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "numberOfRooms" INTEGER NOT NULL,
    "numberOfPalours" INTEGER NOT NULL,
    "buildingId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Apartment_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Apartment" ("address", "buildingId", "cost", "costBy", "createdAt", "id", "name", "updatedAt") SELECT "address", "buildingId", "cost", "costBy", "createdAt", "id", "name", "updatedAt" FROM "Apartment";
DROP TABLE "Apartment";
ALTER TABLE "new_Apartment" RENAME TO "Apartment";
CREATE TABLE "new_BookingStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_BookingStatus" ("createdAt", "id", "status", "updatedAt") SELECT "createdAt", "id", "status", "updatedAt" FROM "BookingStatus";
DROP TABLE "BookingStatus";
ALTER TABLE "new_BookingStatus" RENAME TO "BookingStatus";
CREATE TABLE "new_Building" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "estate" TEXT,
    "address" TEXT NOT NULL,
    "numOfFloors" INTEGER NOT NULL,
    "managerId" TEXT,
    "lawFirmId" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Building_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Building_lawFirmId_fkey" FOREIGN KEY ("lawFirmId") REFERENCES "LawFirm" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Building" ("address", "createdAt", "estate", "id", "lawFirmId", "managerId", "name", "numOfFloors", "updatedAt") SELECT "address", "createdAt", "estate", "id", "lawFirmId", "managerId", "name", "numOfFloors", "updatedAt" FROM "Building";
DROP TABLE "Building";
ALTER TABLE "new_Building" RENAME TO "Building";
CREATE TABLE "new_BuildingFeature" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "buildingId" INTEGER NOT NULL,
    "featureId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BuildingFeature_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BuildingFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BuildingFeature" ("buildingId", "createdAt", "featureId", "id", "updatedAt") SELECT "buildingId", "createdAt", "featureId", "id", "updatedAt" FROM "BuildingFeature";
DROP TABLE "BuildingFeature";
ALTER TABLE "new_BuildingFeature" RENAME TO "BuildingFeature";
CREATE TABLE "new_Expense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "category" TEXT NOT NULL,
    "apartmentId" INTEGER,
    "buildingId" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Expense_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Expense_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Expense" ("amount", "apartmentId", "buildingId", "category", "createdAt", "description", "id", "updatedAt") SELECT "amount", "apartmentId", "buildingId", "category", "createdAt", "description", "id", "updatedAt" FROM "Expense";
DROP TABLE "Expense";
ALTER TABLE "new_Expense" RENAME TO "Expense";
CREATE TABLE "new_Feature" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "feature" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Feature" ("createdAt", "feature", "id", "updatedAt") SELECT "createdAt", "feature", "id", "updatedAt" FROM "Feature";
DROP TABLE "Feature";
ALTER TABLE "new_Feature" RENAME TO "Feature";
CREATE TABLE "new_GuestBooking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "apartmentId" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "bookingStatusId" INTEGER NOT NULL,
    "leaseTerm" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GuestBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GuestBooking_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GuestBooking_bookingStatusId_fkey" FOREIGN KEY ("bookingStatusId") REFERENCES "BookingStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GuestBooking" ("apartmentId", "bookingStatusId", "createdAt", "endDate", "id", "leaseTerm", "startDate", "updatedAt", "userId") SELECT "apartmentId", "bookingStatusId", "createdAt", "endDate", "id", "leaseTerm", "startDate", "updatedAt", "userId" FROM "GuestBooking";
DROP TABLE "GuestBooking";
ALTER TABLE "new_GuestBooking" RENAME TO "GuestBooking";
CREATE TABLE "new_Inspection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "apartmentId" INTEGER NOT NULL,
    "inspectionTypeId" INTEGER NOT NULL,
    "inspectionDate" DATETIME NOT NULL,
    "inspectedBy" TEXT NOT NULL,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Inspection_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Inspection_inspectionTypeId_fkey" FOREIGN KEY ("inspectionTypeId") REFERENCES "InspectionType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Inspection" ("apartmentId", "createdAt", "id", "inspectedBy", "inspectionDate", "inspectionTypeId", "notes", "updatedAt") SELECT "apartmentId", "createdAt", "id", "inspectedBy", "inspectionDate", "inspectionTypeId", "notes", "updatedAt" FROM "Inspection";
DROP TABLE "Inspection";
ALTER TABLE "new_Inspection" RENAME TO "Inspection";
CREATE TABLE "new_InspectionType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_InspectionType" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "InspectionType";
DROP TABLE "InspectionType";
ALTER TABLE "new_InspectionType" RENAME TO "InspectionType";
CREATE TABLE "new_LawFirm" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_LawFirm" ("address", "createdAt", "email", "id", "name", "phone", "updatedAt") SELECT "address", "createdAt", "email", "id", "name", "phone", "updatedAt" FROM "LawFirm";
DROP TABLE "LawFirm";
ALTER TABLE "new_LawFirm" RENAME TO "LawFirm";
CREATE TABLE "new_Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rentId" INTEGER NOT NULL,
    "tenantId" TEXT NOT NULL,
    "amountPaid" REAL NOT NULL,
    "paymentId" TEXT NOT NULL,
    "accountPaidTo" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "paymentDate" DATETIME NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payment_rentId_fkey" FOREIGN KEY ("rentId") REFERENCES "Rent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("accountPaidTo", "amountPaid", "createdAt", "id", "paymentDate", "paymentId", "rentId", "tenantId", "updatedAt") SELECT "accountPaidTo", "amountPaid", "createdAt", "id", "paymentDate", "paymentId", "rentId", "tenantId", "updatedAt" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
CREATE TABLE "new_Rent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "apartmentId" INTEGER NOT NULL,
    "tenantId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "totalAmount" REAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Rent_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rent_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Rent" ("apartmentId", "createdAt", "endDate", "id", "startDate", "tenantId", "totalAmount", "updatedAt") SELECT "apartmentId", "createdAt", "endDate", "id", "startDate", "tenantId", "totalAmount", "updatedAt" FROM "Rent";
DROP TABLE "Rent";
ALTER TABLE "new_Rent" RENAME TO "Rent";
CREATE TABLE "new_UnitFeature" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "apartmentId" INTEGER NOT NULL,
    "featureId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UnitFeature_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UnitFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UnitFeature" ("apartmentId", "createdAt", "featureId", "id", "updatedAt") SELECT "apartmentId", "createdAt", "featureId", "id", "updatedAt" FROM "UnitFeature";
DROP TABLE "UnitFeature";
ALTER TABLE "new_UnitFeature" RENAME TO "UnitFeature";
CREATE TABLE "new_UnitParking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "apartmentId" INTEGER NOT NULL,
    "parkingSpot" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "makeModel" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UnitParking_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UnitParking" ("apartmentId", "color", "createdAt", "id", "licensePlate", "makeModel", "parkingSpot", "updatedAt") SELECT "apartmentId", "color", "createdAt", "id", "licensePlate", "makeModel", "parkingSpot", "updatedAt" FROM "UnitParking";
DROP TABLE "UnitParking";
ALTER TABLE "new_UnitParking" RENAME TO "UnitParking";
CREATE TABLE "new_UnitPhoto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "apartmentId" INTEGER NOT NULL,
    "photo" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UnitPhoto_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UnitPhoto" ("apartmentId", "createdAt", "id", "photo", "updatedAt") SELECT "apartmentId", "createdAt", "id", "photo", "updatedAt" FROM "UnitPhoto";
DROP TABLE "UnitPhoto";
ALTER TABLE "new_UnitPhoto" RENAME TO "UnitPhoto";
CREATE TABLE "new_UnitPrice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "apartmentId" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "fromDate" DATETIME NOT NULL,
    "toDate" DATETIME,
    "specialPrice" REAL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UnitPrice_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UnitPrice" ("apartmentId", "createdAt", "fromDate", "id", "price", "specialPrice", "toDate", "updatedAt") SELECT "apartmentId", "createdAt", "fromDate", "id", "price", "specialPrice", "toDate", "updatedAt" FROM "UnitPrice";
DROP TABLE "UnitPrice";
ALTER TABLE "new_UnitPrice" RENAME TO "UnitPrice";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'guest',
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "contactAddress" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "lga" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "height" REAL,
    "dateOfBirth" DATETIME,
    "occupation" TEXT,
    "aboutMe" TEXT,
    "socialMediaHandlesId" INTEGER,
    "ipAddress" TEXT,
    "gps" TEXT,
    "deviceInfo" TEXT,
    "lastLogin" DATETIME,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_socialMediaHandlesId_fkey" FOREIGN KEY ("socialMediaHandlesId") REFERENCES "SocialMediaHandles" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("aboutMe", "contactAddress", "country", "createdAt", "dateOfBirth", "deviceInfo", "email", "firstName", "gps", "height", "id", "image", "ipAddress", "lastLogin", "lastName", "lga", "middleName", "name", "occupation", "password", "phone", "role", "socialMediaHandlesId", "state", "updatedAt", "username") SELECT "aboutMe", "contactAddress", "country", "createdAt", "dateOfBirth", "deviceInfo", "email", "firstName", "gps", "height", "id", "image", "ipAddress", "lastLogin", "lastName", "lga", "middleName", "name", "occupation", "password", "phone", "role", "socialMediaHandlesId", "state", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_socialMediaHandlesId_key" ON "User"("socialMediaHandlesId");
CREATE TABLE "new_Utility" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "buildingId" INTEGER NOT NULL,
    "utilityTypeId" INTEGER NOT NULL,
    "readingDate" DATETIME NOT NULL,
    "meterReading" REAL NOT NULL,
    "amount" REAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Utility_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Utility_utilityTypeId_fkey" FOREIGN KEY ("utilityTypeId") REFERENCES "UtilityType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Utility" ("amount", "buildingId", "createdAt", "id", "meterReading", "readingDate", "updatedAt", "utilityTypeId") SELECT "amount", "buildingId", "createdAt", "id", "meterReading", "readingDate", "updatedAt", "utilityTypeId" FROM "Utility";
DROP TABLE "Utility";
ALTER TABLE "new_Utility" RENAME TO "Utility";
CREATE TABLE "new_UtilityType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_UtilityType" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "UtilityType";
DROP TABLE "UtilityType";
ALTER TABLE "new_UtilityType" RENAME TO "UtilityType";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
