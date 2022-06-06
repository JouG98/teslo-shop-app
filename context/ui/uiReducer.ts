import { UIState } from './';
import { Theme } from '@mui/material';

type UIActionType = 
   | { type: '[UI] - Toogle Menu Siderbar'}
   | { type: '[UI] - Current Theme - light - dark'}


export const uiReducer  = ( state: UIState, action: UIActionType ): UIState => {
   switch (action.type) {

       case '[UI] - Toogle Menu Siderbar':
           return {
               ...state,
               isToogleSideMenu: !state.isToogleSideMenu,
           } 
        
        case '[UI] - Current Theme - light - dark':
            // console.log(state.isCurrentTheme)
            return{
                ...state,
                isCurrentTheme: !state.isCurrentTheme,
            }


       default:
          return state;
   }
} 