"use client"

// React Imports
import { useState, useEffect } from "react"
import type { SyntheticEvent, ReactElement } from "react"

// MUI Imports
import Grid from "@mui/material/Grid"
import Tab from "@mui/material/Tab"
import TabContext from "@mui/lab/TabContext"
import TabPanel from "@mui/lab/TabPanel"

// Component Imports
import CustomTabList from "@core/components/mui/TabList"
import { useAuthStore } from "@/store/authStore"

const AccountSettings = ({ tabContentList }: { tabContentList: { [key: string]: ReactElement } }) => {
  const { user } = useAuthStore()

  // Check if user has subscription
  const hasSubscription = user?.subscription !== false

  // Set initial active tab based on subscription status
  const getInitialTab = () => {
    if (hasSubscription) {
      return "account" // First tab (Account) when subscription is active
    } else {
      return "billing-plans" // Billing tab when no subscription
    }
  }

  // States
  const [activeTab, setActiveTab] = useState(getInitialTab())

  // Update active tab when subscription status changes
  useEffect(() => {
    setActiveTab(getInitialTab())
  }, [hasSubscription])

  const handleChange = (event: SyntheticEvent, value: string) => {
    // Only allow tab change if user has subscription OR if it's the billing tab
    if (hasSubscription || value === "billing-plans") {
      setActiveTab(value)
    }
  }

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <CustomTabList onChange={handleChange} variant="scrollable" pill="true">
            <Tab
              label={
                <div className="flex items-center gap-1.5">
                  <i className="tabler-users text-lg" />
                  Account
                </div>
              }
              value="account"
              disabled={!hasSubscription}
              sx={{
                opacity: !hasSubscription ? 0.5 : 1,
                cursor: !hasSubscription ? "not-allowed" : "pointer",
                "&.Mui-disabled": {
                  color: "text.disabled",
                },
              }}
            />
            <Tab
              label={
                <div className="flex items-center gap-1.5">
                  <i className="tabler-bookmark text-lg" />
                  Billing & Plans
                </div>
              }
              value="billing-plans"
              // Billing tab is always enabled
            />
            <Tab
              label={
                <div className="flex items-center gap-1.5">
                  <i className="tabler-bell text-lg" />
                  Notifications
                </div>
              }
              value="notifications"
              disabled={!hasSubscription}
              sx={{
                opacity: !hasSubscription ? 0.5 : 1,
                cursor: !hasSubscription ? "not-allowed" : "pointer",
                "&.Mui-disabled": {
                  color: "text.disabled",
                },
              }}
            />
            <Tab
              label={
                <div className="flex items-center gap-1.5">
                  <i className="tabler-link text-lg" />
                  Platforms
                </div>
              }
              value="connections"
              disabled={!hasSubscription}
              sx={{
                opacity: !hasSubscription ? 0.5 : 1,
                cursor: !hasSubscription ? "not-allowed" : "pointer",
                "&.Mui-disabled": {
                  color: "text.disabled",
                },
              }}
            />
            <Tab
              label={
                <div className="flex items-center gap-1.5">
                  <i className="tabler-calendar text-lg" />
                  Postal Codes
                </div>
              }
              value="postalcodes"
              disabled={!hasSubscription}
              sx={{
                opacity: !hasSubscription ? 0.5 : 1,
                cursor: !hasSubscription ? "not-allowed" : "pointer",
                "&.Mui-disabled": {
                  color: "text.disabled",
                },
              }}
            />
          </CustomTabList>

          {/* Optional: Show subscription notice */}
          {!hasSubscription && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 text-orange-700">
                <i className="tabler-info-circle text-lg" />
                <span className="text-sm font-medium">Upgrade your subscription to access all account settings</span>
              </div>
            </div>
          )}
        </Grid>
        <Grid item xs={12}>
          <TabPanel value={activeTab} className="p-0">
            {tabContentList[activeTab]}
          </TabPanel>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default AccountSettings
