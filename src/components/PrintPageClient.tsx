// 'use client'

// import React, { useEffect, useRef, useState } from 'react'
// import Image from 'next/image'

// import styles from '@/styles/Receipt.module.css'
// import { getOrderById } from '@/api/order'
// import { OrderItems } from '@/types/apps/orderTypes'
// import { BusinessDataTypeForAddBusiness } from '@/api/interface/businessInterface'

// import { convertToPakistanTime, convertToPakistanTimePlusOneHour } from '@/utils/dateUtils'

// interface PrintPageProps {
//   id: string
// }

// const PrintPageClient: React.FC<PrintPageProps> = ({ id }) => {
//   const [orderAddress, setOrderAddress] = useState<string | null>(null)
//   const [deliveryType, setDeliveryType] = useState<string | null>(null)
//   const [orderCreatedDate, setOrderCreatedDate] = useState<string | null>(null)
//   const [orderNumber, setOrderNumber] = useState<string | null>(null)
//   const [orderItemsData, setOrderItemsData] = useState<OrderItems[]>([])
//   const [orderBusinessData, setOrderBusinessData] = useState<BusinessDataTypeForAddBusiness | null>(null)
//   const [totalAmount, setTotalAmount] = useState<number>(0)
//   const [orderTotalPrice, setOrderTotalPrice] = useState<string | null>(null)

//   const myRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const response = await getOrderById(Number(id))
//         const orderData = response?.data
//         if (!orderData.is_pos && orderData.delivery_type === 'delivery') {
//           // Remove "Textinput " from the address field
//           const refinedAddress = orderData.address.replace(/Textinput /g, '')
//           setOrderAddress(refinedAddress)
//         } else {
//           setOrderAddress(orderData.address)
//         }
//         // console.log(response, 'response------------')
//         setOrderTotalPrice(response?.data?.total_price)
//         // setOrderAddress(response?.data?.address)
//         setOrderNumber(response?.data?.order_number)
//         setOrderItemsData(response?.data?.order_items)
//         setOrderBusinessData(response?.data?.business)
//         setOrderCreatedDate(response?.data?.created_at)
//         setDeliveryType(response?.data?.delivery_type)
//       } catch (error: any) {
//         console.error('An error occurred while fetching order data:', error)
//       }
//     }
//     fetchOrder()
//   }, [id])

//   useEffect(() => {
//     const calculateTotal = () => {
//       const sum = orderItemsData.reduce((acc, item) => {
//         // changed total_price to net_price to fix the mismatched value
//         const itemTotal = item.quantity * parseFloat(item.net_price)
//         return acc + itemTotal
//       }, 0)
//       setTotalAmount(sum)
//     }
//     calculateTotal()
//   }, [orderItemsData])

//   return (
//     <>
//       <div className={styles.receiptContainer} ref={myRef}>
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
//           <div>
//             <Image src='/images/logo.png' alt='Logo' width={70} height={70} />
//           </div>
//           <h1 style={{ paddingBottom: '10px' }}>{orderBusinessData?.business_id}</h1>
//         </div>

//         <div style={{ textAlign: 'center' }}>
//           <p>{orderAddress ? orderAddress : 'No order Address Found'}</p>
//           <p>143, 33649</p>
//           <p>Business, Tel: {orderBusinessData?.contact_number}</p>
//           <p style={{ fontWeight: 'bold' }}>Order ID: {orderNumber ? orderNumber : 'No order number found'}</p>
//           Date: {orderCreatedDate ? convertToPakistanTime(orderCreatedDate) : 'No date available'}
//           <hr style={{ borderTop: '1px solid gray', margin: '10px 0' }} />
//         </div>

//         <div style={{ marginTop: '3px', textAlign: 'start' }}>
//           <h3>
//             Delivery Mode :<span> {deliveryType && deliveryType}</span>
//           </h3>

//           <h3>
//             Confirmed Delivery Time:{' '}
//             {orderCreatedDate ? convertToPakistanTimePlusOneHour(orderCreatedDate) : 'No date available'}
//           </h3>

//           <h3>Types</h3>
//         </div>

//         <div style={{ marginTop: '10px', textAlign: 'start' }}>
//           {orderItemsData.length > 0 ? (
//             orderItemsData.map(item => (
//               <div key={item.id}>
//                 <h3>{item.name}</h3>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px' }}>
//                   {/* changed total_price to net_price to fix the mismatched value */}
//                   <p>{/* {item.quantity} × ${parseFloat(item.total_price).toFixed(2)} */}</p>
//                   <p>
//                     {item.quantity} × ${parseFloat(item.net_price).toFixed(2)}
//                   </p>
//                   <p> ${(item.quantity * parseFloat(item.net_price)).toFixed(2)}</p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p>No order items found.</p>
//           )}
//           <hr style={{ borderTop: '1px solid gray', margin: '10px 0' }} />
//         </div>

//         <div style={{ marginTop: '10px', textAlign: 'start' }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
//             <p>Delivery Cost</p>
//             <p> - $0.00</p>
//           </div>
//           <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
//             <p>Service Charge</p>
//             <p> - $0.00</p>
//           </div>
//           <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
//             <p>Total</p>
//             <p> ${orderTotalPrice}</p>
//           </div>
//           <hr style={{ borderTop: '1px solid gray', margin: '10px 0' }} />
//         </div>

//         <div style={{ marginTop: '10px', textAlign: 'start' }}>
//           <h3>The order has not been paid.</h3>
//           <h4>Customer will pay with ${orderTotalPrice}</h4>
//           <hr style={{ borderTop: '1px solid gray', margin: '10px 0' }} />
//         </div>

//         <div style={{ marginTop: '5px', textAlign: 'center' }}>
//           <p style={{ paddingBottom: '8px' }}>
//             <strong>Comments:</strong> Example comment goes here.
//           </p>
//         </div>
//       </div>
//     </>
//   )
// }

// export default PrintPageClient

"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { getOrderById } from "@/api/order"
import type { OrderItems } from "@/types/apps/orderTypes"
import type { BusinessDataTypeForAddBusiness } from "@/api/interface/businessInterface"
import { convertToPakistanTime, convertToPakistanTimePlusOneHour } from "@/utils/dateUtils"

type PrintPageClientProps = {
  id: string
}

const PrintPageClient = ({ id }: PrintPageClientProps) => {
  const [orderAddress, setOrderAddress] = useState<string | null>(null)
  const [deliveryType, setDeliveryType] = useState<string | null>(null)
  const [orderCreatedDate, setOrderCreatedDate] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [orderItemsData, setOrderItemsData] = useState<OrderItems[]>([])
  const [orderBusinessData, setOrderBusinessData] = useState<BusinessDataTypeForAddBusiness | null>(null)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [orderTotalPrice, setOrderTotalPrice] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const myRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const response = await getOrderById(Number(id))
        const orderData = response?.data

        if (!orderData.is_pos && orderData.delivery_type === "delivery") {
          // Remove "Textinput " from the address field
          const refinedAddress = orderData.address.replace(/Textinput /g, "")
          setOrderAddress(refinedAddress)
        } else {
          setOrderAddress(orderData.address)
        }

        setOrderTotalPrice(response?.data?.total_price)
        setOrderNumber(response?.data?.order_number)
        setOrderItemsData(response?.data?.order_items)
        setOrderBusinessData(response?.data?.business)
        setOrderCreatedDate(response?.data?.created_at)
        setDeliveryType(response?.data?.delivery_type)
      } catch (error: any) {
        console.error("An error occurred while fetching order data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  useEffect(() => {
    const calculateTotal = () => {
      const sum = orderItemsData.reduce((acc, item) => {
        // changed total_price to net_price to fix the mismatched value
        const itemTotal = item.quantity * Number.parseFloat(item.net_price)
        return acc + itemTotal
      }, 0)
      setTotalAmount(sum)
    }
    calculateTotal()
  }, [orderItemsData])

  if (loading) {
    return (
      <div className="bg-white p-8 text-gray-800 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 text-gray-800 max-w-4xl mx-auto" ref={myRef}>
      {/* Receipt Header */}
      <div className="text-center mb-6 border-b-2 border-gray-200 pb-6">
        <div className="flex justify-center items-center gap-4 mb-4">
          <Image src="/images/logo.png" alt="Logo" width={70} height={70} />
          <h1 className="text-2xl font-bold text-gray-900">{orderBusinessData?.business_id || "MASK CHAT"}</h1>
        </div>
        <div className="space-y-1 text-sm text-gray-600">
          <p>{orderAddress || "No order Address Found"}</p>
          <p>143, 33649</p>
          <p>Business, Tel: {orderBusinessData?.contact_number || "N/A"}</p>
        </div>
      </div>

      {/* Order Information */}
      <div className="text-center mb-6">
        <p className="font-bold text-lg text-gray-900 mb-2">Order ID: {orderNumber || "No order number found"}</p>
        <p className="text-gray-600">
          Date: {orderCreatedDate ? convertToPakistanTime(orderCreatedDate) : "No date available"}
        </p>
        <hr className="border-t border-gray-300 mt-4" />
      </div>

      {/* Delivery Information */}
      <div className="mb-6 text-left space-y-2">
        <h3 className="font-semibold text-gray-900">
          Delivery Mode: <span className="font-normal">{deliveryType || "N/A"}</span>
        </h3>
        <h3 className="font-semibold text-gray-900">
          Confirmed Delivery Time:{" "}
          <span className="font-normal">
            {orderCreatedDate ? convertToPakistanTimePlusOneHour(orderCreatedDate) : "No date available"}
          </span>
        </h3>
        <h3 className="font-semibold text-gray-900 mt-4">Order Items</h3>
      </div>

      {/* Order Items */}
      <div className="mb-6">
        {orderItemsData.length > 0 ? (
          <div className="space-y-4">
            {orderItemsData.map((item) => (
              <div key={item.id} className="border-b border-gray-100 pb-3">
                <h4 className="font-medium text-gray-900 mb-2">{item.name}</h4>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    {item.quantity} × ${Number.parseFloat(item.net_price).toFixed(2)}
                  </span>
                  <span className="font-medium text-gray-900">
                    ${(item.quantity * Number.parseFloat(item.net_price)).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No order items found.</p>
        )}
        <hr className="border-t border-gray-300 mt-4" />
      </div>

      {/* Pricing Breakdown */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Delivery Cost</span>
          <span className="text-gray-900">$0.00</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Service Charge</span>
          <span className="text-gray-900">$0.00</span>
        </div>
        <hr className="border-t border-gray-300 my-3" />
        <div className="flex justify-between items-center text-lg font-bold">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">${orderTotalPrice || "0.00"}</span>
        </div>
        <hr className="border-t border-gray-300 mt-3" />
      </div>

      {/* Payment Information */}
      <div className="mb-6 text-left">
        <h3 className="font-semibold text-gray-900 mb-2">Payment Status</h3>
        <p className="text-red-600 font-medium">The order has not been paid.</p>
        <p className="text-gray-600">Customer will pay: ${orderTotalPrice || "0.00"}</p>
        <hr className="border-t border-gray-300 mt-4" />
      </div>

      {/* Comments Section */}
      <div className="text-center">
        <p className="text-gray-600">
          <strong>Comments:</strong> Thank you for your order!
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t border-gray-200">
        <p>This is a computer-generated receipt.</p>
        <p className="mt-1">For support, contact us at the business number above.</p>
      </div>
    </div>
  )
}

export default PrintPageClient
