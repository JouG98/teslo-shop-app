import { FC, useReducer, ReactNode, useEffect } from 'react';
import { ICartProduct, IOrder, IOrderSumary, IShippingAddress } from '../../interfaces';
import { CartContext, cartReducer } from './';

import Cookie from 'js-cookie';
import { tesloApi } from '../../api';
import axios, { AxiosError } from 'axios';


export interface CartState {
   cart            : ICartProduct[];
   isLoaded        : boolean;
   orderSumary     : IOrderSumary;

   shippingAddress?: IShippingAddress;
}

// export interface IShippingAddress {
//    firstName : string;
//    lastName  : string;
//    address   : string;
//    address2  : string;
//    zipCode   : string;
//    city      : string;
//    country   : string;
//    phone     : string;
// }

const CART_INITIAL_STATE: CartState = {
   cart             : [],
   shippingAddress  : undefined,
   isLoaded         : false, 
   orderSumary      :{
      valueItems : 0,
      subTotal   : 0,
      taxe       : 0,
      discount   : 0,
      total      : 0,
   }
}

interface Props {
   children?: ReactNode;
}

export const CartProvider: FC <Props> = ( {children} ) => {

  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE );

  // Mantener la data de address

  useEffect(() => {
   try {
      const dataAddress = Cookie.get('data') ? JSON.parse(Cookie.get('data')!) : {
         firstName:'',
         lastName:'',
         address:'',
         address2:'',
         zipCode:'',
         city:'',
         country:'',
         phone:'',
      } ;
      dispatch({
         type: '[Cart] - LoadAddress from cookies | storage',
         payload: dataAddress,
      })
      
    } catch (error) {
       
       dispatch({
          type: '[Cart] - LoadAddress from cookies | storage',
          payload: undefined,
       })
       console.log({error})
   }
  }, [])
  

  // Cargar cart de las cookies

  useEffect(() => {
     try {
        const cartCookie = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [] ;
        dispatch({
           type: '[Cart] - LoadCart from cookies | storage',
           payload: cartCookie,
        })
        
      } catch (error) {
         
         dispatch({
            type: '[Cart] - LoadCart from cookies | storage',
            payload: [],
         })
         console.log({error})
     }
  }, []);

  // Guardar cart en las cookies

  useEffect(() => {
   Cookie.set('cart', JSON.stringify(state.cart));
  }, [state.cart])
  
  // Efecto encargado del los montos de los productos: $

  useEffect(() => {

      // reducer: hace un recorrido y acumula el valor anterior con prev 

      const valueItems = state.cart.reduce( (prev, current) => current.quantity + prev ,0);

      let subTotal = state.cart.reduce( (prev, current ) => (current.price * current.quantity) + prev, 0);

      // descuento
      const discount = Number(process.env.NEXT_PUBLIC_DISCOUNT) / 100;
      // const discount = 5 / 100;

      subTotal = subTotal - (subTotal * discount);
      // impuestos
      const taxes = Number(process.env.NEXT_PUBLIC_TAXE) / 100; 
      // const taxes = 12 / 100; 
      

      const orderSumary: IOrderSumary = {
         valueItems,
         subTotal,
         taxe: subTotal * taxes,
         discount: subTotal * discount,
         total: subTotal + ( subTotal * taxes),
         // total: (subTotal > 0 ? subTotal - discount: subTotal) + (subTotal * taxes),
      }

      // console.log(orderSumary);

      dispatch({
         type: '[Cart] - Update Order Sumary',
         payload: orderSumary,
      })
    
  }, [state.cart])
  

//   Methods from cart

  const addToCard = ( product: ICartProduct ) => {
   
      // Evaluar si tienen el mismo id y talla: si no tienen add to cart
      const productInCart = state.cart.some( p => p._id === product._id );
      if (!productInCart) return dispatch({
         type: '[Cart] - Updated Product Cart',
         payload: [ ...state.cart ,product],
      })

      // evaluar si tienen la misma talla: 
      const productInCartButDifferentSize = state.cart.some( p => 
                                                               p._id === product._id &&
                                                               p.size === product.size );
      // si no tienen la misma talla
      if(!productInCartButDifferentSize) return dispatch({
         type: '[Cart] - Updated Product Cart',
         payload: [ ...state.cart ,product],
      })

      // si llega a este punto acumular
      const updatedProducts = state.cart.map(p => {
         if(p._id !== product._id) return p;
         if(p.size !== product.size) return p;

         // acumular
         p.quantity += product.quantity;
         // p.price += product.price;
         return p;
      });

      dispatch({
         type: '[Cart] - Updated Product Cart',
         payload: updatedProducts,
      })

      
  }

  const updateQuantityProduct = ( product: ICartProduct, quantity: number) => {

   product.quantity = quantity;

   dispatch({
      type: '[Cart] - Change Value Quantity Product',
      payload: product,
   })

  }

  const removerCartProduct = ( product: ICartProduct ) => {
     dispatch({
        type: '[Cart] - Remove Product Cart',
        payload: product,
     })
  }


  // address
  const updateAddress = ( data: IShippingAddress ) => {

        Cookie.set('data', JSON.stringify(data));

   dispatch({
      type: '[Cart] - Update Address',
      payload: data, 
   })
  }


  // Order
  const createOrder = async ( ): Promise<{ hasError: boolean, msg: string}> => {

   // validar que tenga la address
   if( !state.shippingAddress ){
      throw new Error('NO existe direccion');
   }

   const body: IOrder = {
      // orderItems: state.cart,
      orderItems: state.cart.map( p => ({
         ...p,
         size: p.size!,
      })),
      shippingAddress: state.shippingAddress,
      orderSumary: state.orderSumary,
      isPaid: false,
      // paidAt: ''
   }

   try {
      const { data } = await tesloApi.post('/orders', body);
      // console.log({data});

      // dispacht: limpieza de cart
      dispatch({type: '[Cart] - Order Complete'});

      return{
         hasError: false,
         msg: data.order._id,
      }
      
   } catch (error ) {
      console.log({error})
      if(axios.isAxiosError(error)){
         const { msg } = error.response?.data as { msg: string}
         return{
            hasError: true,
            msg,
            // msg: `${error.response?.data.msg as string} ` ,
            // msg: 'error de axios',
         }
      }

      return{
         hasError: true,
         msg: 'Error no controlado, busque asistencia',
      }
   }

  }

  return(
     <CartContext.Provider value={{
        ...state,

        // Methods
        addToCard,
        updateQuantityProduct,
        removerCartProduct,

        updateAddress,

        // Order
        createOrder,
        
      }} >
        { children }
     </CartContext.Provider>
  )

}