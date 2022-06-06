import React from 'react'

import { Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts/ShopLayout';
import { ProductsList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';
import { routingPages } from '../../utils';


export const CategoryWomenPage = () => {

  const { products, isLoading } = useProducts( '/products?gender=women' );

  const { description, namePage } = routingPages.categoryPages[3];

  // console.log({products})

  return (
    <ShopLayout
      title={`Teslo Shop | ${namePage}`} 
      pageDescription={description} 
    >
      <Typography variant='h1' component={`h1`}> Store </Typography>
      <Typography variant='h2' sx={{mb: 1}}> Women products </Typography>

      

      {
        isLoading
        ? <FullScreenLoading />
        : <ProductsList products={ products }  />
      }


    </ShopLayout>
  )
}

export default CategoryWomenPage;