import { createContext } from 'react';
import { IUser } from '../../interfaces';

interface ContextProps {
    isLogged: boolean;
    user?: IUser;

    // Methods
    loginUser: (email: string, password: string) => Promise<boolean>;
    registerUser: (name: string, email: string, password: string) => Promise<{
        hasError: boolean;
        msg?: string;
    }>
    logout: () => void;
}

 export const AuthContext = createContext({} as ContextProps);