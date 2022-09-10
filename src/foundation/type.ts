export enum DeliveryMedium {
  Email = "email",
  Telephone = "telephone",
}

export interface Friend {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  telephone: string;
  deliveryMedium: DeliveryMedium;
}

export enum DataDriver {
  FileSystem = "file-system",
  SQLLite = "sql-lite",
}
