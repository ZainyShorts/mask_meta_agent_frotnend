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

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     setValue,
//     watch,
//   } = useForm<SizeDataTypeWithoutId>({
//     defaultValues: {
//       name: "",
//       description: "",
//       additional_price: undefined,
//       menu: undefined,
//       business: undefined,
//       type: undefined,
//       size: "",
//     },
//   })

//   const watchedMenu = watch("menu")

//   // Simplified validation for menu selection
//   const validateMenu = (value: number) => {
//     if (!value || value === 0) {
//       return "Please select a catalogue"
//     }
//     const selectedItem = BusinessMenuesData.find((item) => item.id === value)
//     return selectedItem ? true : "Invalid catalogue selection"
//   }

//   const onSubmit = (data: SizeDataTypeWithoutId, e: any) => {
//     e.preventDefault()

//     onCreateSize(false)
//     setAddSizeFlag(false)

//     // Validation checks
//     if (!data?.menu || data.menu === 0) {
//       toast.error("Please select a catalogue")
//       return
//     }
//     if (!data?.business) {
//       toast.error("Please select a business catalogue to proceed")
//       return
//     }
//     if (!data?.type) {
//       toast.error("Please select a business to proceed")
//       return
//     }
//     if (!data?.size) {
//       toast.error("Please select a size")
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

//         // Proper form reset
//         reset({
//           name: "",
//           description: "",
//           additional_price: undefined,
//           menu: undefined,
//           business: undefined,
//           type: undefined,
//           size: "",
//         })
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

//   // Handle menu selection change
//   const handleMenuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedId = Number(e.target.value)
//     const selectedItem = BusinessMenuesData.find((item) => item.id === selectedId)

//     if (selectedItem) {
//       setValue("business", Number(selectedItem.business), { shouldValidate: true })
//       setValue("type", selectedItem?.type?.id, { shouldValidate: true })
//     } 
//   }

//   useEffect(() => {
//     const fetchBusinessMenus = async () => {
//       try {
//         const response = await getBusinessMenuesById(Number(id))
//         setBusinessMenuesData(response?.data?.data)
//       } catch (error: any) {
//         console.log(error, "Business catalogues error")
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
//                 placeholder="Enter Name"
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
//                 inputProps={{ step: "any", min: "0.1" }}
//                 {...register("additional_price", {
//                   required: "Additional Price is required",
//                   pattern: {
//                     value: /^(0\.\d*[1-9]\d*|[1-9]\d*(\.\d+)?|\d)$/,
//                     message: "Only positive integers or decimal values are allowed",
//                   },
//                   min: {
//                     value: 0.1,
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
//                 label="Catalogue*"
//                 value={watchedMenu || ""}
//                 {...register("menu", {
//                   required: "Business Catalogue is required",
//                   validate: validateMenu,
//                   onChange: handleMenuChange,
//                 })}
//                 error={!!errors.menu}
//                 helperText={errors.menu?.message}
//               >
//                 <MenuItem value="">Select catalogue</MenuItem>
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
//                 value={watch("size") || ""}
//                 {...register("size", {
//                   required: "Size is required",
//                 })}
//                 error={!!errors.size}
//                 helperText={errors.size?.message}
//               >
//                 <MenuItem value="">Select Size</MenuItem>
//                 <MenuItem value="Small">Small (S)</MenuItem>
//                 <MenuItem value="Medium">Medium (M)</MenuItem>
//                 <MenuItem value="Large">Large (L)</MenuItem>
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
//         {/* <Toaster /> */}
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
import toast from "react-hot-toast"
import CustomTextField from "@core/components/mui/TextField"
import { useForm } from "react-hook-form"
import MenuItem from "@mui/material/MenuItem"
import Loader from "@/components/loader/Loader"
import { createSize, getBusinessMenuesById } from "@/api/size"
import type { BusinessMenusDataType, SizeDataTypeWithoutId } from "@/api/interface/sizeInterface"
import { FormControlLabel, Checkbox, FormGroup, FormControl, FormLabel, FormHelperText } from "@mui/material"

type PreviewToppingsProps = {
  id: string
  isCreated: boolean
  onCreateSize: (isCreated: boolean) => void
}

// Updated size options to match your API format
const sizeOptions = [
  { value: "Small", label: "Small (S)" },
  { value: "Medium", label: "Medium (M)" },
  { value: "Large", label: "Large (L)" }
]

const AddSize = ({ id, isCreated, onCreateSize }: PreviewToppingsProps) => {
  const [BusinessMenuesData, setBusinessMenuesData] = useState<BusinessMenusDataType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [addSizeFlag, setAddSizeFlag] = useState<boolean>(false)
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])

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

  // Handle checkbox changes
  const handleSizeChange = (sizeValue: string, checked: boolean) => {
    if (checked) {
      setSelectedSizes((prev) => [...prev, sizeValue])
    } else {
      setSelectedSizes((prev) => prev.filter((size) => size !== sizeValue))
    }
  }

  const onSubmit = async (data: SizeDataTypeWithoutId, e: any) => {
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
    if (selectedSizes.length === 0) {
      toast.error("Please select at least one size")
      return
    }

    setLoading(true)

    try {
      // Loop through each selected size and call API one by one
      for (let i = 0; i < selectedSizes.length; i++) {
        const size = selectedSizes[i]

        const payload = {
          name: data?.name,
          additional_price: data?.additional_price,
          description: data?.description,
          business: data?.business,
          menu: data?.menu,
          type: data?.type,
          size: size, // Now sends "Small", "Medium", "Large" etc.
        }

        console.log(`Creating size ${i + 1}/${selectedSizes.length}: ${size}`, payload)

        // Call your original createSize function
        await createSize(payload)

        console.log(`Size ${size} created successfully`)
      }

      // All sizes created successfully
      toast.success(`${selectedSizes.length} size${selectedSizes.length > 1 ? "s" : ""} saved successfully`)
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
      setSelectedSizes([])
    } catch (error: any) {
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
    } finally {
      setLoading(false)
    }
  }

  // Handle menu selection change
  const handleMenuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedId = Number(e.target.value)
    const selectedItem = BusinessMenuesData.find((item) => item.id === selectedId)
    if (selectedItem) {
      setValue("business", Number(selectedItem.business), { shouldValidate: true })
      setValue("type", selectedItem?.type?.id, { shouldValidate: true })
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
                inputProps={{ step: "any", min: "0" }}
                {...register("additional_price", {
                  required: "Additional Price is required",
                  // pattern: {
                  //   value: /^(0\.\d*[1-9]\d*|[1-9]\d*(\.\d+)?|\d)$/,
                  //   message: "Only positive integers or decimal values are allowed",
                  // },
                  min: {
                    value: 0,
                    message: "Value must be at least 0",
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

            {/* Size Checkboxes */}
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ marginBottom: 2, fontWeight: 600 }}>
                  Select Sizes *
                </FormLabel>
                <FormGroup row>
                  {sizeOptions.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      control={
                        <Checkbox
                          checked={selectedSizes.includes(option.value)}
                          onChange={(e) => handleSizeChange(option.value, e.target.checked)}
                          name={option.value}
                        />
                      }
                      label={option.label}
                    />
                  ))}
                </FormGroup>
                {selectedSizes.length === 0 && <FormHelperText error>Please select at least one size</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <div className="flex items-center gap-4" style={{ marginTop: errors.description ? "0px" : "15px" }}>
                <Button variant="contained" type="submit" disabled={loading}>
                  Save Size{selectedSizes.length > 1 ? "s" : ""}
                  {selectedSizes.length > 0 && ` (${selectedSizes.length})`}
                </Button>
              </div>
              {loading && <Loader />}
            </Grid>
          </Grid>
        </form>
      </Card>
    </>
  )
}

export default AddSize
