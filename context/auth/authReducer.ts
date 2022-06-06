import { AuthState } from '.';
import { IUser } from '../../interfaces';

type AuthActionType = 
   | { type: '[Auth] - Login', payload: IUser}
   | { type: '[Auth] - Logout'}

export const authReducer  = ( state: AuthState, action: AuthActionType ): AuthState => {
   switch (action.type) {

       case '[Auth] - Login':
           return {
               ...state,
               isLogged: true,
               user: action.payload,
           }         

        case '[Auth] - Logout':
            return{
                ...state,
                isLogged: false,
                user: undefined,
            }
       default:
          return state;
   }
} 