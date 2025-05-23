import { GET, POST, DELETE, PATCH, GETBYID } from './api'

import type { ResturantDataType } from './interface/resturantInterface'
import { ENDPOINTS } from './vars/vars'

export async function getAllResturants(): Promise<any> {
  try {
    // debugger
    const url = `whatseat/${ENDPOINTS.restaurants}/`
    const response = await GET(url)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching resturants data')
    }
  }
}

export async function createResturant(data: ResturantDataType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.restaurants}/`
    const response = await POST(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating resturant')
    }
  }
}

export async function deleteRestaurant(id: string): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.restaurants}`
    const response = await DELETE(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in deleting restaurants')
    }
  }
}
export async function getRestaurantById(id: number): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.restaurants}`
    const response = await GETBYID(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching restaurants data')
    }
  }
}
export async function updateResturant(id: number, data: ResturantDataType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.restaurants}/${id}/`
    const response = await PATCH(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      // You can customize the error handling based on your API's error structure
      throw error.response
    } else {
      throw new Error('Error in updating restaurant data')
    }
  }
}
