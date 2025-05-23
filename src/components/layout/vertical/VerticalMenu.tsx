'use client'

// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import { useAuthStore } from '@/store/authStore'

// Menu Data Imports
// import menuData from '@/data/navigation/verticalMenuData'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  const { user } = useAuthStore()
  // console.log(user?.user_type, 'user_type')
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { settings } = useSettings()
  const params = useParams()
  const { isBreakpointReached } = useVerticalNav()

  // Vars
  const { transitionDuration } = verticalNavOptions
  const { lang: locale, id } = params

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {/* label={dictionary['navigation'].appsPages} */}
        <MenuSection label=''>
          {/* <SubMenu label={dictionary['navigation'].wizardExamples} icon={<i className='tabler-dots' />}>
            <MenuItem href={`/${locale}/pages/wizard-examples/checkout`}>{dictionary['navigation'].checkout}</MenuItem>
            <MenuItem href={`/${locale}/pages/wizard-examples/property-listing`}>
              {dictionary['navigation'].propertyListing}
            </MenuItem>
            <MenuItem href={`/${locale}/pages/wizard-examples/create-deal`}>
              {dictionary['navigation'].createDeal}
            </MenuItem>
          </SubMenu> */}
          <MenuItem href={`/${locale}/home`} icon={<i className='tabler-smart-home' />}>
            {dictionary['navigation'].home}
          </MenuItem>
          {/* <MenuItem href={`/${locale}/plans`} icon={<i className='tabler-currency-dollar text-[22px]' />}>
            {dictionary['navigation'].plans}
          </MenuItem> */}
          {/* {user?.user_type === 'admin' && (
            <MenuItem href={`/${locale}/users`} icon={<i className='tabler-user' />}>
              {dictionary['navigation'].users}
            </MenuItem>
          )} */}
          {Number(user?.user_type) === 1 && (
            <MenuItem href={`/${locale}/users`} icon={<i className='tabler-user' />}>
              {dictionary['navigation'].users}
            </MenuItem>
          )}

          <MenuItem href={`/${locale}/business`} icon={<i className='tabler-chart-bar' />}>
            {dictionary['navigation'].business}
          </MenuItem>

          <MenuItem href={`/${locale}/resturants`} icon={<i className='tabler-box text-[26px]' />}>
            {dictionary['navigation'].outlet}
          </MenuItem>
          <MenuItem href={`/${locale}/menu`} icon={<i className='tabler-list-search' />}>
            {dictionary['navigation'].menu}
          </MenuItem>

          <MenuItem href={`/${locale}/orders`} icon={<i className='tabler-shopping-cart' />}>
            {dictionary['navigation'].orders}
          </MenuItem>
          <MenuItem href={`/${locale}/returns`} icon={<i className='tabler-refresh text-textPrimary' />}>
            {dictionary['navigation'].returns}
          </MenuItem>

          <MenuItem href={`/${locale}/account-settings`} icon={<i className='tabler-settings' />}>
            {dictionary['navigation'].settings}
          </MenuItem>
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
