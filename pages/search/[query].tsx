import type { NextPage, GetServerSideProps } from 'next'

import { Box, Typography } from '@mui/material'

import { ShopLayout } from '../../components/layouts'
import { ProductsList } from '../../components/products'

import { dbProducts } from '../../database'
import { IProduct } from '../../interfaces'
import { routingPages } from '../../utils'

interface Props {
    products      : IProduct[];
    query         : string;
    foundProduct  : boolean;
}

const SearchPageQ: NextPage <Props> = ( { products, query, foundProduct }) => {

  const { namePage, description } = routingPages.searchPages[0];

  return (
    <ShopLayout
      title={`Teslo Shop | ${namePage}`} 
      pageDescription={description} 
    >

    <Typography variant='h1'sx={{mb: 1}} component={`h1`}> Search in Store </Typography>


    {
      foundProduct
        ? 
          <Typography variant='h1' component={`h1`}> Products related to: { query }  </Typography>
        :(
          <Box display={`flex`}>

            <Typography variant='h2' sx={{mb: 1}}> Products found:  </Typography>
            <Typography variant='h2' sx={{ml: 1}} color='secondary'>  { query } </Typography>
          
          </Box>
        )
    }


      <ProductsList products={ products }  />


    </ShopLayout>
  )
}


// SSR

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    // const { data } = await  // your fetch function here 

    const { query } = ctx.params as {query: string};

    if( !query ){
      return{
          redirect:{
              destination: '/',
              permanent: true,
          }
      }
  }

    let products = await dbProducts.getSearchByQ( query );

    const foundProducts = products.length > 0;

    if (!foundProducts ) {
      products =  await dbProducts.getAllProducts();
    }

    // if( !products ){
    //     return{
    //         redirect:{
    //             destination: '/',
    //             permanent: true,
    //         }
    //     }
    // }

    // TODO: si no existe producto, te recomiendo estos

    return {
        props: {
            products,
            foundProducts,
            query
        }
    }
}

export default SearchPageQ
