export function getBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/'
  // const baseUrl =
    // process.env.NEXT_PUBLIC_API_URL || 'https://mask-toolbots-fjb0fbbteaf4dcdw.westeurope-01.azurewebsites.net/api/'

  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
}

export const ENDPOINTS = {
  login: 'login',
  register: 'register',
  user: 'user',
  verify: 'verify',
  posuser: 'posuser',
  users: 'users',
  restaurants: 'restaurants',
  restaurant: 'restaurant',
  orders: 'orders',
  createOrder: 'orders/create',
  userbusinesses: 'userbusinesses',
  menus: 'menus',
  forgotPassword: 'forgot-password',
  resetPassword: 'reset-password',
  updatePassword: 'update-password',
  userTypes: 'user-types',
  syncMenuMeta: 'save-changes',
  whatsapp: 'whatsapp',
  feedToChatGPT: 'feed-to-gpt',
  postalCodes: 'postal-codes',
  instagram: 'instagram',
  facebook: 'facebook',
  telegram: 'telegram',
  whatsAppQR: 'whatsapp-qr',
  chatgpt: 'chatgpt',
  returnOrders: 'return-orders',
  menuSearch: 'menu-search',
  orderSearch: 'order-search',
  returnOrder: 'return-order',
  topping: 'toppings',
  toppings: 'toppings/by-business',
  toppingsize: 'sizes/by-business',
  types: 'food-types',
  foodTypesByBusiness: 'food-types/by-business',
  businessMenues: 'menus/filter_by_business_and_type',
  sizes: 'sizes',
  createFlow: 'create-flow',
  createTemplate: 'create-template',
  facebookTemplates: 'facebook-templates/by-business',
  facebookFlows: 'facebook-flows/by-business',
  currencies: 'currencies'
}
