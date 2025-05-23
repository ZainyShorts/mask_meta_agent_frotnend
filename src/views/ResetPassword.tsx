'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

import { useRouter, useParams } from 'next/navigation'

import toast, { Toaster } from 'react-hot-toast'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import { useForm } from 'react-hook-form'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { SystemMode } from '@core/types'

// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'
import type { resetPasswordUserType } from '@/api/interface/userInterface'
import { resetPassword } from '@/api/user'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'

// Styled Custom Components
const ResetPasswordIllustration = styled('img')(({ theme }) => ({
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
  maxBlockSize: 330,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

// Vars
const darkImg = '/images/pages/auth-mask-dark.png'
const lightImg = '/images/pages/auth-mask-light.png'
const darkIllustration = '/images/illustrations/auth/v2-reset-password-dark.png'
const lightIllustration = '/images/illustrations/auth/v2-reset-password-light.png'

const ResetPassword = ({ mode }: { mode: SystemMode }) => {
  const router = useRouter()
  const params = useParams()
  const { lang: locale } = useParams()

  const userId: string = (params?.userId as string) || ''
  const token: string = (params?.token as string) || ''
  const expiration_time: string = (params?.expiration_time as string) || ''

  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Hooks
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const characterIllustration = useImageVariant(mode, lightIllustration, darkIllustration)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<resetPasswordUserType>()

  const onSubmit = async (data: resetPasswordUserType, e: any) => {
    e.preventDefault()

    if (data?.new_password !== data?.confirm_password) {
      toast.error('New Password and confirm password must be matched')

      return
    }

    setLoading(true)

    try {
      const res = await resetPassword({ new_password: data.new_password }, { userId, token, expiration_time })
      console.log(res, 'res')

      if (res?.status === 200) {
        toast.success(res?.data?.message, {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
        // router.push('/login')
        router.push(getLocalizedUrl('/login', locale as Locale))
      }
    } catch (error) {
      console.log(error, 'error')
      toast.error('An error occurred while resetting the password.', {
        duration: 5000 // Duration in milliseconds (5 seconds)
      })
    } finally {
      setLoading(false)
    }
  }

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
        <ResetPasswordIllustration src={characterIllustration} alt='character-illustration' />
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
            <Typography variant='h4'>Reset Password 🔒</Typography>
            <Typography>Your new password must be different from previously used passwords</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <CustomTextField
              autoFocus
              fullWidth
              label='New Password'
              {...register('new_password', { required: 'New Password is required' })}
              error={!!errors.new_password}
              helperText={errors.new_password?.message}
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
            <CustomTextField
              fullWidth
              label='Confirm Password'
              {...register('confirm_password', { required: 'Confirm password is required' })}
              error={!!errors.confirm_password}
              helperText={errors.confirm_password?.message}
              type={isConfirmPasswordShown ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={e => e.preventDefault()}
                    >
                      <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button fullWidth variant='contained' type='submit' disabled={loading}>
              Set New Password
            </Button>
            <Typography className='flex justify-center items-center' color='primary'>
              <Link href='/login' className='flex items-center gap-1.5'>
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

export default ResetPassword
