"use client"

import type React from "react"
// React Imports
import { useState, useEffect } from "react"
// MUI Imports
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import MenuItem from "@mui/material/MenuItem"
// Component Imports
import CustomTextField from "@core/components/mui/TextField"
// Third-party Imports
import toast from "react-hot-toast"
// API Imports
import { updateStore } from "@/api/shopify" // Adjust path as needed

interface ShopifyAccount {
  id: number
  user: number
  admin_access_token: string
  shopify_domain_url: string
  shopify_version: string
  created_at: string
  updated_at: string
}

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: ShopifyAccount
  onTypeAdded?: () => void
}

const EditShopifyInfo = ({ open, setOpen, data, onTypeAdded }: Props) => {
  const [formData, setFormData] = useState({
    admin_access_token: "",
    shopify_domain_url: "",
    shopify_version: "",
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (data && open) {
      setFormData({
        admin_access_token: data.admin_access_token,
        shopify_domain_url: data.shopify_domain_url,
        shopify_version: data.shopify_version,
      })
    }
  }, [data, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!data?.id) {
      toast.error("No account ID found")
      return
    }

    setLoading(true)

    try {
      // Call your actual API function
      const response = await updateStore(data.id, formData)

      console.log("Store updated successfully:", response)
      toast.success("Shopify account updated successfully")
      setOpen(false)
      onTypeAdded?.()
    } catch (error: any) {
      console.error("Error updating store:", error)

      // Handle different types of errors
      if (error?.data?.message) {
        toast.error(error.data.message)
      } else if (error?.message) {
        toast.error(error.message)
      } else {
        toast.error("Error updating Shopify account")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Shopify Account</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label="Admin Access Token"
                type="password"
                value={formData.admin_access_token}
                onChange={(e) => setFormData((prev) => ({ ...prev, admin_access_token: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label="Shopify Domain URL"
                type="url"
                placeholder="https://yourstore.myshopify.com"
                value={formData.shopify_domain_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, shopify_domain_url: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                select
                fullWidth
                label="Shopify Version"
                value={formData.shopify_version}
                onChange={(e) => setFormData((prev) => ({ ...prev, shopify_version: e.target.value }))}
                required
              >
                <MenuItem value="2024-01">2024-01</MenuItem>
                <MenuItem value="2023-10">2023-10</MenuItem>
                <MenuItem value="2023-07">2023-07</MenuItem>
                <MenuItem value="2023-04">2023-04</MenuItem>
              </CustomTextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Updating..." : "Update Account"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditShopifyInfo
