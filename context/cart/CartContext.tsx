import { createContext } from 'react';
import { ICartProduct, IOrderSumary, IShippingAddress } from '../../interfaces';

interface ContextProps {
    cart      : ICartProduct[];
    isLoaded  : boolean;  

    shippingAddress?: IShippingAddress;

    orderSumary: IOrderSumary;

    // Methods
    addToCard: (product: ICartProduct) => void;
    // updateQuantityProduct: () => void;
    updateQuantityProduct: (product: ICartProduct, quantity: number) => void;
    removerCartProduct: (product: ICartProduct) => void;

    updateAddress: (data: IShippingAddress) => void;

    // Order
    createOrder: () => Promise<{ hasError: boolean, msg: string}>;
}

 export const CartContext = createContext({} as ContextProps);