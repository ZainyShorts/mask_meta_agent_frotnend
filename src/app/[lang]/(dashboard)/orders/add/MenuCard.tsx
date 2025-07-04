import React from 'react'
import { Button, Card, CardContent, Typography } from '@mui/material'
import { MenuDataType } from '@/api/interface/menuIterface'
import Image from 'next/image'
import defaultImage from './../../../../../../public/images/burger.jpg'

interface MenuCardProps {
  product: MenuDataType
  onAdd: () => void
}

const MenuCard: React.FC<MenuCardProps> = ({ product, onAdd }) => {
  

  return (
    <Card
      sx={{
        width: 120,
        height: 150,
        borderRadius: 2,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer'
      }}
      onClick={onAdd}
    >
      {' '}
      {/* <Image
        // style={{ width: '100%', height: '50%' }}
        src={product.image_link || defaultImage}
        width={250}
        height={100}
        alt={product.title}

        // onClick={onAdd}
      /> */}
      <Image
        src={product.image_link || defaultImage}
        alt={product.title}
        width={0}
        height={0}
        sizes='100vw'
        style={{ width: '100%', height: '50%' }}
      />
      <CardContent sx={{ p: 1, textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant='h6' sx={{ fontWeight: 'bold', color: 'black' }}>
          {product.title}
        </Typography>
        <Typography variant='body1' sx={{ fontWeight: 'bold', color: 'black' }}>
          ${product.price}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default MenuCard
