export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  avatarUrl: string | null
  isActive: boolean
  emailVerified: boolean
  roles: string[]
  createdAt: string
}

export interface CreateUserRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  roleIds: string[]
}

export interface UpdateUserRequest {
  firstName: string
  lastName: string
  phone?: string
  roleIds?: string[]
}

export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  avatarUrl: string | null
  emailVerified: boolean
  roles: string[]
}

export interface Hotel {
  id: string
  name: string
  description: string | null
  address: string
  city: string
  country: string
  postalCode: string | null
  latitude: number
  longitude: number
  phone: string | null
  email: string | null
  images: string[]
  amenities: string[]
  checkInTime: string
  checkOutTime: string
  isActive: boolean
  createdAt: string
}

export interface CreateHotelRequest {
  name: string
  description?: string
  address: string
  city: string
  country: string
  postalCode?: string
  latitude?: number
  longitude?: number
  phone?: string
  email?: string
  amenities?: string[]
  checkInTime?: string
  checkOutTime?: string
}

export interface UpdateHotelRequest extends CreateHotelRequest {
  isActive: boolean
}

export type RoomStatus = 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance'

export interface Room {
  id: string
  hotelId: string
  hotelName: string
  roomTypeId: string
  roomTypeName: string
  number: string
  floor: number
  status: RoomStatus
  pricePerNight: number
  description: string | null
  images: string[]
  isActive: boolean
}

export interface CreateRoomRequest {
  hotelId: string
  roomTypeId: string
  number: string
  floor: number
  pricePerNight: number
  description?: string
}

export interface UpdateRoomRequest {
  roomTypeId: string
  number: string
  floor: number
  status: number
  pricePerNight: number
  description?: string
  isActive: boolean
}

export interface RoomType {
  id: string
  hotelId: string
  name: string
  description: string | null
  capacity: number
  basePrice: number
  amenities: string[]
  images: string[]
}

export interface RoomAvailability {
  roomId: string
  number: string
  isAvailable: boolean
  pricePerNight: number
}

export type ReservationStatus =
  | 'Pending'
  | 'Confirmed'
  | 'CheckedIn'
  | 'CheckedOut'
  | 'Cancelled'
  | 'NoShow'

export interface Reservation {
  id: string
  code: string
  hotelId: string
  hotelName: string
  roomId: string
  roomNumber: string
  guestId: string
  guestName: string
  checkIn: string
  checkOut: string
  status: ReservationStatus
  totalAmount: number
  adults: number
  children: number
  notes: string | null
  createdAt: string
}

export interface CreateReservationRequest {
  hotelId: string
  roomId: string
  guestId: string
  checkIn: string
  checkOut: string
  adults?: number
  children?: number
  notes?: string
}

export interface Guest {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  documentType: string | null
  documentNumber: string | null
  nationality: string | null
}

export interface CreateGuestRequest {
  firstName: string
  lastName: string
  email: string
  phone?: string
  documentType?: string
  documentNumber?: string
  nationality?: string
}

export type PaymentStatus =
  | 'Pending'
  | 'Completed'
  | 'Failed'
  | 'Refunded'
  | 'PartiallyRefunded'

export type PaymentMethod =
  | 'Cash'
  | 'CreditCard'
  | 'DebitCard'
  | 'BankTransfer'
  | 'Stripe'

export interface Payment {
  id: string
  reservationId: string
  reservationCode: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  transactionId: string | null
  stripePaymentId: string | null
  processedAt: string | null
  refundAmount: number
  createdAt: string
}

export interface CreatePaymentRequest {
  reservationId: string
  amount: number
  method: number
  notes?: string
}

export interface RefundPaymentRequest {
  amount?: number
  reason?: string
}

export interface DashboardStats {
  totalHotels: number
  totalRooms: number
  activeReservations: number
  todayCheckIns: number
  todayCheckOuts: number
  monthlyRevenue: number
  occupancyRate: number
  pendingPayments: number
}

export interface DailyRevenue {
  date: string
  revenue: number
  paymentCount: number
}

export interface RevenueReport {
  from: string
  to: string
  totalRevenue: number
  totalRefunds: number
  netRevenue: number
  totalPayments: number
  dailyBreakdown: DailyRevenue[]
}

export interface DailyOccupancy {
  date: string
  occupiedRooms: number
  occupancyRate: number
}

export interface OccupancyReport {
  from: string
  to: string
  hotelId: string | null
  totalRooms: number
  occupancyRate: number
  totalReservations: number
  dailyBreakdown: DailyOccupancy[]
}

export interface ReportQuery {
  from?: string
  to?: string
  hotelId?: string
}
