// OrderItemComponent.tsx
import React from 'react'
import { Card, CardContent, CardMedia, Typography, Chip, Stack, CardHeader } from '@mui/material'
import { OrderItem } from '@/api/interface/orderInterface'

interface OrderItemComponentProps {
  item: OrderItem
}

const OrderItemComponent: React.FC<OrderItemComponentProps> = ({ item }) => {
  return (
    <Card>
      <CardHeader title={item.name} />
      <CardContent className='flex flex-col gap-[1.638rem]'>
        <div className='flex items-center gap-4'>
          <div className='flex flex-wrap justify-between items-center gap-x-4 gap-y-1 is-full'>
            <div className='flex flex-col'>
              <Typography variant='body2'>{` Sku : ${item.product_sku}`}</Typography>

              <Typography className='font-medium' color='text.primary'>
                Product Description :
              </Typography>
              <Typography variant='body2'>{item.description}</Typography>
              <Typography>{`Quantity: ${item.quantity}`}</Typography>

              <div className='flex items-center gap-4'>
                <div className='flex flex-wrap justify-between items-center gap-x-4 gap-y-1 is-full'>
                  <Stack direction='row' spacing={1} sx={{ my: 1 }}>
                    {item.status && <Chip label={`Status: ${item.status}`} color='primary' />}
                  </Stack>
                  <Stack direction='row' spacing={1} sx={{ my: 1 }}>
                    {item.size && <Chip label={`Size: ${item.size}`} color='secondary' />}
                  </Stack>
                </div>
              </div>
              <Stack direction='row' spacing={1} sx={{ my: 1 }}>
                {item.spice_level && <Chip label={`Spice Level: ${item.spice_level}`} />}
              </Stack>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <div className='flex flex-wrap justify-between items-center gap-x-4 gap-y-1 is-full'>
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                Product Instruction :
              </Typography>
              <Typography variant='body2'>{item.instruction}</Typography>
              <Typography className='font-medium' color='text.primary'>
                Extra Toppings :
              </Typography>
              <Typography variant='body2'>{item.extra_toppings}</Typography>
            </div>
          </div>
        </div>

        {/* <div className='flex items-center gap-4'>
          <div className='flex flex-wrap justify-between items-center gap-x-4 gap-y-1 is-full'>
            <Stack direction='row' spacing={1} sx={{ my: 1 }}>
              {item.spice_level && <Chip label={`Spice Level: ${item.spice_level}`} />}
            </Stack>
          </div>
        </div> */}

        <div className='flex items-center gap-4'>
          {/* <div className='flex flex-wrap justify-between items-center gap-x-4 gap-y-1 is-full'>
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                Tax Price :
              </Typography>
              <Typography variant='body2'>{item.tax_price}</Typography>
              <Typography className='font-medium' color='text.primary'>
                Net Price :
              </Typography>
              <Typography variant='body2'>{item.net_price}</Typography>
              <Typography className='font-medium' color='text.primary'>
                Total Price :
              </Typography>
              <Typography variant='body2'>{item.total_price}</Typography>
            </div>
          </div> */}
          <div className='flex flex-wrap justify-between items-center gap-x-4 gap-y-1 w-full'>
            <div className='flex flex-col'>
              <div className='flex justify-between w-full'>
                <Typography className='font-medium' color='text.primary'>
                  Tax Price:
                </Typography>
                <Typography variant='body2'>
                  {/* {parseFloat(item.tax_price).toFixed(2)} */}
                  $0.00
                </Typography>
              </div>

              <div className='flex justify-between w-full'>
                <Typography className='font-medium' color='text.primary'>
                  Net Price:
                </Typography>
                <Typography variant='body2'>{parseFloat(item.net_price).toFixed(2)}</Typography>
              </div>

              {/* Divider Line */}
              <div className='border-t border-gray-300 my-2'></div>

              <div className='flex justify-between w-full'>
                <Typography className='font-medium' color='text.primary'>
                  Total Price:
                </Typography>
                <Typography variant='body2'>{parseFloat(item.total_price).toFixed(2)}</Typography>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default OrderItemComponent
