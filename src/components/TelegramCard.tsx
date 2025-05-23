'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { useForm } from 'react-hook-form'

import CustomTextField from '@/@core/components/mui/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

import { FeedWhatsApp } from '@/api/whatsapp'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import { BusinessType } from '@/types/apps/businessTypes'
import { getAllBusiness } from '@/api/business'
import MenuItem from '@mui/material/MenuItem'
import { getFeedToChatGpt } from '@/api/feedToChatGPT'
import { FeedToChatGptType } from '@/api/interface/interfaceFeedToGPT'
import toast, { Toaster } from 'react-hot-toast'
import { TelegramDataType } from '@/api/interface/telegramInterface'
import { TeleGram } from '@/api/telegram'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'

const TelegramCard = () => {
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
  } = useForm<TelegramDataType>()

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

        // console.log(response?.data?.results, 'All getFeedToChatGpt Data')

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

  const onSubmit = (data: TelegramDataType, e: any) => {
    e.preventDefault()
    setLoading(true)
    // console.log(data, 'data')

    TeleGram(data)
      .then(res => {
        // console.log(res, 'create FeedWhatsApp')
        toast.success('Telegram created successfully')
        // router.replace('/home')
        router.replace(getLocalizedUrl('/account-settings', locale as Locale))
      })
      .catch(error => {
        console.log(error, 'error in Telegram')
      })
      .finally(() => {
        setLoading(false)
        reset() // Reset the form after submission
      })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader title='Telegram' subheader='Display content from your connected accounts on your site' />
          <CardContent className='flex flex-col gap-4'>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  select
                  fullWidth
                  id='business'
                  label='Select Business'
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
                  label='Name'
                  fullWidth
                  placeholder='Enter Name'
                  {...register('name', { required: 'Name is required' })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='user_name'
                  fullWidth
                  {...register('user_name', { required: 'user_name is required' })}
                  error={!!errors.user_name}
                  helperText={errors.user_name?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {/* <CustomTextField
                  label='Feed to GPT'
                  fullWidth
                  {...register('feed_to_gpt', { required: 'Feed to GPT is required' })}
                  error={!!errors.feed_to_gpt}
                  helperText={errors.feed_to_gpt?.message}
                /> */}
                <CustomTextField
                  select
                  fullWidth
                  id='feed_to_gpt'
                  label='Select feed_to_gpt'
                  inputProps={{ placeholder: 'feed_to_gpt', ...register('feed_to_gpt') }}
                  error={!!errors.feed_to_gpt}
                  helperText={errors.feed_to_gpt?.message}
                >
                  {feedToGptData &&
                    feedToGptData?.map(feed => (
                      <MenuItem key={feed.id} value={feed.business}>
                        {feed.name}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>
              {/* business */}
              {/* name */}
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
            <Box display='flex' justifyContent='center' mt={3}>
              <Button type='submit' variant='contained' color='primary' disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </form>
      <Toaster />
    </>
  )
}

export default TelegramCard
