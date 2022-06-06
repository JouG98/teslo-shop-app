
import NextLink from 'next/link';
import { AddOutlined, ConfirmationNumberOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { Box, Button, CardMedia, Chip, Grid, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from 'swr';
import { AdminLayout } from '../../../components/layouts';
import { IOrder, IProduct, IUser } from '../../../interfaces';
import { routingPages } from '../../../utils';


const [ , , , , adminProduct ] = routingPages.adminPages;

const columns: GridColDef[] = [
    { field:'id', headerName: 'IDX', width: 10, align: 'center' },
    {
        field: 'img',
        headerName: 'Picture',
        renderCell: (params: GridValueGetterParams) => {
            return (
                <a
                    href={`/product/${params.row.slug}`}
                    target='_blank'
                    rel="noreferrer"
                >
                    <CardMedia 
                        component={'img'}
                        className='fadeIn'
                        image={params.row.img}
                        // image={`/products/${params.row.img}`}
                    /> 
                </a>
            )
        }
    },
    { 
        field: 'title', 
        headerName: 'title', 
        renderCell: (params: GridValueGetterParams) => {
            return (
                <NextLink
                    href={`/admin/products/${params.row.slug}`}
                    passHref
                >
                    <Link
                    
                    >
                       { params.row.title}
                    
                    </Link> 
                </NextLink>
            )
        }
    },
    { field: 'gender', headerName: 'gender', },
    { field: 'inStock', headerName: 'inStock', },
    { field: 'price', headerName: 'price', },
    { field: 'sizes', headerName: 'sizes', },


   

];


const ProductAdminPage = () => {

    const { data, error } = useSWR<IProduct[]>('/api/admin/products')
    // console.log(data)

    if(!data && !error ) return <></>

    const row = data!.map( (product, idx) =>({
        id: idx + 1,
        img: product.images[0],
        title: product.title,
        gender: product.gender,
        inStock: product.inStock,
        price: product.price,
        sizes: product.sizes.join(', '),
        slug: product.slug,
    }))


  return (
    <AdminLayout 
        pageDescription={adminProduct.description} 
        title={adminProduct.namePage} 
        subTitle={adminProduct.description} 
        icon={ <ConfirmationNumberOutlined /> }   
    >

        <Box
            sx={{display: 'flex', justifyContent: 'right'}}

        >
            <Button
                sx={{ mb: 2}}
                href='/admin/products/new'
                color='secondary'
                startIcon={ <AddOutlined />}
            >
                Create Product
            </Button>
        </Box>
        
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

export default ProductAdminPage