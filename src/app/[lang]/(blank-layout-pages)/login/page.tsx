// Next Imports

import type { Metadata } from 'next'

// Component Imports
import Login from '@views/Login'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account'
}

const LoginPage = () => {
  // Get server mode
  const mode = getServerMode()

  // Return Login component with mode
  return <Login mode={mode} />
}

export default LoginPage
