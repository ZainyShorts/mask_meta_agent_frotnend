// 'use client'

// // React Imports
// import { useEffect, useState } from 'react'
// import { useForm } from 'react-hook-form'

// // MUI Imports
// import Grid from '@mui/material/Grid'
// import Dialog from '@mui/material/Dialog'
// import Button from '@mui/material/Button'
// import DialogTitle from '@mui/material/DialogTitle'
// import DialogContent from '@mui/material/DialogContent'
// import DialogActions from '@mui/material/DialogActions'
// import Typography from '@mui/material/Typography'
// // Component Imports
// import DialogCloseButton from '../DialogCloseButton'
// import CustomTextField from '@core/components/mui/TextField'
// import { toast, Toaster } from 'react-hot-toast'
// import { useParams, useRouter } from 'next/navigation'
// import { BusinessEditPayload, BusinessType } from '@/types/apps/businessTypes'
// import { getAllBusiness, updateBusiness } from '@/api/business'

// import { useAuthStore } from '@/store/authStore'
// import ConfirmationDialog from '@/components/ConfirmationDialog'
// import { CurrencyDataType } from '@/api/interface/currencyInterface'
// import { getAllCurrencies } from '@/api/currencies'
// import { MenuItem } from '@mui/material'

// type EditBusinessInfoProps = {
//   open: boolean
//   setOpen: (open: boolean) => void
//   data?: BusinessEditPayload
//   onTypeAdded?: any
// }

// const EditBusinessInfo = ({ open, setOpen, data, onTypeAdded }: EditBusinessInfoProps) => {
//   const router = useRouter()

//   const { lang: locale } = useParams()
//   const [loading, setLoading] = useState<boolean>(false)
//   const {
//     register,
//     handleSubmit,
//     formState: { errors }
//   } = useForm<BusinessEditPayload>()

//   console.log(data)

//   const [userBusinessData, setUserBusinessData] = useState<BusinessType[]>([])
//   const [currencyData, setCurrencyData] = useState<CurrencyDataType[]>([])

//   const { businessAction } = useAuthStore()
//   const [openConfirmation, setOpenConfirmation] = useState(false)

//   const [payloadData, setPayloadData] = useState<BusinessEditPayload | null>(null)

//   const handleConfirm = async () => {
//     if (!payloadData) return

//     const submittedpayload = {
//       business_address: payloadData?.business_address,
//       business_contact: payloadData?.business_contact,
//       business_desc: payloadData?.business_desc,
//       business_id: payloadData?.business_id,
//       contact_number: payloadData?.contact_number,
//       business_initial: payloadData?.business_initial,
//       id: payloadData?.id,
//       name: payloadData?.name
//       // currency: payloadData?.currency
//     }
//     try {
//       setLoading(true)

//       await updateBusiness(payloadData.id, submittedpayload)
//       toast.success('Business Updated Successfully', {
//         duration: 5000 // Duration in milliseconds (5 seconds)
//       })
//       setOpen(false)
//       if (onTypeAdded) onTypeAdded()
//     } catch (error: any) {
//       console.log(error?.data, 'error-------->')
//       if (error?.data?.user) {
//         toast.error(error?.data?.user[0], {
//           duration: 5000 // Duration in milliseconds (5 seconds)
//         })
//       } else if (error?.data?.business_doc) {
//         toast.error(error?.data?.business_doc[0], {
//           duration: 5000 // Duration in milliseconds (5 seconds)
//         })
//       } else {
//         toast.error(error?.data?.message || 'Error Updating Business', {
//           duration: 5000 // Duration in milliseconds (5 seconds)
//         })
//       }
//     } finally {
//       setLoading(false)
//       setOpen(false)
//     }
//   }

//   const onSubmit = (formData: BusinessEditPayload, e: any) => {
//     e.preventDefault()
//     setPayloadData({ ...formData, id: data?.id ?? 0 })
//     setOpenConfirmation(true)
//   }

//   useEffect(() => {
//     const fetchBusiness = async () => {
//       try {
//         const response = await getAllBusiness()
//         const currencyResponce = await getAllCurrencies()
//         setCurrencyData(currencyResponce?.data?.results || [])
//         setUserBusinessData(response?.data?.results || [])
//         businessAction(response.data.results)
//       } catch (err: any) {
//         // setError(err.message || 'Failed to fetch business')
//       } finally {
//         // setLoading(false)
//       }
//     }

//     fetchBusiness()
//   }, [])

//   const handleClose = () => {
//     setOpen(false)
//   }

//   return (
//     <Dialog fullWidth open={open} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
//       <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
//         <i className='tabler-x' />
//       </DialogCloseButton>
//       <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
//         Edit Business Information
//         <Typography component='span' className='flex flex-col text-center'>
//           Updating Business details will receive a privacy audit.
//         </Typography>
//       </DialogTitle>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
//           <Grid container spacing={5}>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 label='Business Name *'
//                 fullWidth
//                 placeholder='Enter Business Name'
//                 defaultValue={data?.name || ''}
//                 {...register('name', { required: 'Business Name is required' })}
//                 error={!!errors.name}
//                 helperText={errors.name?.message}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 fullWidth
//                 label='Select Business Meta Id'
//                 defaultValue={data?.business_id || ''}
//                 inputProps={{ placeholder: 'Business', ...register('business_id') }}
//                 error={!!errors.business_id}
//                 helperText={errors.business_id?.message}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <CustomTextField
//                 fullWidth
//                 label='Business Description'
//                 {...register('business_desc', { required: 'Business Description is required' })}
//                 defaultValue={data?.business_desc || ''}
//                 {...register('business_desc', {
//                   required: 'Business Description is required'
//                 })}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 fullWidth
//                 label='Business Address'
//                 {...register('business_address', { required: 'Business Address is required' })}
//                 defaultValue={data?.business_address || ''}
//                 {...register('business_address', {
//                   required: 'Business Address is required'
//                 })}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 fullWidth
//                 label='Business Initial'
//                 defaultValue={data?.business_initial || ''}
//                 {...register('business_initial', {
//                   required: 'Business initial is required',
//                   pattern: {
//                     value: /^[A-Z]{1,5}$/,
//                     message: 'Only up to 5 capital letters are allowed'
//                   }
//                 })}
//                 error={!!errors.business_initial}
//                 helperText={errors.business_initial?.message}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 // select
//                 fullWidth
//                 id='currency'
//                 label='Select Currency *'
//                 // defaultValue={data?.currency?.id || ''}
//                 defaultValue={data?.currency?.code || ''}
//                 inputProps={{
//                   placeholder: 'Currency',
//                   readOnly: true // Set the field as read-only
//                   // ...register('business_doc')
//                 }}
//                 // inputProps={{ placeholder: 'Currency', ...register('currency') }}

//                 error={!!errors.currency}
//                 helperText={errors.currency?.message}
//               >
//                 {currencyData &&
//                   currencyData.map((item: any) => (
//                     <MenuItem key={item?.id} value={item?.id}>
//                       {item?.label}
//                     </MenuItem>
//                   ))}
//               </CustomTextField>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 fullWidth
//                 label='Business Contact'
//                 defaultValue={data?.contact_number || ''}
//                 {...register('contact_number', {
//                   required: 'Business Contact is required'
//                 })}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 fullWidth
//                 id='business'
//                 label='Select Business Document File'
//                 defaultValue={data?.business_doc || ''}
//                 inputProps={{
//                   placeholder: 'business_doc',
//                   readOnly: true // Set the field as read-only
//                   // ...register('business_doc')
//                 }}
//                 // error={!!errors.business_doc}
//                 // helperText={errors.business_doc?.message}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 fullWidth
//                 id='logo'
//                 label='Select Business Logo'
//                 defaultValue={data?.logo || ''}
//                 inputProps={{
//                   placeholder: 'Business Logo',
//                   readOnly: true // Set the field as read-only
//                   // ...register('business_doc')
//                 }}
//                 // error={!!errors.business_doc}
//                 // helperText={errors.business_doc?.message}
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
//           <Button variant='contained' type='submit' onClick={() => setOpenConfirmation(true)}>
//             Submit
//           </Button>
//           <Button variant='tonal' color='secondary' type='reset' onClick={handleClose}>
//             Cancel
//           </Button>
//         </DialogActions>
//         <ConfirmationDialog
//           openConfirmation={openConfirmation}
//           onClose={() => setOpenConfirmation(false)}
//           onConfirm={handleConfirm}
//           title='Edit Business'
//           description='Are you sure you want to edit this business?'
//         />
//       </form>
//     </Dialog>
//   )
// }

// export default EditBusinessInfo


"use client"

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
import Typography from "@mui/material/Typography"
// Component Imports
import DialogCloseButton from "../DialogCloseButton"
import CustomTextField from "@core/components/mui/TextField"
import { toast } from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import type { BusinessEditPayload, BusinessType } from "@/types/apps/businessTypes"
import { getAllBusiness, updateBusiness } from "@/api/business"

import { useAuthStore } from "@/store/authStore"
import ConfirmationDialog from "@/components/ConfirmationDialog"
import type { CurrencyDataType } from "@/api/interface/currencyInterface"
import { MenuItem } from "@mui/material"
import { ENDPOINTS, getBaseUrl } from "@/api/vars/vars"

type EditBusinessInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: BusinessEditPayload
  onTypeAdded?: any
}

const EditBusinessInfo = ({ open, setOpen, data, onTypeAdded }: EditBusinessInfoProps) => {
  const router = useRouter()

  const { lang: locale } = useParams()
  const [loading, setLoading] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessEditPayload>()

  console.log(data)

  const [userBusinessData, setUserBusinessData] = useState<BusinessType[]>([])
  const [currencyData, setCurrencyData] = useState<CurrencyDataType[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState<any>(null)

  const { businessAction } = useAuthStore()
  const [openConfirmation, setOpenConfirmation] = useState(false)

  const [payloadData, setPayloadData] = useState<BusinessEditPayload | null>(null)

  const handleConfirm = async () => {
    if (!payloadData) return

    const submittedpayload = {
      business_address: payloadData?.business_address,
      business_contact: payloadData?.business_contact,
      business_desc: payloadData?.business_desc,
      business_id: payloadData?.business_id,
      contact_number: payloadData?.contact_number,
      business_initial: payloadData?.business_initial,
      id: payloadData?.id,
      name: payloadData?.name,
      currency: selectedCurrency?.id, // Add this line
    }
    try {
      setLoading(true)

      await updateBusiness(payloadData.id, submittedpayload)
      toast.success("Business Updated Successfully", {
        duration: 5000, // Duration in milliseconds (5 seconds)
      })
      setOpen(false)
      if (onTypeAdded) onTypeAdded()
    } catch (error: any) {
      console.log(error?.data, "error-------->")
      if (error?.data?.user) {
        toast.error(error?.data?.user[0], {
          duration: 5000, // Duration in milliseconds (5 seconds)
        })
      } else if (error?.data?.business_doc) {
        toast.error(error?.data?.business_doc[0], {
          duration: 5000, // Duration in milliseconds (5 seconds)
        })
      } else {
        toast.error(error?.data?.message || "Error Updating Business", {
          duration: 5000, // Duration in milliseconds (5 seconds)
        })
      }
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  const onSubmit = (formData: BusinessEditPayload, e: any) => {
    e.preventDefault()
    setPayloadData({
      ...formData,
      id: data?.id ?? 0,
      currency: selectedCurrency?.id,
    })
    setOpenConfirmation(true)
  }

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await getAllBusiness()

        // Fetch currencies from your API endpoint
        const authToken = localStorage.getItem("auth_token")
        const currencyResponse = await fetch(`${getBaseUrl()}whatseat/${ENDPOINTS.currencies}/`, {
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
          },
        })

        if (currencyResponse.ok) {
          const currencyData = await currencyResponse.json()
          setCurrencyData(currencyData?.data || [])
        }

        setUserBusinessData(response?.data?.results || [])
        businessAction(response.data.results)
      } catch (err: any) {
        console.error("Error fetching data:", err)
      }
    }

    fetchBusiness()
  }, [])

  useEffect(() => {
    if (data?.currency && currencyData.length > 0) {
      const currentCurrency = currencyData.find(
        (curr: any) => curr.id === data?.currency?.id || curr.code === data?.currency?.code,
      )
      setSelectedCurrency(currentCurrency || null)
    }
  }, [data?.currency, currencyData])

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog fullWidth open={open} maxWidth="md" scroll="body" sx={{ "& .MuiDialog-paper": { overflow: "visible" } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className="tabler-x" />
      </DialogCloseButton>
      <DialogTitle variant="h4" className="flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16">
        Edit Business Information
        <Typography component="span" className="flex flex-col text-center">
          Updating Business details will receive a privacy audit.
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="overflow-visible pbs-0 sm:pli-16">
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Business Name *"
                fullWidth
                placeholder="Enter Business Name"
                defaultValue={data?.name || ""}
                {...register("name", { required: "Business Name is required" })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Select Business Meta Id"
                defaultValue={data?.business_id || ""}
                inputProps={{ placeholder: "Business", ...register("business_id") }}
                error={!!errors.business_id}
                helperText={errors.business_id?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label="Business Description"
                {...register("business_desc", { required: "Business Description is required" })}
                defaultValue={data?.business_desc || ""}
                {...register("business_desc", {
                  required: "Business Description is required",
                })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Business Address"
                {...register("business_address", { required: "Business Address is required" })}
                defaultValue={data?.business_address || ""}
                {...register("business_address", {
                  required: "Business Address is required",
                })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Business Initial"
                defaultValue={data?.business_initial || ""}
                {...register("business_initial", {
                  required: "Business initial is required",
                  pattern: {
                    value: /^[A-Z]{1,5}$/,
                    message: "Only up to 5 capital letters are allowed",
                  },
                })}
                error={!!errors.business_initial}
                helperText={errors.business_initial?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                id="currency"
                label="Select Currency *"
                value={selectedCurrency?.id || ""}
                {...register("currency", { required: "Currency is required" })}
                onChange={(e) => {
                  const selected = currencyData.find((curr: any) => curr.id === Number.parseInt(e.target.value))
                  setSelectedCurrency(selected)
                }}
                error={!!errors.currency}
                helperText={errors.currency?.message}
              >
                {currencyData &&
                  currencyData.map((item: any) => (
                    <MenuItem key={item?.id} value={item?.id}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: "bold", minWidth: "24px" }}>{item?.symbol}</span>
                        <span>{item?.code}</span>
                        <span style={{ color: "#666" }}>- {item?.label}</span>
                      </div>
                    </MenuItem>
                  ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Business Contact"
                defaultValue={data?.contact_number || ""}
                {...register("contact_number", {
                  required: "Business Contact is required",
                })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                id="business"
                label="Select Business Document File"
                defaultValue={data?.business_doc || ""}
                inputProps={{
                  placeholder: "business_doc",
                  readOnly: true, // Set the field as read-only
                  // ...register('business_doc')
                }}
                // error={!!errors.business_doc}
                // helperText={errors.business_doc?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                id="logo"
                label="Select Business Logo"
                defaultValue={data?.logo || ""}
                inputProps={{
                  placeholder: "Business Logo",
                  readOnly: true, // Set the field as read-only
                  // ...register('business_doc')
                }}
                // error={!!errors.business_doc}
                // helperText={errors.business_doc?.message}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className="justify-center pbs-0 sm:pbe-16 sm:pli-16">
          <Button variant="contained" type="submit" onClick={() => setOpenConfirmation(true)}>
            Submit
          </Button>
          <Button variant="tonal" color="secondary" type="reset" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
        <ConfirmationDialog
          openConfirmation={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
          onConfirm={handleConfirm}
          title="Edit Business"
          description="Are you sure you want to edit this business?"
        />
      </form>
    </Dialog>
  )
}

export default EditBusinessInfo
