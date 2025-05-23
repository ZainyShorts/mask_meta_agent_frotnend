// Next Imports
import type { Metadata } from 'next'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

// Component Imports
import UpdatePassword from '@/views/UpdatePassword'

export const metadata: Metadata = {
  title: 'Update Password',
  description: 'Update Password Here'
}

const UpdatePasswordPage = () => {
  // Variable for server mode
  const mode = getServerMode()

  // Render UpdatePassword component with mode prop
  return <UpdatePassword mode={mode} />
}

export default UpdatePasswordPage
