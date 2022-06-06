import React from 'react'
import { Avatar, Box, capitalize, Typography } from '@mui/material'
import { useContext } from 'react';
import { AuthContext } from '../../context';
import { IUser } from '../../interfaces';
import { ToogleTheme } from './ToogleTheme';

export const InfoUser = () => {

    const { user } = useContext(AuthContext);
    const { name, email, picture, rol} = user as IUser;

  return (
    <Box
        pl={2}  
        textAlign='center'  
        display={'flex'}
        // flexDirection='column'
    >

        <Avatar 
            // imgProps={ picture }
            sx={{
                width: '60px',
                height: '60px',
                border: 'solid 1px black'
            }}
            src={ picture }
        />

        <Box
            display={'flex'}
            flexDirection='column'
            alignItems={'start'}
            ml={2}
            mt={1}
        >
            <Typography
                variant='body1'
            >
                { name }
            </Typography>
            {/* <Typography>
                { email }
            </Typography> */}
            <Typography
                // variant='body2'
                variant="subtitle2"
                // color=''
            >
                { capitalize( rol) }
            </Typography>
        </Box>

            <ToogleTheme />
        
    </Box>
  )
}
