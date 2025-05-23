export interface CurrencyObject {
  id: number
  code: string
  label: string
  symbol: string
}

export type BusinessType = {
  id: number
  business_id: string
  business_address: string
  business_contact?: string
  business_desc: string
  business_access_token: string
  whatsapp_varification_token: string
  business_doc: File
  contact_number: string
  user?: User // Optional User object
  title?: string
  first_name?: string
  email?: string
  business?: any
  business_initial: string
  restaurant: number
  cuisine_type: string
  active: string
  city: string
  name: string
  logo: string
  currency: CurrencyObject
  // user: UserId
}

export type BusinessEditPayload = {
  id: number
  business_id: string
  business_address: string
  business_contact?: string
  business_desc: string
  contact_number: string
  business_initial: string
  business_doc?: string
  name: string
  logo?: string
  currency?: CurrencyObject
}

export type UserId = {
  user: number
}

export type BusinessTypeForFile = {
  id: number
  business_id: string
  business_address: string
  business_contact?: string
  business_desc: string
  business_access_token: string
  whatsapp_varification_token: string
  // business_doc: File
  business_doc: string
  contact_number: string
  user?: User // Optional User object
  title?: string
  first_name?: string
  email?: string
  business?: number
  business_initial: string
  restaurant: number
  file: string
  name: string
  logo: string
  currency: CurrencyObject
}

interface User {
  id: number // Changed from string to number to match BusinessType.userId
  fullName?: string
  email?: string
  avatar?: string
  // ... other user properties
}

export type BusinessId = {
  id: number
}
