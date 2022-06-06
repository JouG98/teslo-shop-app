import { ISize } from "./";

export interface ICartProduct {
    _id             : string;
    // description  : string;
    images          : string;
    // inStock      : number;
    price           : number; // fine visuales
    size           ?: ISize; // tallas de ropa
    slug            : string; // url que lleva a la pag del producto
    title           : string;
    // type         : IType;
    gender          : 'men'|'women'|'kid'|'unisex',
    quantity        : number;
}


// export interface IOrderSumary {
//     valueItems : number;
//     subTotal   : number;
//     taxe       : number;
//     discount   : number;
//     total      : number;
// }