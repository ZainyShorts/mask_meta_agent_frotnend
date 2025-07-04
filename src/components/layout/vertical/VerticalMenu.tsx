// "use client"

// import type React from "react"

// // Next Imports
// import { useParams } from "next/navigation"

// // MUI Imports
// import { useTheme } from "@mui/material/styles"

// // Third-party Imports
// import PerfectScrollbar from "react-perfect-scrollbar"

// // Type Imports
// import type { getDictionary } from "@/utils/getDictionary"
// import type { VerticalMenuContextProps } from "@menu/components/vertical-menu/Menu"

// // Component Imports
// import { Menu, MenuItem, MenuSection } from "@menu/vertical-menu"

// // Hook Imports
// import { useSettings } from "@core/hooks/useSettings"
// import useVerticalNav from "@menu/hooks/useVerticalNav"

// // Styled Component Imports
// import StyledVerticalNavExpandIcon from "@menu/styles/vertical/StyledVerticalNavExpandIcon"

// // Style Imports
// import menuItemStyles from "@core/styles/vertical/menuItemStyles"
// import menuSectionStyles from "@core/styles/vertical/menuSectionStyles"
// import { useAuthStore } from "@/store/authStore"

// type RenderExpandIconProps = {
//   open?: boolean
//   transitionDuration?: VerticalMenuContextProps["transitionDuration"]
// }

// type Props = {
//   dictionary: Awaited<ReturnType<typeof getDictionary>>
//   scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
// }

// const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
//   <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
//     <i className="tabler-chevron-right" />
//   </StyledVerticalNavExpandIcon>
// )

// // Custom disabled MenuItem component
// const DisabledMenuItem = ({
//   children,
//   icon,
//   className = "",
// }: { children: React.ReactNode; icon: React.ReactNode; className?: string }) => (
//   <div
//     className={`flex items-center px-4 py-2 text-gray-400 cursor-not-allowed opacity-50 select-none ${className}`}
//     onClick={(e) => e.preventDefault()}
//     style={{ pointerEvents: "none" }}
//   >
//     <span className="mr-3">{icon}</span>
//     <span>{children}</span>
//   </div>
// )

// const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
//   const { user } = useAuthStore()
//   console.log(user, " user", user?.subscription)

//   // Hooks
//   const theme = useTheme()
//   const verticalNavOptions = useVerticalNav()
//   const { settings } = useSettings()
//   const params = useParams()
//   const { isBreakpointReached } = useVerticalNav()

//   // Vars
//   const { transitionDuration } = verticalNavOptions
//   const { lang: locale, id } = params

//   const ScrollWrapper = isBreakpointReached ? "div" : PerfectScrollbar

//   // Check if user has subscription
//   const hasSubscription = user?.subscription !== false

//   if(user){
//     return (
//       <ScrollWrapper
//         {...(isBreakpointReached
//           ? {
//               className: "bs-full overflow-y-auto overflow-x-hidden",
//               onScroll: (container) => scrollMenu(container, false),
//             }
//           : {
//               options: { wheelPropagation: false, suppressScrollX: true },
//               onScrollY: (container) => scrollMenu(container, true),
//             })}
//       >
//         <Menu
//           popoutMenuOffset={{ mainAxis: 23 }}
//           menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
//           renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
//           renderExpandedMenuItemIcon={{ icon: <i className="tabler-circle text-xs" /> }}
//           menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
//         >
//           <MenuSection label="">
//             {/* Home - Conditional rendering based on subscription */}
//             {hasSubscription ? (
//               <MenuItem href={`/${locale}/home`} icon={<i className="tabler-smart-home" />}>
//                 {dictionary["navigation"].home}
//               </MenuItem>
//             ) : (
//               <DisabledMenuItem icon={<i className="tabler-smart-home" />}>
//                 {dictionary["navigation"].home}
//               </DisabledMenuItem>
//             )}
  
//             {/* Users - Only for user_type 1 and with subscription */}
//             {Number(user?.user_type) !== 3 && (
//               <>
//                 {hasSubscription ? (
//                   <MenuItem href={`/${locale}/users`} icon={<i className="tabler-user" />}>
//                     {dictionary["navigation"].users}
//                   </MenuItem>
//                 ) : (
//                   <DisabledMenuItem icon={<i className="tabler-user" />}>
//                     {dictionary["navigation"].users}
//                   </DisabledMenuItem>
//                 )}
//               </>
//             )}
  
//             {/* Business - Conditional rendering */}
//             {hasSubscription ? (
//               <MenuItem href={`/${locale}/business`} icon={<i className="tabler-chart-bar" />}>
//                 {dictionary["navigation"].business}
//               </MenuItem>
//             ) : (
//               <DisabledMenuItem icon={<i className="tabler-chart-bar" />}>
//                 {dictionary["navigation"].business}
//               </DisabledMenuItem>
//             )}
  
//             {/* Restaurants - Conditional rendering */}
//             {hasSubscription ? (
//               <MenuItem href={`/${locale}/resturants`} icon={<i className="tabler-box text-[26px]" />}>
//                 {dictionary["navigation"].outlet}
//               </MenuItem>
//             ) : (
//               <DisabledMenuItem icon={<i className="tabler-box text-[26px]" />}>
//                 {dictionary["navigation"].outlet}
//               </DisabledMenuItem>
//             )}
  
//             {/* Menu - Conditional rendering */}
//             {hasSubscription ? (
//               <MenuItem href={`/${locale}/menu`} icon={<i className="tabler-list-search" />}>
//                 {dictionary["navigation"].menu}
//               </MenuItem>
//             ) : (
//               <DisabledMenuItem icon={<i className="tabler-list-search" />}>
//                 {dictionary["navigation"].menu}
//               </DisabledMenuItem>
//             )}
  
//             {/* Orders - Conditional rendering */}
//             {hasSubscription ? (
//               <MenuItem href={`/${locale}/orders`} icon={<i className="tabler-shopping-cart" />}>
//                 {dictionary["navigation"].orders}
//               </MenuItem>
//             ) : (
//               <DisabledMenuItem icon={<i className="tabler-shopping-cart" />}>
//                 {dictionary["navigation"].orders}
//               </DisabledMenuItem>
//             )}
  
//             {/* Returns - Conditional rendering */}
//             {hasSubscription ? (
//               <MenuItem href={`/${locale}/returns`} icon={<i className="tabler-refresh text-textPrimary" />}>
//                 {dictionary["navigation"].returns}
//               </MenuItem>
//             ) : (
//               <DisabledMenuItem icon={<i className="tabler-refresh text-textPrimary" />}>
//                 {dictionary["navigation"].returns}
//               </DisabledMenuItem>
//             )}
  
//             {/* Settings - Always enabled */}
            
//               <MenuItem href={`/${locale}/account-settings`} icon={<i className="tabler-settings" />}>
//                 {dictionary["navigation"].settings}
//               </MenuItem>
            
  
            
//           </MenuSection>
//         </Menu>
//       </ScrollWrapper>
//     )
//   }
// }

// export default VerticalMenu

"use client"

import type React from "react"
import { useParams } from "next/navigation"
import { useTheme } from "@mui/material/styles"
import PerfectScrollbar from "react-perfect-scrollbar"
import type { getDictionary } from "@/utils/getDictionary"
import type { VerticalMenuContextProps } from "@menu/components/vertical-menu/Menu"
import { Menu, MenuItem, MenuSection } from "@menu/vertical-menu"
import { useSettings } from "@core/hooks/useSettings"
import useVerticalNav from "@menu/hooks/useVerticalNav"
import StyledVerticalNavExpandIcon from "@menu/styles/vertical/StyledVerticalNavExpandIcon"
import menuItemStyles from "@core/styles/vertical/menuItemStyles"
import menuSectionStyles from "@core/styles/vertical/menuSectionStyles"
import { useAuthStore } from "@/store/authStore"

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps["transitionDuration"]
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className="tabler-chevron-right" />
  </StyledVerticalNavExpandIcon>
)

// Custom disabled MenuItem component
const DisabledMenuItem = ({
  children,
  icon,
  className = "",
}: { children: React.ReactNode; icon: React.ReactNode; className?: string }) => (
  <div
    className={`flex items-center px-4 py-2 text-gray-400 cursor-not-allowed opacity-50 select-none ${className}`}
    onClick={(e) => e.preventDefault()}
    style={{ pointerEvents: "none" }}
  >
    <span className="mr-3">{icon}</span>
    <span>{children}</span>
  </div>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  const { user } = useAuthStore()

  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { settings } = useSettings()
  const params = useParams()
  const { isBreakpointReached } = useVerticalNav()

  // Vars
  const { transitionDuration } = verticalNavOptions
  const { lang: locale } = params
  const ScrollWrapper = isBreakpointReached ? "div" : PerfectScrollbar

  if (!user) return null

  // Get user type and subscription status
  const userType = Number(user?.user_type)
  const hasSubscription = user?.subscription === true

  // Helper function to determine if a menu item should be enabled
  const isMenuItemEnabled = (menuItem: string): boolean => {
    // If no subscription, all items are disabled except settings (which is always enabled)
    if (!hasSubscription) {
      return menuItem === "settings"
    }

    // If has subscription, check user type restrictions
    switch (userType) {
      case 1:
        // Type 1: Show all items when subscription is true
        return true

      case 2:
        // Type 2: Disable home and settings when subscription is true
        return !["home", "settings"].includes(menuItem)

      case 3:
        // Type 3: Disable home, settings, users, business, and outlet when subscription is true
        return !["home", "settings", "users", "business", "outlet"].includes(menuItem)

      default:
        return true
    }
  }

  // Helper function to render menu item (enabled or disabled)
  const renderMenuItem = (
    menuItem: string,
    href: string,
    icon: React.ReactNode,
    label: string,
    additionalCondition = true,
  ) => {
    const isEnabled = isMenuItemEnabled(menuItem) && additionalCondition

    if (isEnabled) {
      return (
        <MenuItem href={href} icon={icon}>
          {label}
        </MenuItem>
      )
    } else {
      return <DisabledMenuItem icon={icon}>{label}</DisabledMenuItem>
    }
  }

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: "bs-full overflow-y-auto overflow-x-hidden",
            onScroll: (container) => scrollMenu(container, false),
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: (container) => scrollMenu(container, true),
          })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className="tabler-circle text-xs" /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuSection label="">
          {/* Home */}
          {renderMenuItem(
            "home",
            `/${locale}/home`,
            <i className="tabler-smart-home" />,
            dictionary["navigation"].home,
          )}

          {/* Users - Only show for user_type 1 */}
          {userType != 3 &&
            renderMenuItem("users", `/${locale}/users`, <i className="tabler-user" />, dictionary["navigation"].users)}

          {/* Business */}
          {renderMenuItem(
            "business",
            `/${locale}/business`,
            <i className="tabler-chart-bar" />,
            dictionary["navigation"].business,
          )}

          {/* Outlet/Restaurants */}
          {renderMenuItem(
            "outlet",
            `/${locale}/resturants`,
            <i className="tabler-box text-[26px]" />,
            dictionary["navigation"].outlet,
          )}

          {/* Menu */}
          {renderMenuItem(
            "menu",
            `/${locale}/menu`,
            <i className="tabler-list-search" />,
            dictionary["navigation"].menu,
          )}

          {/* Orders */}
          {renderMenuItem(
            "orders",
            `/${locale}/orders`,
            <i className="tabler-shopping-cart" />,
            dictionary["navigation"].orders,
          )}

          {/* Returns */}
          {renderMenuItem(
            "returns",
            `/${locale}/returns`,
            <i className="tabler-refresh text-textPrimary" />,
            dictionary["navigation"].returns,
          )}

          {/* Settings */}
          {renderMenuItem(
            "settings",
            `/${locale}/account-settings`,
            <i className="tabler-settings" />,
            dictionary["navigation"].settings,
          )}
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
