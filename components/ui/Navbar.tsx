import { useContext, useState } from 'react';

import NextLink from 'next/link'
import { useRouter } from 'next/router';

import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from '@mui/material';
import { ClearOutlined, MenuOpenOutlined, SearchOutlined, ShoppingCartOutlined, } from '@mui/icons-material'

import { UIContext, CartContext } from '../../context';
import { ToogleTheme } from './ToogleTheme';

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


export const Navbar = () => {

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
                
                {/* Menu - pages */}
                {
                    linkCategories.map( data => (
                        <Box
                            key={data.title}
                            sx={{
                                display:{
                                    // Puedo ocultar los item directamente
                                    xs: 'none',
                                    sm: 'block'
                                }
                            }}
                        >
                            <NextLink
                                href={ data.url}
                                passHref
                            >
                                <Link>
                                    <Button
                                    // sx={
                                    //     color: { (a === data.url) ? 'secondary' : undefined}
                                    // }
                                        color={ (a === data.url) ? 'secondary' : undefined}
                                    >
                                        { data.title }
                                    </Button>
                                </Link>
                            </NextLink>
                        </Box>

                    ))
                }

            {/* Separacion de cajas */}
            <Box flex={ 1 } />



            {/* Pantallas pantallas grandes */}
            {
                    isSearchVisible 
                        ? (
                            <Input
                                sx={{ display: { xs: 'none', sm: 'flex' } }}
                                className='fadeIn'
                                autoFocus
                                value={ searchTerm }
                                onChange={ (e) => setSearchTerm( e.target.value ) }
                                onKeyPress={ (e) => e.key === 'Enter' ? onSearchTerm() : null }
                                type='text'
                                placeholder="Buscar..."
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={ () => setIsSearchVisible(false) }
                                        >
                                            <ClearOutlined />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        )
                    : 
                    (
                        <IconButton 
                            onClick={ () => setIsSearchVisible(true) }
                            className="fadeIn"
                            sx={{ display: { xs: 'none', sm: 'flex' } }}
                        >
                            <SearchOutlined />
                        </IconButton>
                    )
                }


                {/* Pantallas pequeñas */}
                <IconButton
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                    onClick={ toogleSideMenu }
                >
                    <SearchOutlined />
                </IconButton>


            {/* Link de carrito de compras */}
            <NextLink
                href={`/cart`}
                passHref
            >
                <Link>
                    <IconButton>
                        <Badge // etiqueta de material para mostrar # elemetos del carrito
                            badgeContent={ valueItems > 9 ? '+9': valueItems }
                            color={ `secondary` }
                        >
                            <ShoppingCartOutlined />
                        </Badge>
                    </IconButton>
                </Link>
            </NextLink>
            
            {/* Menu - SideMenu */}
            {/* <Button 
                endIcon={ <MenuOpenOutlined />} 
                sx={{ ml: 1}}
                onClick={ toogleSideMenu }
            >
                Menu
            </Button> */}

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
