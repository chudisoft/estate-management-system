// Generated Prisma Types

export type SocialMediaHandles = {
    id: number;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    telegram?: string;
    whatsapp?: string;
    owner?: User;
  };
  
  export type User = {
    id: string;
    email: string;
    name?: string;
    image?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    username: string;
    role: "Manager" | "Tenant" | "Guest" | "Admin" | "Staff" | "Cashier";
    phone: string;
    password: string;
    contactAddress: string;
    state: string;
    lga: string;
    country: string;
    height?: number;
    dateOfBirth?: Date;
    occupation?: string;
    aboutMe?: string;
    socialMediaHandlesId?: number;
    socialMediaHandles?: SocialMediaHandles;
    ipAddress?: string;
    gps?: string;
    deviceInfo?: string;
    lastLogin?: Date;
    apartments: Apartment[];
    managedHouses: Building[];
    bookings: GuestBooking[];
    createdAt: Date;
    updatedAt: Date;
    Rents: Rent[];
    Payments: Payment[];
  };
  
  export type Building = {
    id: number;
    name: string;
    estate?: string;
    address: string;
    numOfFloors: number;
    apartments: Apartment[];
    expenses: Expense[];
    buildingFeature: BuildingFeature[];
    utility: Utility[];
    managerId?: string;
    manager?: User;
    lawFirmId?: number;
    lawFirm?: LawFirm;
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type LawFirm = {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    buildings: Building[];
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type Apartment = {
    id: number;
    name: string;
    cost: number;
    costBy: string;
    address: string;
    buildingId: number;
    building: Building;
    tenants: User[];
    expenses: Expense[];
    bookings: GuestBooking[];
    createdAt: Date;
    updatedAt: Date;
    rents: Rent[];
    unitFeatures: UnitFeature[];
    unitPhotos: UnitPhoto[];
    unitParking: UnitParking[];
    unitPrices: UnitPrice[];
    inspections: Inspection[];
  };
  
  export type Rent = {
    id: number;
    apartmentId: number;
    apartment: Apartment;
    tenantId: string;
    tenant: User;
    startDate: Date;
    endDate: Date;
    totalAmount: number;
    payments: Payment[];
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type Payment = {
    id: number;
    rentId: number;
    rent: Rent;
    tenantId: string;
    tenant: User;
    amountPaid: number;
    paymentId: string;
    accountPaidTo: string;
    paymentDate: Date;
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type Expense = {
    id: number;
    description: string;
    amount: number;
    category: string;
    apartmentId?: number;
    apartment?: Apartment;
    buildingId?: number;
    building?: Building;
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type GuestBooking = {
    id: number;
    userId: string;
    user: User;
    apartmentId: number;
    apartment: Apartment;
    startDate: Date;
    endDate: Date;
    bookingStatusId: number;
    bookingStatus: BookingStatus;
    leaseTerm?: string;
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type Utility = {
    id: number;
    buildingId: number;
    building: Building;
    utilityTypeId: number;
    utilityType: UtilityType;
    readingDate: Date;
    meterReading: number;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type BuildingFeature = {
    id: number;
    buildingId: number;
    building: Building;
    featureId: number;
    feature: Feature;
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type UnitFeature = {
    id: number;
    apartmentId: number;
    apartment: Apartment;
    featureId: number;
    feature: Feature;
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type Feature = {
    id: number;
    feature: string;
    buildings: BuildingFeature[];
    apartments: UnitFeature[];
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type UnitPhoto = {
    id: number;
    apartmentId: number;
    apartment: Apartment;
    photo: string;
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type UnitParking = {
    id: number;
    apartmentId: number;
    apartment: Apartment;
    parkingSpot: string;
    licensePlate: string;
    makeModel: string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type UnitPrice = {
    id: number;
    apartmentId: number;
    apartment: Apartment;
    price: number;
    fromDate: Date;
    toDate?: Date;
    specialPrice?: number;
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type Inspection = {
    id: number;
    apartmentId: number;
    apartment: Apartment;
    inspectionTypeId: number;
    inspectionType: InspectionType;
    inspectionDate: Date;
    inspectedBy: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type InspectionType = {
    id: number;
    inspectionType: string;
    inspections: Inspection[];
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type UtilityType = {
    id: number;
    utilityType: string;
    utilities: Utility[];
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type BookingStatus = {
    id: number;
    status: string;
    guestBookings: GuestBooking[];
    createdAt: Date;
    updatedAt: Date;
  };
  