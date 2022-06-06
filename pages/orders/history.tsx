import NextLink from 'next/link';
import { GetServerSideProps } from 'next'


import { Typography, Grid, Chip, Link, Button } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { ShopLayout } from '../../components/layouts';
import { CheckBoxOutlined, CreditScoreOutlined, CreditCardOffOutlined } from '@mui/icons-material';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import { FC } from 'react';



const columns: GridColDef[] = [
    { field: 'idx', headerName: 'IDX', width: 100, align: 'center',  },
    { field: 'fullname', headerName: 'Full Name', width: 300 },

    {
        field: 'paid',
        headerName: 'Paid',
        description: 'Displays information on whether the order is paid or not',
        width: 200,
        align: 'center',
        renderCell: (params: GridValueGetterParams) => {
            return (
                params.row.paid
                    ? <Chip sx={{ width:'80%',}} icon={ <CreditScoreOutlined />} color="success" label="Paid" variant='outlined' />
                    : <Chip sx={{ width:'80%',}} icon={ <CreditCardOffOutlined />} color="error" label="No Paid" variant='outlined' />
            )
        }
    },
    {
        field: 'order',
        headerName: 'View order',
        width: 200,
        sortable: false,
        align: 'center',
        renderCell: (params: GridValueGetterParams) => {
            return (
               <NextLink href={`/orders/${ params.row.id }`} passHref>
                    <Link>
                        <Button
                            startIcon={ <CheckBoxOutlined /> }
                            className={`circular-btn`}
                        >
                            Ver orden
                        </Button>
                    </Link>
               </NextLink>
            )
        }
    }
];



interface Props {
    orders : IOrder[];
}

const HistoryPage: FC<Props>  = ({orders}) => {
    // console.log(orders)

    const orderRow = orders.map( (order, idx) => ({
        id: order._id,
        idx: idx +1,
        paid: order.isPaid,
        fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        // order: order._id!,
    }));
    // console.log(orderRow);

  return (
    <ShopLayout title={'Order history'} pageDescription={'Customer order history'}>
        <Typography variant='h1' component='h1'>Order history</Typography>


        <Grid container mt={1}>
            <Grid mt={1} item xs={12} sx={{ height:650, width: '100%' }}>
                <DataGrid 
                    rows={ orderRow }
                    columns={ columns }
                    pageSize={ 10 }
                    rowsPerPageOptions={ [10] }
                />

            </Grid>
        </Grid>

    </ShopLayout>
  )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req}) => {

    const session: any = await getSession({ req });

    if(!session){
        return{
            redirect:{
                destination: `/`,
                permanent: false,
            }
        }
    }

    const orders = await dbOrders.getByUserOrder(session.user._id);

    if(!orders){
        return{
            redirect:{
                destination: `/`,
                permanent: false,
            }
        }
    }

    return {
        props: {
            orders
        }
    }
}

export default HistoryPage