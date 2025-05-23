// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import { useParams, useRouter } from 'next/navigation'

import Button from '@mui/material/Button'

import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Card from '@mui/material/Card'

import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { MenuItem } from '@mui/material'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Loader from '@/components/loader/Loader'
import { getFeedToChatGpt } from '@/api/feedToChatGPT'
import { getAllBusiness } from '@/api/business'
import { BusinessType } from '@/types/apps/businessTypes'
import { FeedToChatGptType } from '@/api/interface/interfaceFeedToGPT'
import { FaceBookDataType } from '@/api/interface/facebookInterface'
import { FaceBook } from '@/api/facebook'
import { Locale } from '@/configs/i18n'
import { getLocalizedUrl } from '@/utils/i18n'

type Props = {
  open: boolean
  handleClose: () => void
}

const AddFaceBookDrawer = ({ open, handleClose }: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [userBusinessData, setUserBusinessData] = useState<BusinessType[]>([])
  const [feedToGptData, setFeedToGptData] = useState<FeedToChatGptType[]>([])

  const router = useRouter()
  const { lang: locale } = useParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<FaceBookDataType>()

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await getAllBusiness()

        // console.log(response?.data?.results, 'All Business Data')

        setUserBusinessData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch business')
      } finally {
        // setLoading(false)
      }
    }

    fetchBusiness()
  }, [])

  useEffect(() => {
    const fetchFeedToChatGpt = async () => {
      try {
        const response = await getFeedToChatGpt()

        console.log(response?.data?.results, 'All getFeedToChatGpt Data')

        setFeedToGptData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch business')
      } finally {
        // setLoading(false)
      }
    }

    fetchFeedToChatGpt()
  }, [])

  //

  const onSubmit = (data: FaceBookDataType, e: any) => {
    e.preventDefault()
    setLoading(true)

    FaceBook(data)
      .then(res => {
        toast.success('FaceBook created successfully', {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
        handleClose()

        router.replace(getLocalizedUrl('/account-settings', locale as Locale))
      })
      .catch(error => {
        console.log(error, 'error in FeedWhatsApp')
      })
      .finally(() => {
        setLoading(false)
        reset() // Reset the form after submission
      })
  }
  const handleReset = () => {
    handleClose()
    reset()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between plb-5 pli-6'>
        <Typography variant='h5'>Add FaceBook Feed</Typography>
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardContent className='flex flex-col gap-4'>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    id='business'
                    label='Select Business *'
                    inputProps={{ placeholder: 'Business', ...register('business') }}
                    error={!!errors.business}
                    helperText={errors.business?.message}
                  >
                    {userBusinessData &&
                      userBusinessData?.map(business => (
                        <MenuItem key={business.id} value={business.id}>
                          {business.business_id}
                        </MenuItem>
                      ))}
                  </CustomTextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Facebook id *'
                    fullWidth
                    placeholder='Enter Facebook id'
                    {...register('facebook_id', { required: 'Facebook id is required' })}
                    error={!!errors.facebook_id}
                    helperText={errors.facebook_id?.message}
                  />
                </Grid>
                {/*  */}
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Access Token *'
                    fullWidth
                    placeholder='Enter Access Token'
                    {...register('access_token', { required: 'Access Token is required' })}
                    error={!!errors.access_token}
                    helperText={errors.access_token?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Webhook Token *'
                    fullWidth
                    {...register('webhook_token', { required: 'Webhook Token is required' })}
                    error={!!errors.webhook_token}
                    helperText={errors.webhook_token?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Facebook account id *'
                    fullWidth
                    type='number' // Set the input type to 'number'
                    {...register('facebook_account_id', {
                      required: 'Facebook account id is required',
                      valueAsNumber: true // This ensures the value is parsed as a number
                    })}
                    error={!!errors.facebook_account_id}
                    helperText={errors.facebook_account_id?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Catalog ID *'
                    fullWidth
                    {...register('catalog_id', { required: 'Catalog ID is required' })}
                    error={!!errors.catalog_id}
                    helperText={errors.catalog_id?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    id='Feed to gpt'
                    label='Select Feed to gpt *'
                    inputProps={{ placeholder: 'Feed to gpt', ...register('feed_to_gpt') }}
                    error={!!errors.feed_to_gpt}
                    helperText={errors.feed_to_gpt?.message}
                  >
                    {feedToGptData &&
                      feedToGptData?.map(feed => (
                        <MenuItem key={feed.id} value={feed.id}>
                          {feed.name}
                        </MenuItem>
                      ))}
                  </CustomTextField>
                </Grid>

                <Grid item xs={12} sm={6} style={{ marginTop: '20px' }}>
                  <FormControl error={!!errors.active}>
                    <FormControlLabel
                      control={
                        <Checkbox {...register('active', { required: 'Active must be checked' })} color='primary' />
                      }
                      label='Active'
                    />
                    {errors.active && <FormHelperText>{errors.active.message}</FormHelperText>}
                  </FormControl>
                </Grid>
              </Grid>

              <div className='flex items-center gap-4'>
                <Button variant='contained' type='submit' disabled={loading}>
                  Submit
                </Button>
                <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
                  Cancel
                </Button>
              </div>
              {loading && <Loader />}
            </CardContent>
          </Card>
        </form>
        <Toaster />
      </div>
    </Drawer>
  )
}

export default AddFaceBookDrawer
