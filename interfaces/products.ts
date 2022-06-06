export interface IProduct {
    _id           : string;
    description   : string;
    images        : string[];
    inStock       : number;
    price         : number;
    sizes         : ISize[]; // tallas de ropa
    slug          : string; // url que lleva a la pag del producto
    tags          : string[]; // coincidencia de producto
    title         : string;
    type          : IType;
    gender        : 'men'|'women'|'kid'|'unisex'

    // timestamps
    createdAt     : string,
    updatedAt     : string,
}

export type ISize = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type IType = 'shirts'|'pants'|'hoodies'|'hats';
export type IGender = 'men'|'women'|'kid'|'unisex';