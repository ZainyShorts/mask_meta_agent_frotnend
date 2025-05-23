'use client'

// MUI Imports
import { Card, CardContent, Typography, Grid, Divider, CircularProgress, Alert } from '@mui/material'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import OrderItemComponent from '@/components/OrderItemComponent'
import PopularProducts from '@/components/PopularProducts'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// React Imports
import { useEffect, useState } from 'react'

// Utility Imports
import {
  convertToPakistanDatePlus10Days,
  convertToPakistanDateWithoutTime,
  convertToPakistanTime,
  convertToPakistanTimePlusOneHourWithDate
} from '@/utils/dateUtils'

// Type Imports
import { OrderItems, OrderUserObject } from '@/types/apps/orderTypes'
import { BusinessDataTypeForAddBusiness } from '@/api/interface/businessInterface'
import { OrderDataType, OrderItem } from '@/api/interface/orderInterface'

// API Imports
import { getOrderById } from '@/api/order'

type PreviewOrderReturnDetailsProps = {
  id: string
}

const OrderPreviewDetails = ({ id }: PreviewOrderReturnDetailsProps) => {
  // State Hooks
  const [orderAddress, setOrderAddress] = useState<string | null>(null)
  const [orderStatus, setOrderStatus] = useState<string | null>(null)
  const [orderDeliveryType, setOrderDeliveryType] = useState<string | null>(null)
  const [orderCreatedDate, setOrderCreatedDate] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [orderTotalPrice, setOrderTotalPrice] = useState<number | null>(0)
  // total_price
  const [orderSpecialInstruction, setOrderSpecialInstruction] = useState<string | null>(null)

  const [orderItemsData, setOrderItemsData] = useState<OrderItems[]>([])
  const [orderBusinessData, setOrderBusinessData] = useState<BusinessDataTypeForAddBusiness | null>(null)
  const [orderUserData, setOrderUserData] = useState<OrderUserObject | null>(null)

  const [totalAmount, setTotalAmount] = useState<number>(0)

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch Order Data
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(Number(id))
        // console.log(response, 'response of single order')
        const data = response?.data
        setOrderTotalPrice(response?.data?.total_price)
        setOrderUserData(data?.user || null)
        setOrderAddress(data?.address || null)
        setOrderStatus(data?.status || null)
        setOrderDeliveryType(data?.delivery_type || null)
        setOrderNumber(data?.order_number || null)
        setOrderItemsData(data?.order_items || [])
        setOrderBusinessData(data?.business || null)
        setOrderCreatedDate(data?.created_at || null)
        setOrderSpecialInstruction(data?.special_instruction || null)
      } catch (error: any) {
        console.error('An error occurred while fetching order data:', error)
        setError('Failed to fetch order data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  // Calculate Total Amount
  useEffect(() => {
    const calculateTotal = () => {
      const sum = orderItemsData.reduce((acc, item) => {
        /* changed total_price to net_price to fix the mismatched value */

        const itemTotal = item.quantity * parseFloat(item.net_price)
        return acc + itemTotal
      }, 0)
      setTotalAmount(sum)
    }
    calculateTotal()
  }, [orderItemsData])

  if (loading) {
    return (
      <div className='flex justify-center items-center h-full'>
        <CircularProgress />
      </div>
    )
  }

  if (error) {
    return (
      <Alert severity='error' className='m-4'>
        {error}
      </Alert>
    )
  }

  return (
    <Card>
      <CardContent className='sm:p-12'>
        <Grid container spacing={6}>
          {/* Order Header */}
          <Grid item xs={12}>
            <div className='p-6 bg-actionHover rounded'>
              <div className='flex justify-between gap-y-4 flex-col sm:flex-row'>
                {/* Logo and Address */}
                <div className='flex flex-col gap-6'>
                  <div className='flex items-center gap-2.5'>
                    <Logo />
                  </div>
                  {orderAddress && <Typography color='text.primary'>{orderAddress}</Typography>}
                </div>
                {/* Order Number and Dates */}
                <div className='flex flex-col gap-6'>
                  {orderNumber && <Typography variant='h5'>{`Order Number #${orderNumber}`}</Typography>}
                  <div className='flex flex-col gap-1'>
                    {orderCreatedDate && (
                      <>
                        <Typography color='text.primary'>{`Date Issued: ${convertToPakistanDateWithoutTime(orderCreatedDate)}`}</Typography>
                        {/* <Typography color='text.primary'>{`Date Due: ${convertToPakistanDatePlus10Days(orderCreatedDate)}`}</Typography> */}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Grid>

          {/* Customer and Bill To Details */}
          <Grid item xs={12}>
            <Grid container spacing={6}>
              {/* Invoice To */}
              <Grid item xs={12} sm={6}>
                <div className='flex flex-col gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Invoice Details:
                  </Typography>
                  {orderUserData && (
                    <div>
                      <Typography>Customer Name: {orderUserData.name}</Typography>
                      <Typography>Customer Email: {orderUserData.email}</Typography>
                      <Typography>Customer Status: {orderUserData.status}</Typography>
                    </div>
                  )}
                </div>
              </Grid>

              {/* Bill To */}
              <Grid item xs={12} sm={6}>
                <div className='flex flex-col gap-4'>
                  <div>
                    {orderStatus && (
                      <div className='flex items-center gap-4'>
                        <Typography className='min-w-[150px] font-medium'>Order Status:</Typography>
                        <Typography>{orderStatus}</Typography>
                      </div>
                    )}
                    {orderDeliveryType && (
                      <div className='flex items-center gap-4'>
                        <Typography className='min-w-[150px] font-medium'>Delivery Type:</Typography>
                        <Typography>{orderDeliveryType}</Typography>
                      </div>
                    )}
                    {orderCreatedDate && (
                      <>
                        <div className='flex items-center gap-4'>
                          <Typography className='min-w-[150px] font-medium'>Order Creation Time:</Typography>
                          <Typography>{convertToPakistanTime(orderCreatedDate)}</Typography>
                        </div>
                        <div className='flex items-center gap-4'>
                          <Typography className='min-w-[150px] font-medium'>Order Delivery Time:</Typography>
                          <Typography>{convertToPakistanTimePlusOneHourWithDate(orderCreatedDate)}</Typography>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>

          {/* Order Items */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {orderItemsData && orderItemsData.length > 0 ? (
                orderItemsData.map((item: any) => (
                  <Grid item xs={12} sm={6} lg={4} key={item.id}>
                    <OrderItemComponent item={item} />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography>No Order Items Found</Typography>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <div className='flex justify-between flex-col gap-y-4 sm:flex-row'>
              <div className='flex flex-col gap-1 order-2 sm:order-1'>
                <div className='flex items-center gap-2'>
                  <Typography className='font-medium' color='text.primary'>
                    Salesperson:
                  </Typography>
                  <Typography>Tommy Shelby</Typography>
                </div>
                <Typography>Thanks for your business!</Typography>
              </div>

              <div className='min-w-[200px]'>
                <div className='flex items-center justify-between'>
                  <Typography>Subtotal:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    ${totalAmount.toFixed(2)}
                  </Typography>
                </div>
                <div className='flex items-center justify-between'>
                  <Typography>Discount:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    $0.00
                  </Typography>
                </div>
                <div className='flex items-center justify-between'>
                  <Typography>Tax:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    $0.00
                  </Typography>
                </div>
                <Divider className='my-2' />
                <div className='flex items-center justify-between'>
                  <Typography>Grand Total:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    ${Number(orderTotalPrice ?? 0).toFixed(2)}
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>

          {/* Divider */}
          <Grid item xs={12}>
            <Divider className='border-dashed' />
          </Grid>

          {/* Special Instructions */}
          <Grid item xs={12}>
            <Typography>
              <Typography component='span' className='font-medium' color='text.primary'>
                Special Instructions:
              </Typography>{' '}
              {orderSpecialInstruction ? `${orderSpecialInstruction};` : ''} Thank You!
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default OrderPreviewDetails
