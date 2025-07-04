'use client'

import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'

import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import CustomTextField from '@core/components/mui/TextField'
import { SxProps, Theme } from '@mui/material/styles'
import { BusinessType } from '@/types/apps/businessTypes'
import { getAllBusiness } from '@/api/business'
import toast from 'react-hot-toast'
import { createTemplate, createFlow } from '@/api/menu'

import { getFaceBookFlowsByBusinessId, getFaceBookTemplatesByBusinessId } from '@/api/templates'
import { FaceBookFlowDataType, FaceBookTemplateDataType } from '@/api/interface/templateInterface'
import { useParams } from 'next/navigation'
import { getWhatsAppQRByContact } from '@/api/whatsapp'
import { useSearchParams } from 'next/navigation' // Add this import

interface ActionCardProps {
  title: string
  description: string
  isDisabled?: boolean
  onClick: (businessId: number, contact_number?: string) => void
  businessId: number
  contact_number?: string
}

interface StyleProps {
  container: React.CSSProperties
  card: React.CSSProperties
  button: SxProps<Theme>
  text: SxProps<Theme>
  cardHeader: SxProps<Theme>
  headerContainer: React.CSSProperties
  selectContainer: React.CSSProperties
}

const styles: StyleProps = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    width: '100%'
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid #e5e7eb'
  },
  selectContainer: {
    minWidth: 200
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '20px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    transition: 'all 0.2s ease'
  },
  button: {
    textTransform: 'none',
    backgroundColor: '#3b82f6',
    '&:hover': {
      backgroundColor: '#2563eb'
    }
  },
  text: {
    fontWeight: 500,
    color: 'text.primary',
    mt: 1
  },
  cardHeader: {
    padding: 2,
    '& .MuiCardHeader-title': {
      fontSize: '1.25rem',
      fontWeight: 600
    }
  }
}
interface SelectedBusiness {
  id: number
  business_id: string
  contact_number: string
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  onClick,
  isDisabled,
  businessId,
  contact_number
}) => (
  <div style={styles.card}>
    <Button
      variant='contained'
      type='submit'
      // onClick={() => onClick(businessId)}
      onClick={() => onClick(businessId, contact_number)}
      disabled={isDisabled}
      sx={styles.button}
    >
      {title}
    </Button>
    <Typography variant='body1' sx={styles.text}>
      {description}
    </Typography>
  </div>
)

const EarningReports: React.FC = () => {
  const params = useParams()
  const searchParams = useSearchParams() // Add this
  // console.log(searchParams, 'searchParams')
  // console.log(params, 'params')

  const languageCode = params?.lang || 'en'

  const [data, setData] = useState<BusinessType[]>([])
  const [selectedBusinessData, setSelectedBusinessData] = useState<SelectedBusiness | null>(null)
  const [hasAddressFlow, setHasAddressFlow] = useState<boolean>(false)
  const [addressFlow, setAddressFlow] = useState<any>({})
  const [hasAddressTemplate, setHasAddressTemplate] = useState<boolean>(false)
  const [hasWelcomeTemplate, setHasWelcomeTemplate] = useState<boolean>(false)
  const [hasPendingOrderTemplate, setHasPendingOrderTemplate] = useState<boolean>(false)
  const [hasDeliveryOrPickupTemplate, setHasDeliveryOrPickupTemplate] = useState<boolean>(false)
  const [hasCatalogTemplate, setHasCatalogTemplate] = useState<boolean>(false)
  // const [isLoading, setIsLoading] = useState<boolean>(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [toastShown, setToastShown] = useState(false)
  const [isLoad, setIsLoad] = useState<boolean>(false)

  const fetchBusiness = async () => {
    try {
      const response = await getAllBusiness()
      const businesses = response?.data?.results || []
      setData(businesses)
      if (businesses.length > 0) {
        setSelectedBusinessData({
          id: businesses[0].id,
          business_id: businesses[0].business_id,
          contact_number: businesses[0].contact_number
          // contact_number
        })
      }
    } catch (err: any) {
      console.error('Failed to fetch business:', err.message)

      // toast.dismiss()
      // toast.error('Failed to fetch businesses.', { position: 'top-right' })
    }
  }

  const checkFlowsAndTemplates = async () => {
    if (!selectedBusinessData) return

    try {
      // Check flows
      const flowsResponse = await getFaceBookFlowsByBusinessId(selectedBusinessData.business_id)
      const flows = flowsResponse?.data || []
      const addressFlowExists = flows.some((flow: { is_address_flow: boolean }) => flow.is_address_flow)
      const addressFlows = flows.filter((flow: { is_address_flow: boolean }) => flow.is_address_flow)?.[0]
      // console.log('Filtered address flows:', addressFlows)
      setAddressFlow(addressFlows)
      setHasAddressFlow(addressFlowExists)

      // Check templates
      const templatesResponse = await getFaceBookTemplatesByBusinessId(selectedBusinessData.business_id)
      const templates = templatesResponse?.data || []

      const addressTemplateExists = templates.some(
        (template: FaceBookTemplateDataType) => template.template_name.trim() === 'address_form_for_customer_combinations'
      )
      setHasAddressTemplate(addressTemplateExists)
      const welcomeTemplateExists = templates.some(
        (template: FaceBookTemplateDataType) => template.template_name.trim() === 'welcome_template_3_en'
      )
      setHasWelcomeTemplate(welcomeTemplateExists)
      const pendingOrderTemplateExists = templates.some(
        (template: FaceBookTemplateDataType) => template.template_name.trim() === 'pending_order_template_3_en'
      )
      setHasPendingOrderTemplate(pendingOrderTemplateExists)
      const deliveryOrPickupTemplateExists = templates.some(
        (template: FaceBookTemplateDataType) => template.template_name.trim() === 'delivery_or_pickup_template_3_local_en'
      )
      setHasDeliveryOrPickupTemplate(deliveryOrPickupTemplateExists)
      const hasCatalogTemplateExists = templates.some(
        (template: FaceBookTemplateDataType) => template.template_name.trim() === 'catalog_template_2_en'
      )
      setHasCatalogTemplate(hasCatalogTemplateExists)
    } catch (err: any) {
      console.error('Failed to check flows and templates:', err.message)
      toast.error('Failed to fetch flow and template data.', { position: 'top-right' })
    }
  }

  useEffect(() => {
    fetchBusiness()
  }, [])

  useEffect(() => {
    if (selectedBusinessData) {
      checkFlowsAndTemplates()
    }
  }, [selectedBusinessData, isLoad])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedQrCodeUrl = localStorage.getItem('qr_code_url')
      if (storedQrCodeUrl) {
        setQrCodeUrl(storedQrCodeUrl)
      }
    }
  }, [])

  const handleBusinessChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedId = Number(event.target.value)
    const selectedBusiness = data.find(business => business.id === selectedId)

    if (selectedBusiness) {
      setSelectedBusinessData({
        id: selectedBusiness.id,
        business_id: selectedBusiness?.business_id,
        contact_number: selectedBusiness?.contact_number
      })
      setQrCodeUrl(null)
      localStorage.removeItem('qr_code_url')
    }
  }

  const handleFlowClick = (businessId: number): void => {
    setIsLoad(false)
    const payload = {
      flow_type: 'address',
      // name: 'address_flow',
      name: `kosmos_backend_germany_de_${languageCode}`,
      categories: ['OTHER'],
      business_id: businessId
    }
    createFlow(payload)
      .then(res => {
        setIsLoad(true)
        toast.success('Address Flow Created Successfully', { position: 'top-right' })
      })
      .catch(error => {
        toast.dismiss()
        toast.error(error?.data?.error, { position: 'top-right' })
      })
      .finally(() => {})
  }

  const handleAddressTemplateClick = (businessId: number): void => {
    setIsLoad(false)
    const payload = {
      name: `address_form_for_customer_combinations`,
      category: 'MARKETING',
      allow_category_change: true,
      language: 'en',

      components: [
        {
          type: 'HEADER',
          format: 'TEXT',
          text: 'Confirm Your Location!'
        },
        {
          type: 'BODY',
          text: "Please share your address with us. We will ensure your order reaches you safe and quick."
        },
        // {
        //   type: 'FOOTER',
        //   text: 'Tap the button below to provide your address.'
        // },

        {
          type: 'BUTTONS',
          buttons: [
            {
              type: 'FLOW',
              text: 'Enter Address',
              flow_id: addressFlow.flow_id
            }
          ]
        }
      ],
      flow_id: addressFlow.flow_id,
      business_id: businessId
    }
    createTemplate(payload)
      .then(res => {
        setIsLoad(true)
        toast.success('Address Template Created Successfully', { position: 'top-right' })
      })
      .catch(error => {
        toast.dismiss()
        toast.error(error?.data?.error, { position: 'top-right' })
      })
      .finally(() => {})
  }

  const handleWelcomeTemplateClick = (businessId: number): void => {
    setIsLoad(false)
    const payload = {
      // name: 'welcome_template',
      name: `privacy_policy_check_local_${languageCode}`,
      category: 'MARKETING',
      allow_category_change: true,
      language: 'en',

      components: [
        { type: 'HEADER', format: 'TEXT', text: 'Welcome to Kosmos!' },
        {
          type: 'BODY',
          text: `
          *Privacy Policy & Data Usage*  

Our app makes it easy for you to place orders. To enhance your experience, we collect and store certain data to provide better services.  

*How We Use Your Data*
1. *Order Fulfillment* – We store your address and phone number to ensure smooth and accurate delivery of your orders.  
2. *Data Deletion Requests* – You have full control over your data. If you wish to delete your information, simply send us a request, and we will permanently remove it within 30 days.  
4. *Third-Party Policies* – For details on Meta and WhatsApp’s privacy policies, please refer to their official documentation.  
5. *Your Privacy Matters* – We are fully *GDPR-compliant*. To learn more about how we store, use, and share your data, please read our *Privacy Policy* below.  

For any questions or concerns, feel free to contact us.
          `

          // Hi {{1}}, we're excited to have you with us! Enjoy exploring our offerings. Let us know if we can help you with anything.,
          //   example: { body_text: [['Mark']] }
        },
        // { type: 'FOOTER', text: "Thank you for choosing Whatseat. We're here for you!" },
        // {
        //   type: 'BUTTONS',
        //   buttons: [
        //     {
        //       type: 'URL',
        //       text: 'Shop Now',
        //       url: 'https://www.google.com/'
        //     }
        //   ]
        // }

        {
          type: 'BUTTONS',
          buttons: [
            // {
            //   type: 'URL',
            //   text: 'WhatsApp Privacy Policy',
            //   url: 'https://www.whatsapp.com/legal/privacy-policy' // ✅ Allowed
            // },
            {
              type: 'URL',
              text: 'Our Privacy Policy',
              url: 'https://themaskchat.com/terms-and-conditions/'
            },
            {
              type: 'QUICK_REPLY',
              text: 'I Agree'
            },
            {
              type: 'QUICK_REPLY',
              text: 'I Disagree' //
            }
          ]
        }
      ],

      business_id: businessId
    }
    createTemplate(payload)
      .then(res => {
        setIsLoad(true)
        toast.success('Welcome Template Created Successfully', { position: 'top-right' })
      })
      .catch(error => {
        toast.dismiss()
        toast.error(error?.data?.error, { position: 'top-right' })
      })
      .finally(() => {})
  }

  const handlePendingTemplateClick = (businessId: number): void => {
    setIsLoad(false)
    const payload = {
      // name: 'pending_order_template',
      name: `unprocessed_order_check_${languageCode}`,
      category: 'MARKETING',
      allow_category_change: true,
      language: 'en',

      components: [
        // {
        //   type: 'HEADER',
        //   format: 'TEXT',
        //   text: 'Unprocessed order from your last visit'
        // },
        {
          type: 'BODY',
          text: 'Unprocessed order from your last visit, Do you want to proceed with that? Tap an option below to proceed.'
        },
        // {
        //   type: 'FOOTER',
        //   text: 'Tap an option below to proceed.'
        // },
        {
          type: 'BUTTONS',
          buttons: [
            {
              type: 'QUICK_REPLY',
              text: 'Yes.'
            },
            {
              type: 'QUICK_REPLY',
              text: 'No, place a new order.'
            }
          ]
        }
      ],

      business_id: businessId
    }
    createTemplate(payload)
      .then(res => {
        setIsLoad(true)
        toast.success('Pending Order Template Created Successfully', { position: 'top-right' })
      })
      .catch(error => {
        // toast.dismiss()
        toast.error(error?.data?.error, { position: 'top-right' })
      })
      .finally(() => {})
  }

  const handleDeliveryOrPickupTemplateClick = (businessId: number): void => {
    // console.log('Security Template clicked for business:', businessId)
    setIsLoad(false)
    const payload = {
      // name: 'security_template',
      name: `delivery_or_pickup_template_3_local_${languageCode}`,
      category: 'MARKETING',
      allow_category_change: true,
      language: 'en',

      components: [
        // {
        //   type: 'HEADER',
        //   format: 'TEXT',
        //   text: 'Security'
        // },
        {
          type: 'BODY',
          text: `How would you like to receive your order?`
        },
        {
          type: 'BUTTONS',
          buttons: [
            {
              type: 'QUICK_REPLY',
              text: 'Delivery'
            }
            // {
            //   type: 'QUICK_REPLY',
            //   text: 'Pickup'
            // }
          ]
        }
      ],

      business_id: businessId
    }
    createTemplate(payload)
      .then(res => {
        setIsLoad(true)
        toast.success('Delivery or Pickup Template Created Successfully', { position: 'top-right' })
      })
      .catch(error => {
        toast.error(error?.data?.error, { position: 'top-right' })
      })
      .finally(() => {})
  }

  const handleCatalogTemplateClick = (businessId: number, contact_number?: string): void => {
    const payload = {
      // name: 'privacy_template',
      name: `catalog_template_2_${languageCode}`,
      category: 'MARKETING',
      allow_category_change: true,
      language: 'en',

      components: [
        {
          type: 'BODY',
          text: `Please click on the following link or the store icon on top right corner to open the catalogue. https://wa.me/c/${contact_number}`
        },
        {
          type: 'BUTTONS',
          buttons: [
            {
              type: 'QUICK_REPLY',
              text: 'View Catalog'
            }
          ]
        }
      ],

      business_id: businessId
    }

    // console.log('payload======', payload)
    createTemplate(payload)
      .then(res => {
        toast.success('Catalog Template Created Successfully')
      })
      .catch(error => {
        toast.dismiss()
        toast.error(error?.data?.error)
      })
      .finally(() => {})
  }

  const handleQRCodeClick = async (businessId: number, contact_number?: string): Promise<void> => {
    // console.log(contact_number, 'contact_number---------')

    if (!contact_number) {
      toast.error('Contact number is required to generate QR code.', { position: 'top-right' })
      return
    }
    try {
      const res = await getWhatsAppQRByContact(contact_number)

      const blob = res.data
      const url = URL.createObjectURL(blob)

      setQrCodeUrl(url)
      localStorage.setItem('qr_code_url', url)
      toast.success('QR Code Generated Successfully', { position: 'top-right' })
      setIsLoad(true)
    } catch (error: any) {
      console.error('Error generating QR code:', error)
    } finally {
    }
  }

  const getActions = (businessId: number, contact_number: string): ActionCardProps[] => [
    {
      title: 'Address Flow',
      description: 'Create your address flow for WhatsApp',
      onClick: handleFlowClick,
      businessId,
      contact_number,
      isDisabled: hasAddressFlow
    },
    {
      title: 'Address Template',
      description: 'Create your Address template for WhatsApp',
      onClick: handleAddressTemplateClick,
      businessId,
      contact_number,
      isDisabled: hasAddressTemplate || !hasAddressFlow
    },
    {
      title: 'Welcome Template',
      description: 'Create your welcome template for WhatsApp',
      onClick: handleWelcomeTemplateClick,
      businessId,
      contact_number,
      isDisabled: hasWelcomeTemplate
    },
    {
      title: 'Pending Order Template',
      description: 'Create your pending order template for WhatsApp',
      onClick: handlePendingTemplateClick,
      businessId,
      contact_number,
      isDisabled: hasPendingOrderTemplate
    },

    {
      title: 'Delivery  Or Pickup',
      description: 'Create your Delivery Or Pickup template for WhatsApp',
      onClick: handleDeliveryOrPickupTemplateClick,
      businessId,
      contact_number,
      isDisabled: hasDeliveryOrPickupTemplate
    },
    {
      title: 'Catalog Template',
      description: 'Create your Catalog template for WhatsApp',
      onClick: handleCatalogTemplateClick,
      businessId,
      contact_number,
      isDisabled: hasCatalogTemplate
    },
    {
      title: 'Generate QR',
      description: 'Create a WhatsApp Business QR',
      onClick: handleQRCodeClick,
      businessId,
      contact_number
      // isDisabled: hasAddressTemplate
    }
  ]

  return (
    <Card>
      <div style={styles.headerContainer}>
        <CardHeader title='Template and Flow' sx={styles.cardHeader} />
        <CustomTextField
          select
          id='business'
          label='Select Business'
          style={styles.selectContainer}
          value={selectedBusinessData?.id || ''}
          onChange={handleBusinessChange}
        >
          {data?.map(business => (
            <MenuItem key={business.business_id} value={business.id}>
              {business.business_id}
            </MenuItem>
          ))}
        </CustomTextField>
      </div>
      <CardContent>
        <div style={styles.container}>
          {selectedBusinessData &&
            getActions(selectedBusinessData.id, selectedBusinessData.contact_number).map((action, index) => (
              <ActionCard
                key={index}
                title={action.title}
                description={action.description}
                onClick={action.onClick}
                businessId={action.businessId}
                isDisabled={action.isDisabled}
                contact_number={action.contact_number}
              />
            ))}
        </div>

        {qrCodeUrl && (
          <div className='mt-4'>
            <img src={qrCodeUrl} alt='WhatsApp QR Code' className='w-48 h-48 border p-2' />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default EarningReports
