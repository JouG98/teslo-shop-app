import { FC, useContext } from 'react';

import NextLink from 'next/link';

import { IShippingAddress } from '../../interfaces'
import { CartContext } from '../../context';
import { ModeEditOutlineRounded } from '@mui/icons-material';
import { Box, Typography, Button, Divider, Link } from '@mui/material';
import { routingPages, countries } from '../../utils';


interface Props {
    shippingAddresOfOrder ?: IShippingAddress;
}

export const DeliveryAddressContent: FC<Props> = ({ shippingAddresOfOrder }) => {

    const { shippingAddress } = useContext(CartContext);

    const content = shippingAddresOfOrder ? shippingAddresOfOrder : shippingAddress;

    const { address,address2,city,country,firstName,lastName,phone, zipCode } = content!;

  return (
    <>
        {/* Summary */}
        <Box display='flex' justifyContent='space-between'>
            <Typography variant='subtitle1'>
                Delivery address
            </Typography>

            {
                !shippingAddresOfOrder && (
                    <NextLink 
                        // href='/checkout/address' 
                        href={routingPages.checkoutPages[0].path}
                        passHref
                    >
                        <Link>
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

        <Typography>{ firstName } { lastName} </Typography>
        <Typography> {address} { address2 ? address2 :  ''}</Typography>
        <Typography>
            { city}  { zipCode}
        </Typography>
        <Typography>
            {
                countries.find( c => c.code === country)?.name
            }
        </Typography>
        <Typography> {phone } </Typography>

        <Divider sx={{ my:1 }} />

    </>
  )
}
