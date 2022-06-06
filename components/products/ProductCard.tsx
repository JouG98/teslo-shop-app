import { FC, useMemo, useState } from "react";
import NextLink from 'next/link';

import { Grid, Card, CardActionArea, CardMedia, Box, Typography, Link, Chip } from "@mui/material";
import { IProduct } from "../../interfaces"


interface Props {
    product: IProduct;
}

export const ProductCard:FC<Props> = ({product}) => {

    const [isHovered, setIsHovered] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const productImage = useMemo(() => 
        isHovered 
            ? product.images[1]
            : product.images[0],
            // ? `/products/${product.images[1]}`
            // : `/products/${product.images[0]}`, 
            [isHovered, product.images]);
  return (
    <Grid
        item
        xs={12} sm={6} md={4} lg={3}
        onMouseEnter={ () => setIsHovered(true) } // propiedades para cambiar el estado de la img
        onMouseLeave={ () => setIsHovered(false)}
    >
        <NextLink
            href={`/product/${product.slug}`}
            passHref
        >
            <Link>
                <Card

                >
                    <CardActionArea>
                        {
                            product.inStock === 0 && (
                                <Chip 
                                    color={'secondary'}
                                    label={`Sold out`}
                                    // className={`etiqueta`}
                                    sx={{
                                        position: 'absolute',
                                        borderRadius: '0px',
                                        zIndex: 99,
                                        top: '30px',
                                        left: '-40px',
                                        width: '170px',
                                        fontWeight: '400',
                                        transform: 'rotate(-45deg)',
                                    }}
                                />
                                // <span className="etiqueta">
                                //     <span> Sold out</span>
                                // </span>
                            )
                        }

                        <CardMedia
                            component={`img`}
                            image={productImage}
                            className={`fadeIn`}
                            onLoad={ ( ) => setIsImageLoaded(true) }
                        />
                    </CardActionArea>
                </Card>
            </Link>
        </NextLink>

        <Box
            className="fadeIn"
            mt={1}
            display={ isImageLoaded ? 'block' : 'none'}
        >
            <Typography fontWeight={600}>{product.title} </Typography>
            <Typography fontWeight={400}>{`$${product.price}`} </Typography>
        </Box>
    </Grid>
  )
}
