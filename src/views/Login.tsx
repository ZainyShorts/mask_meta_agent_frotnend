'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useParams, useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import toast, { Toaster } from 'react-hot-toast'

import type { SystemMode } from '@core/types'

// Component Imports
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'
import CustomModal from '@/components/CustomModal'

import type { LoginUser } from '@/api/interface/userInterface'
import { loginUser, verifyUser } from '@/api/user'
import Loader from '@/components/loader/Loader'

import { useAuthStore } from '@/store/authStore'

import { getBaseUrl } from '../api/vars/vars' // Relative path to vars.ts

// Vars
const darkImg = '/images/pages/auth-mask-dark.png'
const lightImg = '/images/pages/auth-mask-light.png'
const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
const lightIllustration = '/images/illustrations/auth/v2-login-light.png'
const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

// Styled Custom Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
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

const Login = ({ mode }: { mode: SystemMode }) => {
  const { user, token, setToken, setUser } = useAuthStore()
  const [open, setOpen] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingVerify, setLoadingVerify] = useState<boolean>(false)
  const { lang: locale } = useParams() as { lang: Locale }
  const [toastShown, setToastShown] = useState<boolean>(false)
  const [toastSn, setToastSn] = useState<boolean>(false)

  // console.log(loggedInUser, 'loggedInUser')

  const [isRememberMeChecked, setIsRememberMeChecked] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginUser>()

  // console.log(user, 'user latest')

  const onSubmit = (data: LoginUser, e: any) => {
    e.preventDefault()
    setEmail(data.email)
    setLoading(true)

    loginUser(data)
      .then(res => {
        if (res?.status === 200 && res?.data?.isActive) {
          toast.success('Email Verification Code is sent to your email.', { duration: 5000, position: 'top-right' })
          setIsModalOpen(true)
          // if (!toastShown) {

          // setToastShown(true)
          // }
        } else {
          // toast.success(res?.data?.message)
          toast.dismiss()
          toast.success(res?.data?.message, { duration: 5000, position: 'top-right' })
        }
      })
      .catch(error => {
        // console.log(error, 'error login api')
        toast.dismiss()
        if (error.non_field_errors) {
          toast.error(error?.non_field_errors[0], {
            duration: 5000, // Duration in milliseconds (5 seconds)
            position: 'top-right'
          })
        } else if (typeof error === 'string') {
          toast.error(error, {
            duration: 5000, // Duration in milliseconds (5 seconds)
            position: 'top-right'
          })
        } else {
          toast.error(error?.message, {
            duration: 5000, // Duration in milliseconds (5 seconds)
            position: 'top-right'
          })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleVerificationSubmit = async (code: number, email: string) => {
    setLoadingVerify(true)

    try {
      const url = `${getBaseUrl()}account/verify/`

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code })
      })

      // console.log(res, 'res of verfied User--------')

      // if (!res.ok) {
      //   const errorText = await res.text()

      //   throw new Error(errorText)
      // }

      if (!res.ok) {
        // Try to parse the error response as JSON if possible
        const errorText = await res.text()
        try {
          const errorJson = JSON.parse(errorText)
          // console.log(errorJson, 'error messgae')
          if (errorJson?.code) {
            toast.error(errorJson?.code[0], {
              duration: 5000, // Duration in milliseconds (5 seconds)
              position: 'top-right'
            })
          } else {
            toast.error(errorJson?.error, {
              duration: 5000, // Duration in milliseconds (5 seconds)
              position: 'top-right'
            })
          }
          // console.log(errorJson?.error, 'error messgae')

          // throw new Error(errorJson.error || 'Verification failed')
        } catch {
          // If errorText is not JSON, throw it as a plain error
          // throw new Error(errorText || 'Verification failed')
        }
      }

      if (res?.status === 200) {
        setIsModalOpen(false)
      }

      const data = await res.json()

      // console.log(data, 'verified  user object')

      // const setToken = useAuthStore.getState().setToken
      // const setUser = useAuthStore.getState().setUser

      localStorage.setItem('auth_token', data?.token)
      localStorage.setItem('user_type', data?.user?.user_type)

      setToken(data?.token)
      setUser(data?.user)

      document.cookie = `auth_token=${data.token}; path=/; max-age=604800; Secure; HttpOnly`
      toast.success(data.message, {
        duration: 5000, // Duration in milliseconds (5 seconds)
        position: 'top-right'
      })
      if(data.user.subscription === false){
        router.push(getLocalizedUrl('/account-settings', locale))
      }else{
        router.push(getLocalizedUrl('/home', locale))
      }
    } catch (error: any) {
    } finally {
      setLoadingVerify(false)
    }
  }

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Hooks
  const router = useRouter()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

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
        <LoginIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && (
          <MaskImg
            alt='mask'
            src={authBackground}
            className={classnames({ 'scale-x-[-1]': theme.direction === 'rtl' })}
          />
        )}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}! 👋🏻`}</Typography>
            <Typography>Please sign-in to your account and start the adventure</Typography>
          </div>
          <form autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <CustomTextField
              autoFocus
              fullWidth
              label='Email '
              placeholder='Enter your email '
              {...register('email', { required: 'Email is required' })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <CustomTextField
              fullWidth
              label='Password'
              placeholder='············'
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={errors.password?.message}
              id='outlined-adornment-password'
              type={isPasswordShown ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                      <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
              <FormControlLabel
                control={
                  <Checkbox checked={isRememberMeChecked} onChange={e => setIsRememberMeChecked(e.target.checked)} />
                }
                label='Remember me'
              />
              <Link href={getLocalizedUrl('/forgot-password', locale)}>
                <Typography className='text-end' color='primary'>
                  Forgot password?
                </Typography>
              </Link>
            </div>
            <Button fullWidth variant='contained' type='submit' disabled={loading}>
              Login
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>New on our platform?</Typography>
              <Link href={getLocalizedUrl('/register', locale)}>
                <Typography color='primary'>Create an account</Typography>
              </Link>
            </div>
            {loading && <Loader />}
            <CustomModal
              email={email}
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title='Verify Your Email'
              description='Enter the verification code sent to your email.'
              onSubmit={handleVerificationSubmit}
              submitButtonText='Submit'
              loadingVerify={loadingVerify}
            />
          </form>
          {/* <Toaster position='top-right' reverseOrder={false} /> */}
        </div>
      </div>
    </div>
  )
}

export default Login
