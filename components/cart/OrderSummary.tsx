import { FC, useContext } from "react";
import NextLink from 'next/link';

import { Box, Button, Divider, Grid, Link, Typography } from "@mui/material"

import { CartContext } from "../../context"
import { format, routingPages } from "../../utils";
import { IOrderSumary } from "../../interfaces";
import { ModeEditOutlineRounded } from "@mui/icons-material";


interface Props {
    orderSummaryOfOrder ?: IOrderSumary;
}

export const OrderSummary: FC <Props> = ({ orderSummaryOfOrder }) => {

    const { orderSumary } = useContext(CartContext);

    const content = orderSummaryOfOrder ? orderSummaryOfOrder : orderSumary

    const { discount, subTotal, taxe, total, valueItems } = content!;

    
  return (
      <>
        <Box display='flex' justifyContent='space-between' mb={1}>
            <Typography variant='subtitle1'>
                Payment Total
            </Typography>

            {
                !orderSummaryOfOrder && (
                    <NextLink 
                        // href='/cart' 
                        href={routingPages.cartPages[0].path} 
                        passHref
                    >
                        <Link >
                            <Button
                                startIcon={ <ModeEditOutlineRounded />}
                            >
                                Edit
                            </Button>
                        </Link>
                    </NextLink>
                )
            }
        </Box>

        <Grid container>
            
            <Grid item xs={6}>
                <Typography>No. Products</Typography>
            </Grid>

            {/* Numero de Items */}
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>
                    
                    {
                        valueItems > 1 ? `${valueItems} Items` :`${valueItems} Item`
                    }

                </Typography>
            </Grid>

            {/* Subtotal */}
            <Grid item xs={6}>
                <Typography>SubTotal</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{ format(subTotal) }</Typography>
            </Grid>

            {/* Descuento */}
            <Grid item xs={6}>
                <Typography>Discount ({process.env.NEXT_PUBLIC_DISCOUNT}%)</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{ format(discount) }</Typography>
            </Grid>

            {/* Impuesto */}
            <Grid item xs={6}>
                <Typography>Taxes ({process.env.NEXT_PUBLIC_TAXE}%)</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{ format(taxe) }</Typography>
            </Grid>

            {/* Separador */}
            <Grid item xs={12}>
                    <Divider sx={{mt: 2}}/>
            </Grid>

            {/* Total */}
            <Grid item xs={6} sx={{ mt:2 }}>
                <Typography variant="subtitle1">Total:</Typography>
            </Grid>
            <Grid item xs={6} sx={{ mt:2 }} display='flex' justifyContent='end'>
                <Typography variant="subtitle1">{ format(total) }</Typography>
            </Grid>

        </Grid>
      </>
  )
}
