import type { Metadata } from 'next'

import MenuList from '@/views/Menu'

export const metadata: Metadata = {
  title: 'Menu',
  description: 'All Menues'
}

const MenuPage = () => {
  return <MenuList />
}

export default MenuPage
