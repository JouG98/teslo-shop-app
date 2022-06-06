import { FC } from 'react';

import { Box, IconButton, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';


interface Props {
  currentValue: number
  updateQuantity: (quantity: number ) => void
  maxValue: number
}

export const ItemCounter:FC<Props> = ( { currentValue, updateQuantity, maxValue }) => {


  const counterAdd = ( ) => {
    updateQuantity( (currentValue + 1) );
  }

  const counterRest = ( ) => {
    updateQuantity( (currentValue - 1) );
  }

  return (
    <Box display='flex' alignItems='center'>

        {/* Quitar productos */}
        <IconButton
          onClick={ counterRest }
          disabled={ currentValue < 2  }
        >
            <RemoveCircleOutline />
        </IconButton>

        {/* Valor del producto */}
        <Typography sx={{ width: 40, textAlign:'center' }}> { currentValue } </Typography>

        {/* Agregar Producto */}
        <IconButton
          onClick={ counterAdd }
          disabled={ 
            maxValue === currentValue
          }
        >
            <AddCircleOutline />
        </IconButton>

    </Box>
  )
}
