"use client"

import type React from "react"

// React Imports
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

// MUI Imports
import Grid from "@mui/material/Grid"
import Dialog from "@mui/material/Dialog"
import Button from "@mui/material/Button"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import MenuItem from "@mui/material/MenuItem"

// Component Imports
import DialogCloseButton from "../DialogCloseButton"
import CustomTextField from "@core/components/mui/TextField"
import type { MenuDataType } from "@/api/interface/menuIterface"
import { createMenu } from "@/api/menu"
import toast, { Toaster } from "react-hot-toast"
import { getAllResturants } from "@/api/resturant"
import { getAllBusiness } from "@/api/business"
import type { BusinessType } from "@/types/apps/businessTypes"
import type { ToppingDataType } from "@/api/interface/toppingInterface"
import { getAllFoodTypesOfSpecificBusiness } from "@/api/foodTypes"
import OpenDialogOnElementClick from "../OpenDialogOnElementClick"
import type { ButtonProps } from "@mui/material/Button"
import type { ThemeColor } from "@core/types"
import Loader from "@/components/loader/Loader"
import AddType from "@/components/dialogs/add-type"

type AddtMenuFormProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: MenuDataType
  onTypeAdded?: any
}

const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps["variant"]): ButtonProps => ({
  children,
  color,
  variant,
})

const AddtMenuForm = ({ open, setOpen, data, onTypeAdded }: AddtMenuFormProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [restosData, setRestosData] = useState<BusinessType[]>([])
  const [userBusinessData, setUserBusinessData] = useState<BusinessType[]>([])
  const [FoodTypeData, setFoodTypeData] = useState<ToppingDataType[]>([])
  const [addType, setAddType] = useState<boolean>(false)
  const [selectedBrand, setSelectedBrand] = useState<string>("")
  const [businessId, setBusinessId] = useState<string>("")
  const [category, setCategory] = useState<string>("")

  // Validation helper functions
  const handleNumericInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, decimal point
    if (
      [46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault()
    }
  }

  const handleAlphanumericInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter
    if (
      [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return
    }
    // Allow: letters, numbers, space, underscore, hyphen
    if (
      !(
        (e.keyCode >= 65 && e.keyCode <= 90) || // A-Z
        (e.keyCode >= 97 && e.keyCode <= 122) || // a-z
        (e.keyCode >= 48 && e.keyCode <= 57) || // 0-9
        (e.keyCode >= 96 && e.keyCode <= 105) || // numpad 0-9
        e.keyCode === 32 || // space
        e.keyCode === 95 || // underscore
        e.keyCode === 189
      )
    ) {
      // hyphen
      e.preventDefault()
    }
  }

  const handleRestaurantChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedRestaurant = restosData?.find((rest) => rest.id === event.target.value)
    setSelectedBrand(selectedRestaurant?.name || "")
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<MenuDataType>()

  const fetchFoodTypes = async () => {
    try {
      const response = await getAllFoodTypesOfSpecificBusiness(businessId)
      setFoodTypeData(response?.data)
    } catch (error: any) {
      // Handle error
    }
  }

  useEffect(() => {
    if (businessId) {
      fetchFoodTypes()
    }
  }, [addType, businessId])

  const handleBusinessChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedBusiness = userBusinessData.find((b) => b.id === event.target.value)
    if (selectedBusiness) {
      setBusinessId(selectedBusiness.business_id)
    } else {
      setBusinessId("")
    }
  }

  const onSubmit = (data: MenuDataType, e: any) => {
    e.preventDefault()
    setLoading(true)
    setAddType(false)

    const payload = {
      ...data,
      title: data.title,
      description: data.description,
      availability: "in stock",
      condition: "good",
      business: data.business,
      image_link: data.image_link,
      link: data.link,
      price: data.price,
      sku: data.sku,
      type: data.type,
    }

    createMenu(payload)
      .then((res) => {
        toast.success("Catalogue created successfully", {
          duration: 5000,
        })
        if (onTypeAdded) {
          onTypeAdded()
        }
        setAddType(true)
        reset()
        setOpen(false)
      })
      .catch((error) => {
        console.log(error)
        if (error?.data && error?.data?.availability[0]) {
          toast.error(error?.data?.availability[0], {
            duration: 5000,
          })
        } else {
          toast.error("Error in creating Catalogue", {
            duration: 5000,
          })
        }
      })
      .finally(() => {
        setLoading(false)
        reset()
      })
  }

  const handleReset = () => {
    setOpen(false)
    reset()
    setBusinessId("")
  }

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await getAllBusiness()
        setUserBusinessData(response?.data?.results || [])
      } catch (err: any) {
        // Handle error
      }
    }
    fetchBusiness()
  }, [])

  useEffect(() => {
    const fetchResturants = async () => {
      try {
        const response = await getAllResturants()
        setRestosData(response?.data?.results || [])
      } catch (err: any) {
        // Handle error
      }
    }
    fetchResturants()
  }, [])

  const handleTypeAdded = () => {
    fetchFoodTypes()
  }

  return (
    <Dialog fullWidth open={open} maxWidth="md" scroll="body" sx={{ "& .MuiDialog-paper": { overflow: "visible" } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className="tabler-x" />
      </DialogCloseButton>
      <DialogTitle variant="h4" className="flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16">
        Add Catalogue Information
      </DialogTitle>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className="overflow-visible pbs-0 sm:pli-16">
            <Grid container spacing={5} alignItems="center">
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label="Title *"
                  fullWidth
                  placeholder="Enter Title"
                  onKeyDown={handleAlphanumericInput}
                  {...register("title", {
                    required: "Title is required",
                    pattern: {
                      value: /^[a-zA-Z0-9\s_-]+$/,
                      message: "Only letters, numbers, spaces, underscores, and hyphens are allowed",
                    },
                  })}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label="SKU *"
                  fullWidth
                  placeholder="Enter SKU"
                  onKeyDown={handleAlphanumericInput}
                  {...register("sku", {
                    required: "SKU is required",
                    pattern: {
                      value: /^[a-zA-Z0-9_-]+$/,
                      message: "Only letters, numbers, underscores, and hyphens are allowed",
                    },
                  })}
                  error={!!errors.sku}
                  helperText={errors.sku?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  select
                  fullWidth
                  id="business"
                  label="Select Business *"
                  {...register("business", { required: "Business ID is required" })}
                  error={!!errors.business}
                  helperText={errors.business?.message}
                  onChange={handleBusinessChange}
                >
                  {userBusinessData &&
                    userBusinessData?.map((business) => (
                      <MenuItem key={business.id} value={business.id}>
                        {business.business_id}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label="Price *"
                  fullWidth
                  placeholder="Enter price (numbers only)"
                  onKeyDown={handleNumericInput}
                  {...register("price", {
                    required: "Price is required",
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: "Please enter a valid price (numbers only, up to 2 decimal places)",
                    },
                    validate: {
                      positive: (value) => Number.parseFloat(String(value)) > 0 || "Price must be greater than 0",
                    },
                  })}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label="Description *"
                  fullWidth
                  placeholder="Enter Description"
                  onKeyDown={handleAlphanumericInput}
                  {...register("description", {
                    required: "Description is required",
                    pattern: {
                      value: /^[a-zA-Z0-9\s.,!?_-]+$/,
                      message: "Only letters, numbers, spaces, and basic punctuation are allowed",
                    },
                  })}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label="Product Link *"
                  fullWidth
                  placeholder="Enter Product Link"
                  {...register("link", {
                    required: "Product Link is required",
                    pattern: {
                      value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                      message: "Please enter a valid URL",
                    },
                  })}
                  error={!!errors.link}
                  helperText={errors.link?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label="Image Link *"
                  fullWidth
                  placeholder="Enter Image Link"
                  {...register("image_link", {
                    required: "Image Link is required",
                    pattern: {
                      value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                      message: "Please enter a valid URL",
                    },
                  })}
                  error={!!errors.image_link}
                  helperText={errors.image_link?.message}
                />
              </Grid>
              {businessId && (
                <>
                  <Grid item xs={12} sm={6}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <CustomTextField
                        select
                        fullWidth
                        label="Select Type *"
                        {...register("type", {
                          required: "Type is required",
                        })}
                        error={!!errors.type}
                        helperText={errors.type?.message}
                        style={{ flex: 1 }}
                      >
                        {FoodTypeData.length > 0 ? (
                          FoodTypeData.map((food) => (
                            <MenuItem key={food.id} value={food.id}>
                              {food.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled value="">
                            No type available
                          </MenuItem>
                        )}
                      </CustomTextField>
                      <div style={{ marginLeft: "10px", marginTop: errors.type ? "0px" : "17px", flex: "0 0 10%" }}>
                        <OpenDialogOnElementClick
                          element={Button}
                          elementProps={buttonProps("Add", "primary", "contained")}
                          dialog={AddType}
                          dialogProps={{}}
                          onTypeAdded={handleTypeAdded}
                        />
                      </div>
                    </div>
                  </Grid>
                </>
              )}
            </Grid>
            <DialogActions className="justify-center pbs-0 sm:pbe-16 sm:pli-16 mt-5">
              <Button variant="contained" type="submit" disabled={loading}>
                Submit
              </Button>
              <Button variant="tonal" color="error" type="reset" onClick={() => handleReset()}>
                Cancel
              </Button>
            </DialogActions>
            {loading && <Loader />}
          </DialogContent>
        </form>
        <Toaster />
      </div>
    </Dialog>
  )
}

export default AddtMenuForm
