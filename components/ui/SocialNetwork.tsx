import React, { useEffect, useState } from 'react'

import { getProviders, signIn } from 'next-auth/react';

import { Google, Facebook, GitHub } from '@mui/icons-material'
import { Grid, Fab } from '@mui/material'

export const SocialNetwork = () => {

    const [providers, setProviders] = useState<any>({})

    useEffect(() => {
      
        getProviders().then(prov => {
            // console.log({prov})
            setProviders(prov)
        })
    }, [])
    
  return (
    <Grid item xs={12} display='flex' justifyContent='space-between' flexDirection={`row`}>

        {/* {
            Object.values( providers ).map( (provider: any) => {

                if( provider.id ===  'credentials'){
                    return(
                        <div key={ provider.id } ></div>
                    )
                }

                return( 
                    <Fab
                        key={ provider.id}

                        onClick={ () => signIn(provider.id)}
                    >

                    </Fab>
                )
            })  
            
        } */}

        <Fab 
            size='small'
            onClick={ () => signIn(providers.google.id)}
        >
            <Google 
                fontSize='medium' 
                sx={{
                    fontSize: '30px',
                    color: '#dc4e41'
                
                }}
            />
        </Fab>

        <Fab
            size='small'
            onClick={ () => signIn(providers.facebook.id)}
        >
            <Facebook 
                fontSize='medium' 
                sx={{
                    fontSize: '30px',
                    borderRadius: '100%',
                    color: '#31487D'
                }} 
            />
        </Fab>

        <Fab
            size='small' 
            onClick={ () => signIn(providers.github.id)}
        >
            <GitHub 
                sx={{
                    fontSize: '30px',
                    color: '#00405d'
                }}
            />
        </Fab>
    </Grid>
  )
}
