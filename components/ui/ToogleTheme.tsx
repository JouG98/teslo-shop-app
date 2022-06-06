import React, { useContext } from 'react'
import { IconButton } from '@mui/material'

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { UIContext } from '../../context';

export const ToogleTheme = () => {

    const { changeTheme, isCurrentTheme  } = useContext(UIContext);

    const onChangeTheme = ( ) => {
      changeTheme();
      localStorage.setItem('theme', !isCurrentTheme ? 'light':'dark');
    }

  return (
    <IconButton sx={{ ml: 1}}
        onClick={ onChangeTheme }
    >
        {
            isCurrentTheme
            ? 
              <Brightness4Icon />
            :
              <Brightness7Icon />
        }
    </IconButton>
  )
}
