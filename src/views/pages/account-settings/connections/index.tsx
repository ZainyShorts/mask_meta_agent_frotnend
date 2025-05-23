'use client'

// MUI Imports

import Grid from '@mui/material/Grid'

import WhatsAppCard from '@/components/WhatsAppCard'

import WhatsppAppListTable from '@/views/apps/user/list/WhatsAppListTable'
import InstagramTableList from '@/views/apps/user/list/InstagramListTable'
import InstagramCard from '@/components/InstagramCard'
import FaceBookCard from '@/components/FaceBookCard'
import FaceBookListTable from '@/views/apps/user/list/FaceBookListTable'
import TelagramListTable from '@/views/apps/user/list/TelagramListTable'
import FeedToGptListTable from '@/views/apps/user/list/FeedToGptListTable'
import ChatGptListTable from '@/views/apps/user/list/ChatGptListTable'

const Connections = () => {
  return (
    <Grid container spacing={4}>
      {/* <Grid item xs={12} md={6}>
        <WhatsAppCard />
      </Grid>
      <Grid item xs={12} md={6}>
        <InstagramCard />
      </Grid>
      <Grid item xs={12} md={6}>
        <FaceBookCard />
      </Grid> */}

      <Grid item xs={12}>
        <FeedToGptListTable />
      </Grid>
      <Grid item xs={12}>
        <WhatsppAppListTable />
      </Grid>
      <Grid item xs={12}>
        <ChatGptListTable />
      </Grid>
      <Grid item xs={12}>
        <FaceBookListTable />
      </Grid>
      <Grid item xs={12}>
        <InstagramTableList />
      </Grid>
      <Grid item xs={12}>
        <TelagramListTable />
      </Grid>
    </Grid>
  )
}

export default Connections
