'use client'

// Next Imports
import { useState } from 'react'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import toast, { Toaster } from 'react-hot-toast'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import { useForm } from 'react-hook-form'

import type { SystemMode } from '@core/types'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

import DirectionalIcon from '@/components/DirectionalIcon'
import type { forgotPasswordUserType } from '@/api/interface/userInterface'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'

import { forgotPassword } from '@/api/user'

const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 650,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

const ForgotPassword = ({ mode }: { mode: SystemMode }) => {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const { lang: locale } = useParams() as { lang: Locale }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<forgotPasswordUserType>()

  const onSubmit = (data: forgotPasswordUserType, e: any) => {
    // console.log(data, 'data-----')

    e.preventDefault()

    // setEmail(data.email)
    setLoading(true)

    forgotPassword(data)
      .then(res => {
        // console.log(res, '-----------')

        if (res?.status === 200) {
          toast.success(res?.data?.message, {
            duration: 5000 // Duration in milliseconds (5 seconds)
          })

          // const token = res.data.token
          // if (isRememberMeChecked) {
          //   localStorage.setItem('auth_token', token)
          // } else {
          //   sessionStorage.setItem('auth_token', token)
          // }
        }
      })
      .catch(error => {
        // console.log(error, 'error')
        toast.error(error?.data?.message, {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })

        // if (error.non_field_errors) {
        //   toast.error(error?.non_field_errors[0])
        // } else if (typeof error === 'string') {
        //   toast.error(error)
        // } else {
        //   toast.error(error?.message)
        // }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-forgot-password-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-forgot-password-light.png'

  // Hooks
  // const { lang: Locale } = useParams()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const characterIllustration = useImageVariant(mode, lightIllustration, darkIllustration)

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <ForgotPasswordIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && <MaskImg alt='mask' src={authBackground} />}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>Forgot Password 🔒</Typography>
            <Typography>Enter your email and we&#39;ll send you instructions to reset your password</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <CustomTextField
              autoFocus
              fullWidth
              label='Email '
              placeholder='Enter your email '
              {...register('email', { required: 'Email is required' })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            {/* <Link href='/reset-password'> */}
            <Button
              fullWidth
              variant='contained'
              type='submit'
              disabled={loading}

              // onClick={e => router.push('/reset-password')}
            >
              Send Reset Link
            </Button>
            {/* </Link> */}
            <Typography className='flex justify-center items-center' color='primary'>
              <Link href={getLocalizedUrl('/login', locale)} className='flex items-center gap-1.5'>
                <DirectionalIcon
                  ltrIconClass='tabler-chevron-left'
                  rtlIconClass='tabler-chevron-right'
                  className='text-xl'
                />
                <span>Back to login</span>
              </Link>
            </Typography>
          </form>
          <Toaster />
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
