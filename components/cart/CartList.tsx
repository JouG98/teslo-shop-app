import { FC, useContext } from 'react';

import NextLink from 'next/link';
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Paper, Typography } from '@mui/material';

import { CartContext } from '../../context';
import { ItemCounter } from '../ui';
import { IOrderItems } from '../../interfaces';



interface Props {
    editable ?: boolean;
    items    ?: IOrderItems[];
}

export const CartList: FC<Props> = ({ editable = false, items }) => {

    const { cart, updateQuantityProduct, removerCartProduct } = useContext(CartContext);

    const productShow = items ? items : cart; 

  return (
    <Paper
        sx={{
            mr: '1rem',
            padding: '.7rem',
            height: '570px',
            background: 'none',
            overflowY: 'auto',

            // scrollbar
            
            '&::-webkit-scrollbar': { 
                display: 'auto' ,
                width: '.40rem',
            },
            '&::-webkit-scrollbar-thumb': { 
                borderRadius: '.2rem',
                background: '#323232',
            },
            '&::-webkit-scrollbar-thumb:hover': { 
                background: '#707070',
            },
        }}
    >
        {
            productShow.map( product => (
                <Grid 
                    container 
                    spacing={2} 
                    key={ product.slug + product.size } 
                    sx={{ mb:1 }}
                >
                    {/* Imagen */}
                    <Grid item xs={3}>
                        {/* TODO: llevar a la página del producto */}
                        <NextLink href={`/product/${product.slug}`} passHref>
                            <Link>
                                <CardActionArea>
                                    <CardMedia 
                                        image={ product.images }
                                        component='img'
                                        sx={{ borderRadius: '5px' }}
                                    />
                                </CardActionArea>
                            </Link>
                        </NextLink>
                    </Grid>

                    {/* Contenido */}
                    <Grid item xs={7}>
                        <Box 
                            display='flex' 
                            flexDirection='column'
                        >
                            <Typography variant='body1'>{ product.title }</Typography>
                            <Typography variant='body1'>Talla: <strong> { product.size } </strong></Typography>

                            {
                                editable 
                                ? <ItemCounter 
                                    currentValue={ product.quantity }
                                    updateQuantity={ (n) => updateQuantityProduct(product, n) }
                                    maxValue={ 20 }      
                                />
                                : <Typography variant='h5'>
                                    {
                                        product.quantity >1
                                        ? `${product.quantity} Items`
                                        : `${product.quantity} Item`
                                    }  
                                  </Typography>
                            }
                            
                        </Box>
                    </Grid>

                    {/* Precio */}
                    <Grid 
                        item xs={2}
                        display='flex' 
                        alignItems='center' 
                        justifyContent={`center`}
                        flexDirection='column'
                    >
                        <Typography variant='subtitle1'>{ `$${ product.quantity * product.price }` }</Typography>
                        
                        {
                            editable && (
                                <Button 
                                    variant='text' 
                                    color='secondary' 
                                    onClick={ ( ) =>  removerCartProduct(product)}
                                >
                                    Remover
                                </Button>
                            )
                        }
                    </Grid>
                    
                </Grid>
            ))
        }
    </Paper>
  )
}
