import React from 'react'

import { Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts/ShopLayout';
import { ProductsList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';
import { routingPages } from '../../utils';

export const CategoryKidsPage = () => {

  const { products, isLoading } = useProducts( '/products?gender=kid' );

  // console.log({products})

  const { description, namePage } = routingPages.categoryPages[0];

  return (
    <ShopLayout
      title={`Teslo Shop | ${namePage}`} 
      pageDescription={description} 
    >
      <Typography variant='h1' component={`h1`}> Store </Typography>
      <Typography variant='h2' sx={{mb: 1}}> Kids products </Typography>

      

      {
        isLoading
        ? <FullScreenLoading />
        : <ProductsList products={ products }  />
      }


    </ShopLayout>
  )
}

export default CategoryKidsPage;