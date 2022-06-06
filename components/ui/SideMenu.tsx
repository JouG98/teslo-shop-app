import { ChangeEvent, KeyboardEvent, useContext, useState } from 'react';
import { useRouter } from "next/router";

import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"
import { AuthContext, UIContext } from '../../context';
import { InfoUser } from './InfoUser';
import { routingPages } from '../../utils';

const [ order, history] = routingPages.ordersPages;

export const SideMenu = () => {

    const { isLogged, user, logout } = useContext(AuthContext);

    const {isToogleSideMenu, toogleSideMenu } = useContext(UIContext);


    const route = useRouter();

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchTerm = ( {target} : ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchTerm( target.value )
    }

    const onKeyPress = ( e: KeyboardEvent<HTMLDivElement>) => {
        ( e.key === 'Enter') ? onSearchTerm() : null
    }

    const onSearchTerm = () => {

        if (searchTerm.trim().length === 0 ) return;

        navigateTo(`/search/${searchTerm}`);
        setSearchTerm('')

    }

    const navigateTo = ( url: string ) => {
        toogleSideMenu();
        // setSearchTerm('')
        route.push(url);
    }

  return (
    <Drawer
        open={ isToogleSideMenu }
        anchor='right'
        sx={{ 
            backdropFilter: 'blur(4px)', // Poner el fondo desenfocado
            transition: 'all 0.5s ease-out' 
        }}
        onClose={ toogleSideMenu }
    >
        <Box sx={{ width: 250, paddingTop: 5 }}>

{
    isLogged &&
    <InfoUser />

}
            
            <List>
                

                {/* Caja de busqueda */}
                <ListItem>
                    <Input
                        autoFocus
                        type='text'
                        value={ searchTerm }
                        onChange={ handleSearchTerm }
                        onKeyPress={ onKeyPress }
                        placeholder="Buscar..."
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={  onSearchTerm }
                                >
                                 <SearchOutlined />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </ListItem>
                
                {/* Items Perfil Ordenes */}

                {
                    isLogged &&(
                        <>
                            <ListItem 
                                button
                                // onClick={ () => navigateTo('/orders/history')}
                            >
                                <ListItemIcon>
                                    <AccountCircleOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Perfil'} />
                            </ListItem>

                            <ListItem 
                                button 
                                onClick={ () => navigateTo( history.path )}
                                // onClick={ () => navigateTo('/orders/history')}
                            >
                                <ListItemIcon>
                                    <ConfirmationNumberOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Mis Ordenes'} />
                            </ListItem>
                        </>
                    )
                }

                {/* Menu del Navbar para movil */}
                <ListItem 
                    button 
                    sx={{ 
                        display: { xs: '', sm: 'none' }, 
                        // color : `secondary` 
                    }}
                    color='secondary'
                    onClick={ () => navigateTo('/category/men')}
                    // color={ `secondary`}
                >
                    <ListItemIcon>
                        <MaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Hombres'} />
                </ListItem>

                <ListItem 
                    button 
                    sx={{ display: { xs: '', sm: 'none' } }}
                    onClick={ () => navigateTo('/category/women')}
                    color={ route.asPath === '/category/women' ? 'secondary' : undefined}
                >
                    <ListItemIcon>
                        <FemaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Mujeres'} />
                </ListItem>

                <ListItem 
                    button 
                    sx={{ display: { xs: '', sm: 'none' } }}
                    onClick={ () => navigateTo('/category/kid')}
                    color={ route.asPath === '/category/kid' ? 'secondary' : undefined}
                >
                    <ListItemIcon>
                        <EscalatorWarningOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Niños'} />
                </ListItem>

                {/* Items Ingresar y salir */}

                {
                    isLogged ? (
                        <ListItem button onClick={ logout }>
                            <ListItemIcon>
                                <LoginOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Salir'} />
                        </ListItem>

                    ) : (

                        <ListItem button onClick={ () => navigateTo(`/auth/login?p=${ route.asPath }`) }>
                            <ListItemIcon>
                                <VpnKeyOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Ingresar'} />
                        </ListItem>
                    )
                }


                {
                    user?.rol === 'admin' && (
                        <>
                            {/* Admin */}
                            <Divider />
                            <ListSubheader>Admin Panel</ListSubheader>

                            <ListItem button onClick={ () => navigateTo(`/admin/products`)}>
                                <ListItemIcon>
                                    <CategoryOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Productos'} />
                            </ListItem>

                            <ListItem button onClick={ () => navigateTo(`/admin/orders`)}>
                                <ListItemIcon>
                                    <ConfirmationNumberOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Ordenes'} />
                            </ListItem>

                            <ListItem button onClick={ () => navigateTo(`/admin/user`)}>
                                <ListItemIcon>
                                    <AdminPanelSettings/>
                                </ListItemIcon>
                                <ListItemText primary={'Usuarios'} />
                            </ListItem>
                        
                        </>
                    )
                }

            </List>
        </Box>
    </Drawer>
  )
}