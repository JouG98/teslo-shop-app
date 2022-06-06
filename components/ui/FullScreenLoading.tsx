import { Box, CircularProgress, Typography } from '@mui/material'
import React from 'react'

export const FullScreenLoading = () => {
  return (
    <Box
        display={`flex`}
        justifyContent={`center`}
        alignItems={`center`}
        flexDirection={`column`}
        alignContent={`center`}
        height = 'calc(100vh - 200px )'
        // sx={{
        //     height: 'calc(100vh - 200px )',
        //     flexDirection: {
        //         xs: 'column',
        //         sm: 'row'
        //     }
        // }}
    >
        <Typography
            variant='h2'
            mb={3}
            fontSize={20}
            fontWeight={200}
        >
            Loading...
        </Typography>
       
       <CircularProgress thickness={2} />
    </Box>
  )
}
