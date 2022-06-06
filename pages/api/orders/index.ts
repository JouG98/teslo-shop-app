import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONTANTS } from '../../../database'
import { OrderModel, ProductModel } from '../../../models'
import { IProduct } from '../../../interfaces/products';
import { IOrder } from '../../../interfaces/order';
import { getSession } from 'next-auth/react';

type Data = 
    {
        ok: boolean
        msg: string
    }
  |
    {
        ok: boolean,
        msg: string,
        order: IOrder,
    }
//   |
//   {
//       ok: boolean,
//       msg: string,
//       product: IProduct
//   }


export default function products (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'POST':
            return createOrder( req, res );

       
        default:
            return res.status(400).json({
                ok: false,
                msg:`No Authorizado`
            })
    }

}

const createOrder = async ( req: NextApiRequest, res:NextApiResponse<Data> ) => {

    const { orderItems, orderSumary } = req.body as IOrder;

    const session: any = await getSession({ req });
    // console.log({session})

    if( !session ) {
        return res.status(401).json({
            ok: false,
            msg: `No authorizace`,
        })
    }

    // Arreglo de id de los producto en el carrito

    const productIds = orderItems.map( product => product._id);
   
    // open connection db
    await db.connect();

    // trae todos los productos que coincidan con los id 
    const dbProducts = await ProductModel.find({ _id: { $in: productIds }});

    try {
        
        const subtotal = orderItems.reduce( (prev, current) =>{

            const currentPrice = dbProducts.find( product => {
                console.log(current._id)
                return product.id === current._id})?.price;
            // const currentPrice = dbProducts.find( product => product.id === current._id)?.price;
            if(!currentPrice){
                throw new Error('Product don´t exist, verify to cart');
            }

            return (currentPrice * current.quantity) + prev;
        }, 0);

        // descuento
        const discount = Number(process.env.NEXT_PUBLIC_DISCOUNT) / 100;
        // const discount = 5 / 100;

        // impuestos
        const taxes = Number(process.env.NEXT_PUBLIC_TAXE) / 100; 
        // const taxes = 12 / 100; 

        const backendTotal = subtotal +( (subtotal - ( subtotal * discount )) * taxes);
        // console.log({Se: session.user})
        // console.log(backendTotal);


        // verificar que el total cuadre en el front y en el back
        if( orderSumary.total !== backendTotal ){
            throw new Error("El total no cuadra con el monto");
            
        }

        // la compra es correcta en este punto: creo la order

        const userId = session.user._id;
        // console.log({userId})
        const newOrden = new OrderModel({ ...req.body, isPaid: false, user: userId});

        // dejar solo 2 decimales: -para Paypal
        newOrden.orderSumary.total = Math.round( newOrden.orderSumary.total * 100 ) / 100; // obtengo 100.32 algo asi

        await newOrden.save();

        await db.disconnect();


        res.status(201).json({
            ok: true,
            msg: `Order created`,
            order: newOrden,
        })


    } catch (error: any) {
        console.log(error)
        await db.disconnect();
    
        // respuesta
        res.status(400).json({
            ok: false,
            msg: error.message || `Revise los log del servidor`,
        })
        
    }


}

