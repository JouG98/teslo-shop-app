import type { NextPage } from 'next'

import { Typography } from '@mui/material'

import { ShopLayout } from '../components/layouts'
import { ProductsList } from '../components/products'
import { FullScreenLoading } from '../components/ui'

import { useProducts } from '../hooks'
import { routingPages } from '../utils'

const Home: NextPage = () => {

  const { products, isLoading } = useProducts( '/products' );
  // console.log({products})

  const { description, namePage} = routingPages.homePage;

  return (
    <ShopLayout
      // title={`Teslo Shop | Home`} 
      title={ namePage } 
      pageDescription={ description } 
      // pageDescription={`Find to best product to here!`} 
    >
      <Typography variant='h1' component={`h1`}> Store </Typography>
      <Typography variant='h2' sx={{mb: 1}}> All products </Typography>

      {
        isLoading
        ? <FullScreenLoading />
        : <ProductsList products={ products }  />
      }


    </ShopLayout>
  )
}

export default Home
