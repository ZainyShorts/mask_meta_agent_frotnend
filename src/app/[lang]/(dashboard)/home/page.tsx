// MUI Imports
import Grid from '@mui/material/Grid'
import TemplateActionsCards from './TemplateActions/TemplateActionsCards'

export default function HomePage() {
  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TemplateActionsCards />
        </Grid>
      </Grid>
    </>
  )
}
