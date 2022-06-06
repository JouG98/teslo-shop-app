import { Theme } from '@mui/material';
import { createContext } from 'react';

interface ContextProps {
    isToogleSideMenu  : boolean;
    isCurrentTheme    : boolean;

    // Methods
    toogleSideMenu: () => void;
    changeTheme: () => void;
}

 export const UIContext = createContext({} as ContextProps);