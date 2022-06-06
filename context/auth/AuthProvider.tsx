import { FC, useReducer, ReactNode, useEffect } from 'react';

import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';

import axios from 'axios';
import Cookie from 'js-cookie';

import { tesloApi } from '../../api';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from './';


export interface AuthState {
   isLogged : boolean;
   user    ?: IUser
}

const Auth_INITIAL_STATE: AuthState = {
   isLogged : false,
   user     : undefined,
}

interface Props {
   children ?: ReactNode;
}

export const AuthProvider: FC <Props> = ( {children} ) => {

  const [state, dispatch] = useReducer(authReducer, Auth_INITIAL_STATE );
  const { reload, push } = useRouter();
  const { data, status } = useSession();

//   Accion Login de nextAuth
  useEffect(() => {
    if( status === 'authenticated'){
      //  console.log(data.user);
       dispatch({
          type:'[Auth] - Login',
          payload: data.user as IUser,
       })
    }

  }, [status, data]);
  

//   autenticacion personalizada
//   useEffect(() => {

//       // reneeToken
//       checkToken();
    
//   }, [])
  

//   Verificacion de token - sin nextauth
  const checkToken = async( ) => {

   if(!Cookie.get('token')) return;
 
   try {
      const { data } = await tesloApi.get('/user/validate-token');
      const { token , user } = data;

      Cookie.set('token', token);

      dispatch({
         type: '[Auth] - Login',
         payload: user, 
      })
   } catch (error) {
      // console.log(error);
      // Cookie.set('token', '');
      Cookie.remove('token');
   }
  }

  const loginUser = async ( email: string, password: string ) : Promise<boolean> => {

     
     try {
        const { data } = await tesloApi.post('/user/login', { email, password} );
        const { token, user } =  data;

        Cookie.set('token', token);

        dispatch({
           type: '[Auth] - Login',
           payload: user,
        })
        
         return true;
      } catch (error) {
         return false;
      }
  }

  const registerUser = async (name:string, email:string, password: string): Promise<{hasError: boolean, msg?: string}> => {

   try {

      const { data } = await tesloApi.post('/user/register', { name, email, password});

      const { token, user, msg } = data;

      Cookie.set('token', token);

      dispatch({
         type: '[Auth] - Login',
         payload: user,
      })

      return{
         hasError: false,
         // msg,
      }
      
   } catch (error) {

      // error en la peticion
      if(axios.isAxiosError(error)){
         const {msg} = error.response?.data as { msg: string};
         return{
            hasError: true,
            msg,
         }
      }

      return{
         hasError: true,
         msg: `Error en la interfaz`

      }

   }
     
  }

  const logout = ( ) => {

      // Cookie.remove('token');
      Cookie.remove('cart');
      Cookie.remove('data');
      // reload();
      signOut();
      push('/auth/login')

     dispatch({
        type: '[Auth] - Logout',
     });


  }

  return(
     <AuthContext.Provider value={{
            ...state,

            // Methods
            loginUser,
            registerUser,

            logout,
      }}>
        { children }
     </AuthContext.Provider>
  )

}