import { Typography, Divider } from '@mui/material'
import { FC, useContext } from 'react';
import { CartContext } from '../../context';


interface Props {
    valueItemsOfOrder ?: number;
}

export const SummaryHeader: FC<Props> = ({ valueItemsOfOrder }) => {

    const {orderSumary} = useContext(CartContext);

    const valueItems = valueItemsOfOrder ? valueItemsOfOrder : orderSumary.valueItems;

  return (
    <>
        <Typography variant='h2'>
            Summary 
            ( {'  '}
                { valueItems }
                { valueItems === 1 ? ' product' : ' products' }
                {'  '}
            )
        </Typography>
        <Divider sx={{ my:1 }} />
    </>
  )
}
