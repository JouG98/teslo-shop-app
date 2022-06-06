import { Box, Typography } from '@mui/material'
import React from 'react'
import { ShopLayout } from '../components/layouts';

const Custom404Page = () => {
  return (
    <ShopLayout 
        pageDescription={'Page no Found'} 
        title={'404 No Found'}
    >
        <Box
            display={`flex`}
            justifyContent={`center`}
            alignItems={`center`}
            alignContent={`center`}
            sx={{
                height: 'calc(100vh - 200px )',
                flexDirection: {
                    xs: 'column',
                    sm: 'row'
                }
            }}
        >
            <Typography
                variant='h1'
                component={`h1`}
                // fontSize={80}
                // fontWeight={200}
            >
                404 |
            </Typography>
            <Typography
                ml={2}
            >
                Page no found
            </Typography>
        </Box>
    </ ShopLayout>
  )
}

export default Custom404Page