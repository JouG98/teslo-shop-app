import { useContext, useState } from 'react';

import NextLink from 'next/link'
import { useRouter } from 'next/router';

import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from '@mui/material';
import { ClearOutlined, MenuOpenOutlined, SearchOutlined, ShoppingCartOutlined, } from '@mui/icons-material'

import { UIContext, CartContext } from '../../context';
import { ToogleTheme } from '../ui/ToogleTheme';

const path = `/category`
const linkCategories = [
    {
        url: `${path}/men`,
        title: `Men`
    },
    {
        url: `${path}/women`,
        title: `Women`
    },
    {
        url: `${path}/kid`,
        title: `Kids`
    },
    {
        url: `${path}/unisex`,
        title: `Unisex`
    },
   
    
]


export const AdminNavbar = () => {

    const { toogleSideMenu } = useContext(UIContext);
    const { orderSumary } = useContext(CartContext);
    const { valueItems } = orderSumary;

    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');


    /**
     *  isCurrenTheme : true : light
     *  isCurrenTheme : false : dark
     */
    
    const router = useRouter();
    const a = router.route;

    const onSearchTerm = () => {

        if (searchTerm.trim().length === 0 ) return;

        router.push(`/search/${searchTerm}`);
        setSearchTerm('')

    }


  return (
    <AppBar>
        <Toolbar>

            {/* Teslo | Shop  - link  */}
            <NextLink
                href={`/`}
                passHref // para que pase la ruta al link de material
            >
                <Link
                    display={`flex`}
                    alignItems={`center`}
                >
                    <Typography variant='h6'>
                        Teslo | 
                    </Typography>

                    <Typography
                        sx={{
                            ml: .5
                        }}
                    >
                        Shop
                    </Typography>
                </Link>
            </NextLink>

            {/* Icons to themes */}
           <ToogleTheme />

            {/* Separacion de cajas */}
            <Box flex={ 1 } />
                
              
            {/* Menu - SideMenu */}
            <IconButton
                sx={{ ml: 1}}
                onClick={ toogleSideMenu }
            >
                <MenuOpenOutlined />
            </IconButton>

        </Toolbar>
    </AppBar>
  )
}
