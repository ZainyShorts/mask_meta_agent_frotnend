export interface InstagramDataType {
  id: number
  business: number
  instagram_id: string
  access_token?: string // Typo in property name, should be corrected if intentional
  account_id: number
  feed_to_gpt: number
  active: boolean
}
