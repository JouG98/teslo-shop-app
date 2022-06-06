import { IUser } from './user';
import { ISize } from './products';


export interface IOrder {
    _id             ?: string;
    user            ?: IUser;
    orderItems       : IOrderItems[];
    shippingAddress  : IShippingAddress;
    paymentResult   ?: string;
    orderSumary      : IOrderSumary;
    
    isPaid           : boolean;
    paidAt          ?: string;

    transactionId   ?: string;

    createdAt       ?: string;
    updateAt        ?: string;

}

export interface IOrderItems {
    _id       : string;
    title     : string;
    size      : ISize;
    slug      : string;
    images    : string;
    gender    : 'men'|'women'|'kid'|'unisex';
    price     : number;
    quantity  : number;
}

export interface IShippingAddress {
    firstName : string;
    lastName  : string;
    address   : string;
    address2  : string;
    zipCode   : string;
    city      : string;
    country   : string;
    phone     : string;
 }

 export interface IOrderSumary {
    valueItems : number;
    subTotal   : number;
    taxe       : number;
    discount   : number;
    total      : number;
}