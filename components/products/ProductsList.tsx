import { Grid } from '@mui/material'
import { FC } from 'react'
import { IProduct } from '../../interfaces'
import { ProductCard } from '.'


interface Props {
    products: IProduct[]
}

export const ProductsList: FC<Props> = ({products}) => {
  return (
    <Grid container mt={1} spacing={4}>

        {
            products.map( product => (
                <ProductCard 
                    key={ product.slug }
                    product={ product }
                />
            ))
        }
    </Grid>
  )
}
