import axios from 'axios'

import type { BusinessDataType, BusinessDataTypeForAddBusiness } from './interface/businessInterface'
import { DELETE, GET, GETBYID, PATCH, POST, POSTFILE, SEARCHBYPARAMSPAGINATION } from './api'
import { ENDPOINTS } from './vars/vars'
import { BusinessEditPayload, BusinessType } from '@/types/apps/businessTypes'

export async function getAllBusiness(): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.userbusinesses}/`
    const response = await GET(url)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching business data')
    }
  }
}

export async function getPaginatedBusiness(params: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.userbusinesses}`
    const response = await SEARCHBYPARAMSPAGINATION(url, params)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching business data')
    }
  }
}

export async function createBusiness(data: BusinessDataTypeForAddBusiness): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.userbusinesses}/`
    const response = await POSTFILE(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating business')
    }
  }
}

export async function deleteBusiness(id: string): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.userbusinesses}`
    const response = await DELETE(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in deleting userbusinesses')
    }
  }
}
export async function getBusinessById(id: number): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.userbusinesses}`
    const response = await GETBYID(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching userbusinesses data')
    }
  }
}
export async function updateBusiness(id: number, data: BusinessEditPayload): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.userbusinesses}/${id}/`
    const response = await PATCH(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      // You can customize the error handling based on your API's error structure
      throw error.response
    } else {
      throw new Error('Error in updating userbusinesses data')
    }
  }
}
