import { useContext, useEffect, useState } from 'react';

import NextLink from 'next/link';
import { useRouter } from 'next/router';


import { Link, Box, Button, Card, CardContent, Divider, Grid, Typography, Chip } from '@mui/material';
import { ModeEditOutlineRounded } from '@mui/icons-material';

import Cookie from 'js-cookie';
import { CartContext } from '../../context';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { CartList, DeliveryAddressContent, OrderSummary, SummaryHeader } from '../../components/cart';
import { countries, routingPages } from '../../utils';


const SummaryPage = () => {

    const { shippingAddress, orderSumary, createOrder } = useContext(CartContext);
    const { push, replace } = useRouter();

    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { description, namePage } = routingPages.checkoutPages[1];
    const { path } = routingPages.ordersPages[0];

    // Si no tienen datos de direccion regresa a address
    useEffect(() => {
      
        if( !Cookie.get('data') ){
            // push('/checkout/address')
            push(routingPages.checkoutPages[0].path)
        }
        
    }, [push]);
    

    if( !shippingAddress) {
        return <></>;
    }

    const { firstName,
            lastName,
            address,
            address2,
            zipCode,
            city,
            country,
            phone,
    } = shippingAddress;

    const onCreateOrder = async( ) => {

        // bloquear el btn
        setIsPosting(true);

        const { hasError, msg } = await createOrder();

        if ( hasError ){
            setIsPosting(false);
            setErrorMessage(msg);
            return
        }

        replace(`${path}/${msg}`)
    }
 
  return (
    <ShopLayout title={namePage} pageDescription={description}>

        <Typography variant='h1' component='h1'> {namePage} </Typography>

        <Grid container mt={1}>

            {/* CardList - Component */}
            <Grid item xs={ 12 } sm={ 7 }>
                <CartList />
            </Grid>

            {/* CardSummary */}
            <Grid item xs={ 12 } sm={ 5 }>
                <Card className='summary-card'>
                    <CardContent>

                        {/* Summary Header */}
                        <SummaryHeader />


                        {/* Delevery Address */}
                        <DeliveryAddressContent />

                    
                        <OrderSummary />

                        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column'}}>
                            <Button 
                                color="secondary" 
                                className='circular-btn' 
                                fullWidth
                                onClick={ onCreateOrder }
                                disabled={ isPosting }
                            >
                                Confirm Order
                            </Button>

                            <Chip 
                                label={ errorMessage }
                                color='error'
                                sx={{
                                    mt: 2,
                                    display: errorMessage ? 'flex':'none'
                                }}
                            /> 
                        </Box>

                    </CardContent>
                </Card>
            </Grid>

        </Grid>


    </ShopLayout>
  )
}

export default SummaryPage;