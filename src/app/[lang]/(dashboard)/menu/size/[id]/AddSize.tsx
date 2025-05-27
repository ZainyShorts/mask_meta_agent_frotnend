// // MUI Imports
// 'use client'
// import Card from '@mui/material/Card'
// import Button from '@mui/material/Button'
// import Grid from '@mui/material/Grid'
// import { useEffect, useState } from 'react'
// import toast, { Toaster } from 'react-hot-toast'
// import CustomTextField from '@core/components/mui/TextField'
// import { useForm } from 'react-hook-form'
// import MenuItem from '@mui/material/MenuItem'
// import Loader from '@/components/loader/Loader'
// import { createSize, getBusinessMenuesById } from '@/api/size'
// import { BusinessMenusDataType, SizeDataTypeWithoutId } from '@/api/interface/sizeInterface'

// type PreviewToppingsProps = {
//   id: string
//   isCreated: boolean
//   onCreateSize: (isCreated: boolean) => void
// }

// const AddSize = ({ id, isCreated, onCreateSize }: PreviewToppingsProps) => {
//   const [BusinessMenuesData, setBusinessMenuesData] = useState<BusinessMenusDataType[]>([])

//   const [loading, setLoading] = useState<boolean>(false)
//   const [addSizeFlag, setAddSizeFlag] = useState<boolean>(false)
//   const [selectedBusinessMenu, setSelectedBusinessMenu] = useState<boolean>(false)

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     setValue,
//     watch
//   } = useForm<SizeDataTypeWithoutId>()

//   const validateBusinessId = (value: number) => {
//     const selectedItem = BusinessMenuesData.find(item => item.id === value)
//     if (selectedItem) {
//       setSelectedBusinessMenu(true)
//     } else {
//       setSelectedBusinessMenu(false)
//     }

//     return selectedItem?.business ? true : 'Business ID is required'
//   }

//   const onSubmit = (data: SizeDataTypeWithoutId, e: any) => {
//     e.preventDefault()

//     onCreateSize(false)
//     setAddSizeFlag(false)

//     if (selectedBusinessMenu === null) {
//       toast.error('Please select a business catalouge')
//       return
//     }
//     if (!data?.business) {
//       toast.error('Please select a business catalouge to proceed')
//       return
//     }
//     if (!data?.type) {
//       toast.error('Please select a business to proceed')
//       return
//     }

//     const payload = {
//       name: data?.name,
//       additional_price: data?.additional_price,
//       description: data?.description,
//       business: data?.business,
//       menu: data?.menu,
//       type: data?.type
//     }

//     setLoading(true)
//     createSize(payload)
//       .then(res => {
//         toast.success('Size saved successfully')
//         onCreateSize(true)
//         setAddSizeFlag(true)
//         reset()
//         setValue('menu', 0, { shouldValidate: true }) // Explicitly reset menu to 0
//         setValue('business', 0, { shouldValidate: true }) // Also reset business
//         setValue('type', 0, { shouldValidate: true }) // Also reset type
//         setSelectedBusinessMenu(false) // Reset the business menu selection state
//       })
//       .catch(error => {
//         console.log(error?.data, 'Size create error')
//         if (error?.data && error?.data?.non_field_errors?.[0]) {
//           toast.error(error?.data?.non_field_errors[0])
//         } else if (error?.data && error?.data?.additional_price?.[0]) {
//           toast.error(error?.data?.additional_price[0])
//         } else if (error?.data && error?.data?.business?.[0]) {
//           toast.error(error?.data?.business[0])
//         } else {
//           toast.error('Error in creating Size')
//         }
//       })
//       .finally(() => {
//         setLoading(false)
//       })
//   }

//   useEffect(() => {
//     const fetchBusinessMenus = async () => {
//       try {
//         const response = await getBusinessMenuesById(Number(id))
//         setBusinessMenuesData(response?.data?.data)
//       } catch (error: any) {
//         // Handle error
//         console.log(error, 'Business catalouges error')
//       }
//     }
//     fetchBusinessMenus()
//   }, [id])

//   return (
//     <>
//       <Card>
//         <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 p-6'>
//           <Grid container spacing={5} alignItems='center'>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 label='Name *'
//                 fullWidth
//                 placeholder='Enter  Name'
//                 {...register('name', { required: 'Name is required' })}
//                 error={!!errors.name}
//                 helperText={errors.name?.message}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 label='Description *'
//                 fullWidth
//                 placeholder='Enter Description'
//                 {...register('description', { required: 'Description is required' })}
//                 error={!!errors.description}
//                 helperText={errors.description?.message}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 label='Price *'
//                 fullWidth
//                 type='number'
//                 placeholder='Enter Price'
//                 inputProps={{ step: 'any', min: '0.1' }} // Allows precise decimal values
//                 {...register('additional_price', {
//                   required: 'Additional Price is required',
//                   pattern: {
//                     value: /^(0\.\d*[1-9]\d*|[1-9]\d*(\.\d+)?|\d)$/, // Accepts positive integers & decimals, prevents leading zeros
//                     message: 'Only positive integers or decimal values are allowed'
//                   },
//                   min: {
//                     value: 0.1, // Ensures greater than 0
//                     message: 'Value must be at least 0.1'
//                   }
//                 })}
//                 error={!!errors.additional_price}
//                 helperText={errors.additional_price?.message}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 select
//                 fullWidth
//                 label='Catalouge*'
//                 value={watch('menu') || 0} // Add this line to control the displayed value
//                 {...register('menu', {
//                   required: 'Business Catalouge is required',
//                   validate: validateBusinessId,
//                   onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
//                     const selectedId = Number(e.target.value)
//                     const selectedItem = BusinessMenuesData.find(item => item.id === selectedId)
//                     if (selectedItem) {
//                       setValue('business', Number(selectedItem.business), { shouldValidate: true })
//                       setValue('type', selectedItem?.type?.id, { shouldValidate: true })
//                     }
//                   }
//                 })}
//                 error={!!errors.menu}
//                 helperText={errors.menu?.message}
//               >
//                 <MenuItem key='Select menu' value={0}>
//                   Select catalouge
//                 </MenuItem>
//                 {BusinessMenuesData &&
//                   BusinessMenuesData?.map(bMenu => (
//                     <MenuItem key={bMenu.id} value={bMenu.id}>
//                       {bMenu.title}
//                     </MenuItem>
//                   ))}
//               </CustomTextField>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 select
//                 fullWidth
//                 label='Size*'
//                 value={watch('menu') || 0} // Add this line to control the displayed value
//                 {...register('menu', {
//                   required: 'Size is required',
//                   validate: validateBusinessId,
//                   onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
//                     const selectedId = Number(e.target.value)
//                     const selectedItem = BusinessMenuesData.find(item => item.id === selectedId)
//                     if (selectedItem) {
//                       setValue('business', Number(selectedItem.business), { shouldValidate: true })
//                       setValue('type', selectedItem?.type?.id, { shouldValidate: true })
//                     }
//                   }
//                 })}
//                 error={!!errors.menu}
//                 helperText={errors.menu?.size}
//               >
//                 <MenuItem key='Select menu' value={0}>
//                   Select Size
//                 </MenuItem>
//                     <MenuItem value={'Small'}>
//                       Small (S)
//                     </MenuItem>
//                     <MenuItem value={'Medium'}>
//                       Medium (M)
//                     </MenuItem>
//                     <MenuItem value={'Large'}>
//                       Large (L)
//                     </MenuItem>
                    
//               </CustomTextField>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <div className='flex items-center gap-4' style={{ marginTop: errors.description ? '0px' : '15px' }}>
//                 <Button variant='contained' type='submit' disabled={loading}>
//                   Save Size
//                 </Button>
//               </div>
//               {loading && <Loader />}
//             </Grid>
//           </Grid>
//         </form>
//         <Toaster />
//       </Card>
//     </>
//   )
// }

// export default AddSize

// MUI Imports
// "use client"
// import Card from "@mui/material/Card"
// import type React from "react"

// import Button from "@mui/material/Button"
// import Grid from "@mui/material/Grid"
// import { useEffect, useState } from "react"
// import toast, { Toaster } from "react-hot-toast"
// import CustomTextField from "@core/components/mui/TextField"
// import { useForm } from "react-hook-form"
// import MenuItem from "@mui/material/MenuItem"
// import Loader from "@/components/loader/Loader"
// import { createSize, getBusinessMenuesById } from "@/api/size"
// import type { BusinessMenusDataType, SizeDataTypeWithoutId } from "@/api/interface/sizeInterface"

// type PreviewToppingsProps = {
//   id: string
//   isCreated: boolean
//   onCreateSize: (isCreated: boolean) => void
// }

// const AddSize = ({ id, isCreated, onCreateSize }: PreviewToppingsProps) => {
//   const [BusinessMenuesData, setBusinessMenuesData] = useState<BusinessMenusDataType[]>([])

//   const [loading, setLoading] = useState<boolean>(false)
//   const [addSizeFlag, setAddSizeFlag] = useState<boolean>(false)
//   const [selectedBusinessMenu, setSelectedBusinessMenu] = useState<boolean>(false)

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     setValue,
//     watch,
//   } = useForm<SizeDataTypeWithoutId>()

//   const validateBusinessId = (value: number) => {
//     const selectedItem = BusinessMenuesData.find((item) => item.id === value)
//     if (selectedItem) {
//       setSelectedBusinessMenu(true)
//     } else {
//       setSelectedBusinessMenu(false)
//     }

//     return selectedItem?.business ? true : "Business ID is required"
//   }

//   const onSubmit = (data: SizeDataTypeWithoutId, e: any) => {
//     e.preventDefault()

//     onCreateSize(false)
//     setAddSizeFlag(false)

//     if (selectedBusinessMenu === null) {
//       toast.error("Please select a business catalouge")
//       return
//     }
//     if (!data?.business) {
//       toast.error("Please select a business catalouge to proceed")
//       return
//     }
//     if (!data?.type) {
//       toast.error("Please select a business to proceed")
//       return
//     }

//     const payload = {
//       name: data?.name,
//       additional_price: data?.additional_price,
//       description: data?.description,
//       business: data?.business,
//       menu: data?.menu,
//       type: data?.type,
//       size: data?.size,
//     }

//     setLoading(true)
//     createSize(payload)
//       .then((res) => {
//         toast.success("Size saved successfully")
//         onCreateSize(true)
//         setAddSizeFlag(true)
//         reset()
//         setValue("menu", 0, { shouldValidate: true }) // Explicitly reset menu to 0
//         setValue("business", 0, { shouldValidate: true }) // Also reset business
//         setValue("type", 0, { shouldValidate: true }) // Also reset type
//         setValue("size", "", { shouldValidate: true })
//         setSelectedBusinessMenu(false) // Reset the business menu selection state
//       })
//       .catch((error) => {
//         console.log(error?.data, "Size create error")
//         if (error?.data && error?.data?.non_field_errors?.[0]) {
//           toast.error(error?.data?.non_field_errors[0])
//         } else if (error?.data && error?.data?.additional_price?.[0]) {
//           toast.error(error?.data?.additional_price[0])
//         } else if (error?.data && error?.data?.business?.[0]) {
//           toast.error(error?.data?.business[0])
//         } else {
//           toast.error("Error in creating Size")
//         }
//       })
//       .finally(() => {
//         setLoading(false)
//       })
//   }

//   useEffect(() => {
//     const fetchBusinessMenus = async () => {
//       try {
//         const response = await getBusinessMenuesById(Number(id))
//         setBusinessMenuesData(response?.data?.data)
//       } catch (error: any) {
//         // Handle error
//         console.log(error, "Business catalouges error")
//       }
//     }
//     fetchBusinessMenus()
//   }, [id])

//   return (
//     <>
//       <Card>
//         <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-6">
//           <Grid container spacing={5} alignItems="center">
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 label="Name *"
//                 fullWidth
//                 placeholder="Enter  Name"
//                 {...register("name", { required: "Name is required" })}
//                 error={!!errors.name}
//                 helperText={errors.name?.message}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 label="Description *"
//                 fullWidth
//                 placeholder="Enter Description"
//                 {...register("description", { required: "Description is required" })}
//                 error={!!errors.description}
//                 helperText={errors.description?.message}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 label="Price *"
//                 fullWidth
//                 type="number"
//                 placeholder="Enter Price"
//                 inputProps={{ step: "any", min: "0.1" }} // Allows precise decimal values
//                 {...register("additional_price", {
//                   required: "Additional Price is required",
//                   pattern: {
//                     value: /^(0\.\d*[1-9]\d*|[1-9]\d*(\.\d+)?|\d)$/, // Accepts positive integers & decimals, prevents leading zeros
//                     message: "Only positive integers or decimal values are allowed",
//                   },
//                   min: {
//                     value: 0.1, // Ensures greater than 0
//                     message: "Value must be at least 0.1",
//                   },
//                 })}
//                 error={!!errors.additional_price}
//                 helperText={errors.additional_price?.message}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 select
//                 fullWidth
//                 label="Catalouge*"
//                 value={watch("menu") || 0} // Add this line to control the displayed value
//                 {...register("menu", {
//                   required: "Business Catalouge is required",
//                   validate: validateBusinessId,
//                   onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
//                     const selectedId = Number(e.target.value)
//                     const selectedItem = BusinessMenuesData.find((item) => item.id === selectedId)
//                     if (selectedItem) {
//                       setValue("business", Number(selectedItem.business), { shouldValidate: true })
//                       setValue("type", selectedItem?.type?.id, { shouldValidate: true })
//                     }
//                   },
//                 })}
//                 error={!!errors.menu}
//                 helperText={errors.menu?.message}
//               >
//                 <MenuItem key="Select menu" value={0}>
//                   Select catalouge
//                 </MenuItem>
//                 {BusinessMenuesData &&
//                   BusinessMenuesData?.map((bMenu) => (
//                     <MenuItem key={bMenu.id} value={bMenu.id}>
//                       {bMenu.title}
//                     </MenuItem>
//                   ))}
//               </CustomTextField>
//             </Grid>

        

//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 select
//                 fullWidth
//                 label="Size*"
//                 value={watch("size") || ""} // Add this line to control the displayed value
//                 {...register("size", {
//                   required: "Size is required",
//                 })}
//                 error={!!errors.size}
//                 helperText={errors.size?.message}
//               >
//                 <MenuItem key="Select menu" value={0}>
//                   Select Size
//                 </MenuItem>
//                 <MenuItem value={"Small"}>Small (S)</MenuItem>
//                 <MenuItem value={"Medium"}>Medium (M)</MenuItem>
//                 <MenuItem value={"Large"}>Large (L)</MenuItem>
//               </CustomTextField>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <div className="flex items-center gap-4" style={{ marginTop: errors.description ? "0px" : "15px" }}>
//                 <Button variant="contained" type="submit" disabled={loading}>
//                   Save Size
//                 </Button>
//               </div>
//               {loading && <Loader />}
//             </Grid>
//           </Grid>
//         </form>
//         <Toaster />
//       </Card>
//     </>
//   )
// }

// export default AddSize

"use client"
import Card from "@mui/material/Card"
import type React from "react"

import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import CustomTextField from "@core/components/mui/TextField"
import { useForm } from "react-hook-form"
import MenuItem from "@mui/material/MenuItem"
import Loader from "@/components/loader/Loader"
import { createSize, getBusinessMenuesById } from "@/api/size"
import type { BusinessMenusDataType, SizeDataTypeWithoutId } from "@/api/interface/sizeInterface"

type PreviewToppingsProps = {
  id: string
  isCreated: boolean
  onCreateSize: (isCreated: boolean) => void
}

const AddSize = ({ id, isCreated, onCreateSize }: PreviewToppingsProps) => {
  const [BusinessMenuesData, setBusinessMenuesData] = useState<BusinessMenusDataType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [addSizeFlag, setAddSizeFlag] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SizeDataTypeWithoutId>({
    defaultValues: {
      name: "",
      description: "",
      additional_price: undefined,
      menu: undefined,
      business: undefined,
      type: undefined,
      size: "",
    },
  })

  const watchedMenu = watch("menu")

  // Simplified validation for menu selection
  const validateMenu = (value: number) => {
    if (!value || value === 0) {
      return "Please select a catalogue"
    }
    const selectedItem = BusinessMenuesData.find((item) => item.id === value)
    return selectedItem ? true : "Invalid catalogue selection"
  }

  const onSubmit = (data: SizeDataTypeWithoutId, e: any) => {
    e.preventDefault()

    onCreateSize(false)
    setAddSizeFlag(false)

    // Validation checks
    if (!data?.menu || data.menu === 0) {
      toast.error("Please select a catalogue")
      return
    }
    if (!data?.business) {
      toast.error("Please select a business catalogue to proceed")
      return
    }
    if (!data?.type) {
      toast.error("Please select a business to proceed")
      return
    }
    if (!data?.size) {
      toast.error("Please select a size")
      return
    }

    const payload = {
      name: data?.name,
      additional_price: data?.additional_price,
      description: data?.description,
      business: data?.business,
      menu: data?.menu,
      type: data?.type,
      size: data?.size,
    }

    setLoading(true)
    createSize(payload)
      .then((res) => {
        toast.success("Size saved successfully")
        onCreateSize(true)
        setAddSizeFlag(true)

        // Proper form reset
        reset({
          name: "",
          description: "",
          additional_price: undefined,
          menu: undefined,
          business: undefined,
          type: undefined,
          size: "",
        })
      })
      .catch((error) => {
        console.log(error?.data, "Size create error")
        if (error?.data && error?.data?.non_field_errors?.[0]) {
          toast.error(error?.data?.non_field_errors[0])
        } else if (error?.data && error?.data?.additional_price?.[0]) {
          toast.error(error?.data?.additional_price[0])
        } else if (error?.data && error?.data?.business?.[0]) {
          toast.error(error?.data?.business[0])
        } else {
          toast.error("Error in creating Size")
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // Handle menu selection change
  const handleMenuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedId = Number(e.target.value)
    const selectedItem = BusinessMenuesData.find((item) => item.id === selectedId)

    if (selectedItem) {
      setValue("business", Number(selectedItem.business), { shouldValidate: true })
      setValue("type", selectedItem?.type?.id, { shouldValidate: true })
    } else {
      setValue("business", undefined, { shouldValidate: true })
      setValue("type", undefined, { shouldValidate: true })
    }
  }

  useEffect(() => {
    const fetchBusinessMenus = async () => {
      try {
        const response = await getBusinessMenuesById(Number(id))
        setBusinessMenuesData(response?.data?.data)
      } catch (error: any) {
        console.log(error, "Business catalogues error")
      }
    }
    fetchBusinessMenus()
  }, [id])

  return (
    <>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-6">
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Name *"
                fullWidth
                placeholder="Enter Name"
                {...register("name", { required: "Name is required" })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Description *"
                fullWidth
                placeholder="Enter Description"
                {...register("description", { required: "Description is required" })}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Price *"
                fullWidth
                type="number"
                placeholder="Enter Price"
                inputProps={{ step: "any", min: "0.1" }}
                {...register("additional_price", {
                  required: "Additional Price is required",
                  pattern: {
                    value: /^(0\.\d*[1-9]\d*|[1-9]\d*(\.\d+)?|\d)$/,
                    message: "Only positive integers or decimal values are allowed",
                  },
                  min: {
                    value: 0.1,
                    message: "Value must be at least 0.1",
                  },
                })}
                error={!!errors.additional_price}
                helperText={errors.additional_price?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label="Catalogue*"
                value={watchedMenu || ""}
                {...register("menu", {
                  required: "Business Catalogue is required",
                  validate: validateMenu,
                  onChange: handleMenuChange,
                })}
                error={!!errors.menu}
                helperText={errors.menu?.message}
              >
                <MenuItem value="">Select catalogue</MenuItem>
                {BusinessMenuesData &&
                  BusinessMenuesData?.map((bMenu) => (
                    <MenuItem key={bMenu.id} value={bMenu.id}>
                      {bMenu.title}
                    </MenuItem>
                  ))}
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label="Size*"
                value={watch("size") || ""}
                {...register("size", {
                  required: "Size is required",
                })}
                error={!!errors.size}
                helperText={errors.size?.message}
              >
                <MenuItem value="">Select Size</MenuItem>
                <MenuItem value="Small">Small (S)</MenuItem>
                <MenuItem value="Medium">Medium (M)</MenuItem>
                <MenuItem value="Large">Large (L)</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <div className="flex items-center gap-4" style={{ marginTop: errors.description ? "0px" : "15px" }}>
                <Button variant="contained" type="submit" disabled={loading}>
                  Save Size
                </Button>
              </div>
              {loading && <Loader />}
            </Grid>
          </Grid>
        </form>
        {/* <Toaster /> */}
      </Card>
    </>
  )
}

export default AddSize
