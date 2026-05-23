namespace Hotel.Domain.Enums;

public enum HotelStatus { Active, Inactive, Suspended }
public enum RoomStatus { Available, Occupied, Maintenance, Cleaning, OutOfOrder, Reserved }
public enum ReservationStatus { Confirmed, CheckedIn, CheckedOut, Cancelled, NoShow, Pending }
public enum PaymentStatus { Pending, Completed, Failed, Refunded, PartiallyRefunded, Cancelled }
public enum PaymentMethod { Cash, CreditCard, DebitCard, BankTransfer, OnlinePayment, Voucher, Other }
public enum HoldStatus { Active, Released, Converted, Expired }
public enum UserRole { SuperAdmin, Admin, Staff }
public enum UserStatus { Active, Inactive, Suspended, Pending }
public enum GuestStatus { Active, Inactive, Blacklisted }
public enum DocumentType { Passport, NationalId, DriverLicense, Other }
