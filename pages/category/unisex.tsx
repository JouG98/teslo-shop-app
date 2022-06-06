import React from 'react'

import { Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';
import { ProductsList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';
import { routingPages } from '../../utils';


const CategoryUnisexPage = () => {

    const { products, isLoading } = useProducts( '/products?gender=unisex' );

    const { description, namePage } = routingPages.categoryPages[2];
    // console.log({products})
  
    return (
      <ShopLayout
        title={`Teslo Shop | ${namePage}`} 
        pageDescription={description} 
      >
        <Typography variant='h1' component={`h1`}> Store </Typography>
        <Typography variant='h2' sx={{mb: 1}}> Unisex products </Typography>
  
        
  
        {
          isLoading
          ? <FullScreenLoading />
          : <ProductsList products={ products }  />
        }
  
  
      </ShopLayout>
    )
}

export default CategoryUnisexPage