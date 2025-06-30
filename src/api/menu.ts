import axios from 'axios'

import type { MenuDataType, SyncMenuDataType } from './interface/menuIterface'
import { ENDPOINTS } from './vars/vars'
import { GET, GETBYID, PATCH, POST, DELETE } from './api'

export async function getAllMenues(businessId : string): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.menus}/${businessId}/`
    const response = await GET(url)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching menus data')
    }
  }
}





// by-business

export async function createMenu(data: MenuDataType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.menus}/`
    const response = await POST(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating Menu')
    }
  }
}

export async function createFlow(data: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.createFlow}/`
    const response = await POST(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating flow')
    }
  }
}

export async function createTemplate(data: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.createTemplate}/`
    const response = await POST(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating Template')
    }
  }
}

export async function deleteMenu(id: number): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.menus}`
    const response = await DELETE(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching Order data')
    }
  }
}
export async function getMenuById(id: number): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.menus}`
    const response = await GETBYID(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching Order data')
    }
  }
}
export async function updateMenu(id: number, data: MenuDataType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.menus}/${id}/`
    const response = await PATCH(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in updating Menu data')
    }
  }
}
export async function syncMenuData(data: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.syncMenuMeta}/`
    const response = await POST(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in Syncing Menu Data')
    }
  }
}
