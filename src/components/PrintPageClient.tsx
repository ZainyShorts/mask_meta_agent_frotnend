'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import styles from '@/styles/Receipt.module.css'
import { getOrderById } from '@/api/order'
import { OrderItems } from '@/types/apps/orderTypes'
import { BusinessDataTypeForAddBusiness } from '@/api/interface/businessInterface'

import { convertToPakistanTime, convertToPakistanTimePlusOneHour } from '@/utils/dateUtils'

interface PrintPageProps {
  id: string
}

const PrintPageClient: React.FC<PrintPageProps> = ({ id }) => {
  const [orderAddress, setOrderAddress] = useState<string | null>(null)
  const [deliveryType, setDeliveryType] = useState<string | null>(null)
  const [orderCreatedDate, setOrderCreatedDate] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [orderItemsData, setOrderItemsData] = useState<OrderItems[]>([])
  const [orderBusinessData, setOrderBusinessData] = useState<BusinessDataTypeForAddBusiness | null>(null)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [orderTotalPrice, setOrderTotalPrice] = useState<string | null>(null)

  const myRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(Number(id))
        const orderData = response?.data
        if (!orderData.is_pos && orderData.delivery_type === 'delivery') {
          // Remove "Textinput " from the address field
          const refinedAddress = orderData.address.replace(/Textinput /g, '')
          setOrderAddress(refinedAddress)
        } else {
          setOrderAddress(orderData.address)
        }
        // console.log(response, 'response------------')
        setOrderTotalPrice(response?.data?.total_price)
        // setOrderAddress(response?.data?.address)
        setOrderNumber(response?.data?.order_number)
        setOrderItemsData(response?.data?.order_items)
        setOrderBusinessData(response?.data?.business)
        setOrderCreatedDate(response?.data?.created_at)
        setDeliveryType(response?.data?.delivery_type)
      } catch (error: any) {
        console.error('An error occurred while fetching order data:', error)
      }
    }
    fetchOrder()
  }, [id])

  useEffect(() => {
    const calculateTotal = () => {
      const sum = orderItemsData.reduce((acc, item) => {
        // changed total_price to net_price to fix the mismatched value
        const itemTotal = item.quantity * parseFloat(item.net_price)
        return acc + itemTotal
      }, 0)
      setTotalAmount(sum)
    }
    calculateTotal()
  }, [orderItemsData])

  return (
    <>
      <div className={styles.receiptContainer} ref={myRef}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <div>
            <Image src='/images/logo.png' alt='Logo' width={70} height={70} />
          </div>
          <h1 style={{ paddingBottom: '10px' }}>{orderBusinessData?.business_id}</h1>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p>{orderAddress ? orderAddress : 'No order Address Found'}</p>
          <p>143, 33649</p>
          <p>Business, Tel: {orderBusinessData?.contact_number}</p>
          <p style={{ fontWeight: 'bold' }}>Order ID: {orderNumber ? orderNumber : 'No order number found'}</p>
          Date: {orderCreatedDate ? convertToPakistanTime(orderCreatedDate) : 'No date available'}
          <hr style={{ borderTop: '1px solid gray', margin: '10px 0' }} />
        </div>

        <div style={{ marginTop: '3px', textAlign: 'start' }}>
          <h3>
            Delivery Mode :<span> {deliveryType && deliveryType}</span>
          </h3>

          <h3>
            Confirmed Delivery Time:{' '}
            {orderCreatedDate ? convertToPakistanTimePlusOneHour(orderCreatedDate) : 'No date available'}
          </h3>

          <h3>Food Types</h3>
        </div>

        <div style={{ marginTop: '10px', textAlign: 'start' }}>
          {orderItemsData.length > 0 ? (
            orderItemsData.map(item => (
              <div key={item.id}>
                <h3>{item.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px' }}>
                  {/* changed total_price to net_price to fix the mismatched value */}
                  <p>{/* {item.quantity} × ${parseFloat(item.total_price).toFixed(2)} */}</p>
                  <p>
                    {item.quantity} × ${parseFloat(item.net_price).toFixed(2)}
                  </p>
                  <p> ${(item.quantity * parseFloat(item.net_price)).toFixed(2)}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No order items found.</p>
          )}
          <hr style={{ borderTop: '1px solid gray', margin: '10px 0' }} />
        </div>

        <div style={{ marginTop: '10px', textAlign: 'start' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
            <p>Delivery Cost</p>
            <p> - $0.00</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
            <p>Service Charge</p>
            <p> - $0.00</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
            <p>Total</p>
            <p> ${orderTotalPrice}</p>
          </div>
          <hr style={{ borderTop: '1px solid gray', margin: '10px 0' }} />
        </div>

        <div style={{ marginTop: '10px', textAlign: 'start' }}>
          <h3>The order has not been paid.</h3>
          <h4>Customer will pay with ${orderTotalPrice}</h4>
          <hr style={{ borderTop: '1px solid gray', margin: '10px 0' }} />
        </div>

        <div style={{ marginTop: '5px', textAlign: 'center' }}>
          <p style={{ paddingBottom: '8px' }}>
            <strong>Comments:</strong> Example comment goes here.
          </p>
        </div>
      </div>
    </>
  )
}

export default PrintPageClient
