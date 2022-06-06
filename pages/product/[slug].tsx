import { useContext, useState } from 'react';

import { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { Box, Button, Chip, Grid, Typography } from '@mui/material'

import { ProductSlideshow, SizeSelector } from '../../components/products';
import { ShopLayout } from '../../components/layouts';
import { ItemCounter } from '../../components/ui'; 

import { CartContext } from '../../context';
import { dbProducts } from '../../database';
import { routingPages } from '../../utils';
import { IProduct, ISize, ICartProduct } from '../../interfaces';



interface Props {
    product: IProduct;
}

const ProductPage: NextPage <Props> = ( { product }) => {

    // ContextCart
    const { addToCard } = useContext(CartContext);

    // enrutamiento a cart
    const { push } = useRouter();


    const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
        _id: product._id,
        images: product.images[0],
        price: product.price,
        // sizes: product.sizes,
        size: undefined,
        slug: product.slug,
        title: product.title,
        gender: product.gender,
        // quantity: product.quantity,
        quantity: 1,
    })

    const SelectSize = ( size: ISize) =>{ 
        // console.log('En padre: ', size );
        setTempCartProduct( currentProduct => ({
            ...currentProduct,
            size,
        }))
    }

    const updateQuantityValue = ( quantity: number) => {
        setTempCartProduct( currentProduct => ({
            ...currentProduct,
            quantity,
        }))
    }

    const addProductToCart = ( ) => {
        // console.log(tempCartProduct)

        if ( !tempCartProduct.size) return

        addToCard( tempCartProduct );

        // routePage
        push( routingPages.cartPages[0].path );
    }

  return (
    <ShopLayout pageDescription={ product.description } title={product.title}>

        <Grid container spacing={3}>

            <Grid
                item
                xs={12}
                sm={7}
            >
                {/* SlideShow */}
                <ProductSlideshow images={ product.images} />
            </Grid>

            <Grid
                item
                xs={12}
                sm={5}
            >
                <Box
                    display={`flex`}
                    flexDirection={`column`}
                >
                    {/* title */}
                    <Typography variant='h1' component={`h1`}> {product.title} </Typography>
                    <Typography variant='subtitle1' component={`h2`}> {`$${product.price}`} </Typography>

                    {/* Quantity - cantidad */}
                    <Box sx={{my: 2}}>
                        <Typography variant='subtitle2'>Quantity</Typography>

                        <h1> {product.inStock} </h1>

                        {/* itemCounter */}
                        <ItemCounter 
                            currentValue={ tempCartProduct.quantity }
                            updateQuantity={ updateQuantityValue }
                            maxValue={ product.inStock
                                // regla de validacion - product max 10
                                // product.inStock > 10 : 10 ? product.inStock
                            }
                        
                        />

                        {/* Selector de talla */}
                        <SizeSelector 
                            sizes={product.sizes}
                            selectedSize={ tempCartProduct.size}
                            onSelectedSize={ (size) => SelectSize(size) }
                        />

                    </Box>

                    {/*Add to cart - Agregar al carrito */}
                    {
                        product.inStock > 0 
                            ? (
                                <Button 
                                    color='secondary' 
                                    className='circular-btn'
                                    onClick={ addProductToCart }

                                    // validacion 
                                    // disabled={ !tempCartProduct }
                                >
                                    {
                                        tempCartProduct.size
                                            ? 'Add to cart'
                                            : 'Select a size'
                                    }
                                </Button>
                            )
                            : (
                                 <Chip 
                                    label={`Not available`}
                                    color={`error`}
                                    variant={`outlined`}
                                /> 
                            )
                    }



                    {/* Description */}
                    <Box
                        sx={{
                            mt: 3
                        }}
                    >
                        <Typography variant='subtitle2' > Description </Typography>
                        <Typography variant='body2'textAlign={'justify'} > {product.description} </Typography>
                    </Box>

                </Box>
            </Grid>
            
        </Grid>

    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// Pagina pre - renderizada por el servidor

// es una opcion buena, pero mejor es de la statica

/**
 * 
 * 
    export const getServerSideProps: GetServerSideProps = async (ctx) => {
    
    const { slug } = ctx.params as { slug : string}
    const  product  = await dbProducts.getProductBySlug(slug ) // your fetch function here 

    if (!product){
        return{
            redirect:{
                destination: '/',
                permanent: false,
            }
        }
    }

    return {
        props: {
            product
        }
    }
}
 * 
 */

// Primero con getStatictPath para poder crear todas las pag by slug

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async (ctx) => {
    // const { data } = await  // your fetch function here 

    const pathSlug = await dbProducts.getPathSlug();
    // console.log({pathSlug})
    // pathSlug.sl

    // const p = pathSlug.map( ({slug}) => slug );
    // console.log({p})

    return {
        paths: pathSlug?.map( ( {slug} ) =>({
            params:{ slug}
        })),
        // paths: [
        //     {
        //         params: {
                    
        //         }
        //     }
        // ],
        fallback: "blocking"
        // fallback: true
    }
}

// Luego mandar la prop

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.

export const getStaticProps: GetStaticProps = async (ctx) => {

    const { slug } = ctx.params as { slug : string}
    const  product  = await dbProducts.getProductBySlug(slug ) // your fetch function here 
    
        if (!product){
            return{
                redirect:{
                    destination: '/',
                    permanent: false,
                }
            }
        }
    
        return {
            props: {
                product
            },
            revalidate: 18400 // en: MS 60seg * 60min * 24h,
            
        }
    
}

export default ProductPage