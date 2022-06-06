import { GetServerSideProps, NextPage } from 'next'
import {useState} from 'react';
import NextLink from 'next/link';

import { Link, Box, Card, CardContent, Divider, Grid, Typography, Chip, Button, CircularProgress } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined, ModeEditOutlineRounded } from '@mui/icons-material';

import { ShopLayout } from '../../components/layouts/ShopLayout';
import { CartList, DeliveryAddressContent, OrderSummary, SummaryHeader } from '../../components/cart';
import { IOrder } from '../../interfaces';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { routingPages, validations } from '../../utils';
import { IUser } from '../../interfaces/user';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { CustomPayPalBtn } from '../../components/payment';


interface Props {
    order: IOrder;
}

const { authPages, ordersPages } = routingPages;

const [ login ] = authPages;
const [ orders, history ] = ordersPages;

const OrderPage: NextPage<Props> = ({ order }) => {
    // console.log({order})

    const { isPaid, orderItems, orderSumary, shippingAddress } = order;
    const [isPaying, setIsPaying] = useState(false);

  return (
    <ShopLayout title={ orders.namePage } pageDescription={ orders.description}>
        <Typography variant='h1' component='h1'> {orders.namePage}: {order._id }</Typography>

        {/* Icons Pago */}
        {
            isPaid ?(
                <Chip
                    sx={{ my: 2 }}
                    label="Order has been paid"
                    variant='outlined'
                    color="success"
                    icon={ <CreditScoreOutlined /> }
                />
            ) :
            (
                <Chip
                    sx={{ my: 2 }}
                    label="Pendiente de pago"
                    variant='outlined'
                    color="error"
                    icon={ <CreditCardOffOutlined /> }
                />

            )
        }

       

        <Grid container>

            {/* CartLis : Componenst */}
            <Grid item xs={ 12 } sm={ 7 }>
                <CartList items={orderItems} />
            </Grid>

            {/* Card Summary: component */}
            <Grid item xs={ 12 } sm={ 5 }>
                <Card className='summary-card'>
                    <CardContent>

                        {/* Summary Header */}
                        <SummaryHeader 
                            valueItemsOfOrder={ orderSumary.valueItems }
                        />

                        {/* Delevery Address */}
                        <DeliveryAddressContent 
                            shippingAddresOfOrder={ shippingAddress }
                        />


                        {/* Order Summary Component */}
                        <OrderSummary 
                            orderSummaryOfOrder={orderSumary}
                        />

                        {/* Pago */}
                        <Box sx={{ mt: 3 }} display='flex' flexDirection={'column'}>
                            {/* TODO */}

                            <Box display="flex"
                                justifyContent="center"
                                className='fadeIn'
                                sx={{ display: isPaying ? 'flex': 'none' }}>
                                <CircularProgress />
                            </Box>

                            <Box flexDirection='column' sx={{ display: isPaying ? 'none': 'flex', flex: 1 }} >
                                {
                                    isPaid ? (
                                        <Chip
                                            sx={{ my: 2 }}
                                            label="Orden ya fue pagada"
                                            variant='outlined'
                                            color="success"
                                            icon={ <CreditScoreOutlined /> }
                                        />

                                    ) : (
                                        // <h1>Pagar</h1>

                                    <CustomPayPalBtn 
                                            mount={ orderSumary.total }
                                            orderId={ order._id! }
                                            setIsPaying={setIsPaying}
                                    />
                                    )
                                }

                            </Box>


                        </Box>

                    </CardContent>
                </Card>
            </Grid>
        </Grid>


    </ShopLayout>
  )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = '' } = query as {id: string};

    // session
    const session = await getSession({ req }); // error x el tipado, pero funciona
    // // console.log({session});

    if(!session){
        return{
            redirect: {
                destination: `${login.path}?p=${orders.path}/${id}`, // al login
                permanent: false,
            }
        }
    }

    const order = await dbOrders.getOrderById(id.toString());
    // console.log({order});

    if(!order){
        return{
            redirect:{
                destination: `${history.path}`, // history
                permanent: false,
            }
        }
    }

    const { _id = '' } = session.user as { _id: string }

    const { user = '' } = order;
    const isValidSession = validations.isSessionValid( user.toString(), _id);

    
    if( !isValidSession  ){
        return{
            redirect:{
                destination: `${history.path}`, // history
                permanent: false,
            }
        }
    }



    return {
        props: {
            order,
        }
    }
}

export default OrderPage;