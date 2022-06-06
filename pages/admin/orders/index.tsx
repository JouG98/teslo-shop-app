import { AdminLayout } from '../../../components/layouts';
import { routingPages } from '../../../utils';
import { ConfirmationNumberOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from 'swr';
import { IOrder } from '../../../interfaces/order';
import { IUser } from '../../../interfaces';

const [ , , adminOrder ] = routingPages.adminPages;

const columns: GridColDef[] = [
    { field:'id', headerName: 'Order ID', width: 250,  },
    { field:'email', headerName: 'Email', width: 250,  },
    { field:'name', headerName: 'Full Name', width: 250,  },
    { field:'total', headerName: 'Total', width: 250,  },
    {
        field: 'isPaid',
        headerName: 'Paid',
        description: 'Displays information on whether the order is paid or not',
        width: 200,
        align: 'center',
        renderCell: (params: GridValueGetterParams) => {
            return (
                params.row.isPaid
                ? <Chip sx={{ width:'80%',}} icon={ <CreditScoreOutlined />} color="success" label="Paid" variant='outlined' />
                : <Chip sx={{ width:'80%',}} icon={ <CreditCardOffOutlined />} color="error" label="No Paid" variant='outlined' />
            )
        }
    },
    { field:'noProduct', headerName: 'N° Product', width: 250,  },
    {
        field: 'check',
        headerName: 'View Order',
        renderCell: (params: GridValueGetterParams) => {
            return (
                <a
                    href={`/admin/orders/${params.row.id}`}
                    target='_blank'
                    rel="noreferrer"
                >
                    View Orer
                </a>
            )
        }   
    }

];

interface IResponse {
    ok: boolean,
    msg: string,
    orders: IOrder[],
}

const OrdersPage = () => {

    const { data, error } = useSWR<IResponse>('/api/admin/orders')

    if(!data && !error ) return <></>

    const row = data!.orders.map( order =>({
        id    :order._id ,
        email :(order.user as IUser).email ,
        name  :(order.user as IUser).name ,
        total :order.orderSumary.total ,
        isPaid  :order.isPaid ,
        noProduct:order.orderSumary.valueItems,
        createdAt: order.createdAt,
    }))


  return (
    <AdminLayout 
        pageDescription={adminOrder.description} 
        title={adminOrder.namePage} 
        subTitle={adminOrder.description} 
        icon={ <ConfirmationNumberOutlined /> }   
    >

        <Grid container mt={1}>
            <Grid mt={1} item xs={12} sx={{ height:650, width: '100%' }}>
                <DataGrid 
                    rows={ row }
                    columns={ columns }
                    pageSize={ 10 }
                    rowsPerPageOptions={ [10] }
                />

            </Grid>
        </Grid>
        
    </AdminLayout>
  )
}

export default OrdersPage