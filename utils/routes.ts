
const pathHome       = '/';
const pathNotFound   = '/404';
const pathAdmin      = '/admin';
const pathAuth       = '/auth';
const pathCart       = '/cart';
const pathCategory   = '/category';
const pathCheckout   = '/checkout';
const pathOrders     = '/orders';
const pathProducts   = '/products';
const pathSearch     = '/search';

export interface IPages {
    homePage       : IDataPage;
    notFoundPage   : IDataPage;

    adminPages     : IDataPage[];
    authPages      : IDataPage[];
    cartPages      : IDataPage[];
    categoryPages  : IDataPage[];
    checkoutPages  : IDataPage[];
    ordersPages    : IDataPage[];
    productsPages  : IDataPage[];
    searchPages    : IDataPage[];
}

export interface IDataPage{
    description    : string;
    namePage       : string;
    path           : string;
}

export const routingPages: IPages = {

   homePage:{
      description:'Find to best product to here!',
      namePage:'Teslo Shop | Home',
      path: pathHome,
   },

   notFoundPage:{
      description:'',
      namePage:'Not Found',
      path: pathNotFound,
   },

   adminPages:[
       {
        description: 'Pagina de administracion de todos los recursos',
        namePage: 'Admin',
        path: `${pathAdmin}`,
       },
       {
        description: 'Page User',
        namePage: 'User',
        path: `${pathAdmin}/user`,
       },
       {
        description: 'Page Orders',
        namePage: 'Orders',
        path: `${pathAdmin}/orders`,
       },
       {
        description: 'Page Orders By Id',
        namePage: 'Orders ID',
        path: `${pathAdmin}/orders`,
       },
       {
        description: 'Page Product',
        namePage: 'Product ',
        path: `${pathAdmin}/products`,
       },
       {
        description: 'Page Product by Slig',
        namePage: 'Product Slug ',
        path: `${pathAdmin}/products`,
       },
   ],

   authPages:[
    //    {
        // description: 'Authteticacion',
        // namePage: 'Auth',
    //     path: `${pathAdmin}`,
    //    },
       {
        description: 'Iniciar Sesión',
        namePage: 'AuthLogin',
        path: `${pathAuth}/login`,
       },
       {
        description: 'Crear cuenta de usuario',
        namePage: 'AuthRegister',
        path: `${pathAuth}/register`,
       },
   ],

   cartPages:[
    {
        description: 'Store shopping cart',
        namePage: 'Cart ',
        path:`${pathCart}`
    },
    {
        description:'',
        namePage:'Empty',
        path:`${pathCart}/empty`
    }
   ],

   categoryPages:[
    //    {
    //        description:'',
    //        namePage:'Category',
    //        path:'/category',
    //    },
       {
           description:'Find to best product to here!',
           namePage:'Kids',
           path:`${ pathCategory }/kid`,
       },
       {
           description:'Find to best product to here!',
           namePage:'Men',
           path:`${ pathCategory }/men`,
       },
       {
           description:'Find to best product to here!',
           namePage:'Unisex',
           path:`${ pathCategory }/unisex`,
       },
       {
           description:'Find to best product to here!',
           namePage:'Women',
           path:`${ pathCategory }/women`,
       },
   ],

   checkoutPages:[
    //    {
    //        description:'',
    //        namePage:'',
    //        path:'/checkout',
    //    },
       {
           description:'Confirm destination address',
           namePage:'Address',
           path:`${pathCheckout}/address`,
       },
       {
           description:'Order summary',
           namePage:'Order summary',
           path:`${pathCheckout}/summary`,
       },
   ],

   ordersPages:[
       {
           description:'Resumen summary',
           namePage:'Resumens Summary',
           path:`${pathOrders}`,
       },
       {
           description:'',
           namePage:'Orders History',
           path:`${pathOrders}/history`,
       },
   ],

   productsPages:[
       {
           description:'',
           namePage:'Products',
           path:`${pathProducts }`,
       },
   ],

   searchPages:[
       {
           description:'Find to best product to here!',
           namePage:'Search',
           path:`${pathSearch}`,
       },
   ],
  
}

/**
 * 
 * path
 * namePage
 * descripcion
 * 
 */