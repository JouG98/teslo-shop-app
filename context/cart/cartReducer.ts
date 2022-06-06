import { ICartProduct, IOrderSumary, IShippingAddress } from '../../interfaces';
import { CartState } from './';

type CartActionType = 
   | { type: '[Cart] - LoadCart from cookies | storage',    payload: ICartProduct[]}
   | { type: '[Cart] - LoadAddress from cookies | storage', payload: IShippingAddress | undefined}
   | { type: '[Cart] - Updated Product Cart',               payload: ICartProduct[]}
   | { type: '[Cart] - Change Value Quantity Product',      payload: ICartProduct}
   | { type: '[Cart] - Remove Product Cart',                payload: ICartProduct}
   | { type: '[Cart] - Update Order Sumary',                payload: IOrderSumary}
   | { type: '[Cart] - Update Address',                     payload: IShippingAddress}
   | { type: '[Cart] - Order Complete',}

export const cartReducer  = ( state: CartState, action: CartActionType ): CartState => {
    
   switch (action.type) {

       case '[Cart] - LoadCart from cookies | storage':
           return {
               ...state,
               isLoaded: true,
               cart: [...action.payload]
           }         

        case '[Cart] - Updated Product Cart':
            return{
                ...state,
                cart: [ ...action.payload ],
            }

        case '[Cart] - Change Value Quantity Product':
            return{
                ...state,
                cart: state.cart.map( p => {
                    if( p._id !== action.payload._id) return p;
                    if( p.size !== action.payload.size) return p;

                    return action.payload
                })
            }

        case '[Cart] - Remove Product Cart':
            return{
                ...state,
                // cart: [ ...state.cart.filter( product => product._id !== action.payload._id )]
                cart: state.cart.filter( p => !(p._id === action.payload._id && p.size === action.payload.size))
            }

        case '[Cart] - Update Order Sumary':
            return{
                ...state,
                orderSumary: action.payload,
            }

        case '[Cart] - Update Address':
        case '[Cart] - LoadAddress from cookies | storage':
            return{
                ...state,
                shippingAddress: action.payload,
            }
        
        case '[Cart] - Order Complete':
            return{
                ...state,
                cart: [],
                orderSumary:{
                    discount: 0,
                    subTotal: 0,
                    taxe: 0,
                    total: 0,
                    valueItems: 0,
                }
            }
       default:
          return state;
   }
} 