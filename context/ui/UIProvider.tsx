import { Theme, ThemeProvider } from '@mui/material';
import { FC, ReactNode, useReducer, useState, useEffect } from 'react';
import { darkTheme, lightTheme } from '../../themes';
import { UIContext, uiReducer } from './';


export interface UIState {
   isToogleSideMenu : boolean;
   isCurrentTheme   : boolean;
}

const UI_INITIAL_STATE: UIState = {
   isToogleSideMenu : false,
   isCurrentTheme   : true,
}

interface Props {
    children?: ReactNode;
}

export const UIProvider: FC <Props> = ( {children} ) => {

    
  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE );

  const [currentTheme, setCurrentTheme] = useState(lightTheme);

//   console.log(state.isCurrentTheme)


  const toogleSideMenu = ( ) => {
      dispatch({
          type:'[UI] - Toogle Menu Siderbar',
      })
  }

  const changeTheme = ( ) => {
      dispatch({
          type: '[UI] - Current Theme - light - dark',
      })
  }

  useEffect(() => {
    //   console.log('Eject');

    const theme = localStorage.getItem('theme');

    // console.log({theme})

    // const a = ( theme === 'light') ? lightTheme : darkTheme || lightTheme;
    const activeTheme = ( theme === null) ? lightTheme : (theme === 'dark') ? darkTheme : lightTheme;

    UI_INITIAL_STATE.isCurrentTheme = theme === null ? true : ( theme === 'dark') ? false : true

    // const a = ( state.isCurrentTheme ) ? lightTheme : darkTheme;
    setCurrentTheme(activeTheme);


  }, [state.isCurrentTheme])
  


  return(
     <UIContext.Provider value={{
            ...state,
            toogleSideMenu,
            changeTheme,
        }}>
            <ThemeProvider theme={currentTheme}>
                { children }
            </ThemeProvider>
     </UIContext.Provider>
  )

}