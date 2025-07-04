"use client"

import type React from "react"
// React Imports
import { useState } from "react"
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
// API Import - ADD THIS LINE
import { createStore } from "@/api/shopify" // Adjust the path to match your project structure

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  onTypeAdded?: () => void
}

const AddShopifyForm = ({ open, setOpen, onTypeAdded }: Props) => {
  const [formData, setFormData] = useState({
    admin_access_token: "",
    shopify_domain_url: "",
    shopify_version: "",
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // REPLACE THE MOCK API CALL WITH YOUR ACTUAL API
      console.log("Submitting form data:", formData)

      const response = await createStore(formData)

      console.log("API Response:", response)
      toast.success("Shopify account added successfully")
      setOpen(false)
      onTypeAdded?.()

      // Reset form data
      setFormData({
        admin_access_token: "",
        shopify_domain_url: "",
        shopify_version: "",
      })
    } catch (error: any) {
      console.error("Error creating store:", error)

      // Handle different error types
      let errorMessage = "Error adding Shopify account"

      if (error?.data?.message) {
        errorMessage = error.data.message
      } else if (error?.message) {
        errorMessage = error.message
      } else if (typeof error === "string") {
        errorMessage = error
      }

      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setFormData({
      admin_access_token: "",
      shopify_domain_url: "",
      shopify_version: "",
    })
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Shopify Account</DialogTitle>
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
            {loading ? "Adding..." : "Add Account"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddShopifyForm
