export interface FaceBookDataType {
  id: number
  business: number
  facebook_id: string
  access_token?: string // Typo in property name, should be corrected if intentional
  webhook_token: string
  facebook_account_id: number
  catalog_id: string
  feed_to_gpt: number
  active: boolean
}
