import { useContext, useEffect } from 'react';

import { useRouter } from 'next/router';

import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';

import { CartContext } from '../../context';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { CartList, OrderSummary } from '../../components/cart';
import { routingPages } from '../../utils';

const CartPage = () => {

    const { cart, isLoaded } = useContext(CartContext);

    const router = useRouter();

    const { description, namePage } = routingPages.cartPages[0];

    // Ir a empty si no tiene nada en el cart
    useEffect(() => {
        if( isLoaded && cart.length === 0){
            router.replace(routingPages.cartPages[1].path);
        }
      
    }, [isLoaded, cart, router]);

    if( !isLoaded  || cart.length === 0 ){
        return <></>;
    }
    
  return (
    <ShopLayout title={ namePage } pageDescription={ description }>
        <Typography variant='h1' component='h1'>
             {
                 namePage
             }
        </Typography>

        <Grid container mt={1}>

            {/* Card List - component */}
            <Grid item xs={ 12 } sm={ 7 }>
                <CartList editable />
            </Grid>

            <Grid item xs={ 12 } sm={ 5 }>

                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>Order</Typography>
                        <Divider sx={{ my:1 }} />
                        
                        {/* Order Summary - component */}
                        <OrderSummary />

                        {/* Button Checkout */}
                        <Box sx={{ mt: 3 }}>
                            <Button 
                                color="secondary" 
                                className='circular-btn' 
                                fullWidth
                                href={ routingPages.checkoutPages[0].path }
                                // href='/checkout/address'
                            >
                                Checkout
                            </Button>
                        </Box>

                    </CardContent>
                </Card>

            </Grid>
        </Grid>


    </ShopLayout>
  )
}

export default CartPage;