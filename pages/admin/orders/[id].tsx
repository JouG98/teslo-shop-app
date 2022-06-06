import { CreditCardOffOutlined, CreditScoreOutlined, People } from '@mui/icons-material';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import React, { useState } from 'react'
import orders from '.';
import { AdminLayout } from '../../../components/layouts';
import { dbOrders } from '../../../database';
import { routingPages, validations } from '../../../utils';
import { IOrder } from '../../../interfaces/order';
import { Box, Card, CardContent, Chip, CircularProgress, Grid } from '@mui/material';
import { CartList, SummaryHeader, DeliveryAddressContent, OrderSummary } from '../../../components/cart';
import { CustomPayPalBtn } from '../../../components/payment';

const [ , , , adminOrder] = routingPages.adminPages;
const [ login ] = routingPages.authPages;

interface Props {
    order: IOrder;
}

const AdminOrderById: NextPage<Props> = ({order}) => {
    console.log(order)

    const { isPaid, orderItems, orderSumary, shippingAddress } = order;
    const [isPaying, setIsPaying] = useState(false);

    

  return (
    <AdminLayout 
        pageDescription={adminOrder.description} 
        title={adminOrder.namePage} 
        subTitle={adminOrder.description} 
        icon={ < People />}        
    >

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

                    </Box>


                </Box>

            </CardContent>
        </Card>
    </Grid>
</Grid>


    </AdminLayout>
  )
}


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = '' } = query as {id: string};

    // session
    const session = await getSession({ req }); // error x el tipado, pero funciona
    // // console.log({session});

    if(!session){
        return{
            redirect: {
                destination: `${login.path}?p=${adminOrder.path}/${id}`, // al login
                permanent: false,
            }
        }
    }

    const order = await dbOrders.getOrderById(id.toString());
    // console.log({order});

    if(!order){
        return{
            redirect:{
                destination: `${adminOrder.path}`, // history
                permanent: false,
            }
        }
    }

    // const { _id = '' } = session.user as { _id: string }

    // const { user = '' } = order;
    // const isValidSession = validations.isSessionValid( user.toString(), _id);

    
    // if( !isValidSession  ){
    //     return{
    //         redirect:{
    //             destination: `${history.path}`, // history
    //             permanent: false,
    //         }
    //     }
    // }



    return {
        props: {
            order,
        }
    }
}

export default AdminOrderById;