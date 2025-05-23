import { POST, GET, DELETE, GETBYID, PATCH } from './api'
import { FaceBookDataType } from './interface/facebookInterface'
import { WhatsAppDataType } from './interface/whatsappInterface'
import { ENDPOINTS } from './vars/vars'

export async function FaceBook(data: FaceBookDataType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.facebook}/`
    const response = await POST(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating Facebook')
    }
  }
}

export async function GetFaceBook(): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.facebook}/`
    const response = await GET(url)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in getting Facebook')
    }
  }
}

export async function deleteFaceBook(id: string): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.facebook}`
    const response = await DELETE(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in deleting FaceBook')
    }
  }
}
export async function getFaceBookById(id: number): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.facebook}`
    const response = await GETBYID(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching facebook data')
    }
  }
}

export async function updateFaceBook(id: number, data: FaceBookDataType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.facebook}/${id}/`
    const response = await PATCH(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      // You can customize the error handling based on your API's error structure
      throw error.response
    } else {
      throw new Error('Error in updating facebook data')
    }
  }
}
