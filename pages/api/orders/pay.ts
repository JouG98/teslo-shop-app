

import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { IPaypalData, IOrder } from '../../../interfaces';
import { db, dbOrders } from '../../../database';
import { OrderModel } from '../../../models';

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
export default function pay (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return payOrder( req, res );

       
        default:
            return res.status(400).json({
                ok: false,
                msg:`No Authorizado`
            })
    }
}

const getPayPalBearerToken = async () :Promise<string | null> => {

    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT;    
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;


    // LA PARTE DE AUTHORIZACION - UNI CLIENT Y SECRET EN BASE 64
    const base64Token = Buffer.from(`${ PAYPAL_CLIENT }:${ PAYPAL_SECRET }`, 'utf-8').toString('base64');

    // lo que va en body: x-www-form-urlencoded
    const body = new URLSearchParams('grant_type=client_credentials');

    try {

        // obtener el token de acceso
        const { data } = await axios.post( process.env.PAYPAL_OAUTH_URL || '', body, {
            headers:{
                'Authorization': `Basic ${ base64Token }`,
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })

        return data.access_token;
        
    } catch (error) {
        if( axios.isAxiosError(error)){
            console.log(error.response?.data)
        } else {
            console.log(error)
        }

        return null;
        
    }
}

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const token_access = await getPayPalBearerToken();

    if(!token_access){
        return res.status(400).json({
            ok: false,
            msg:`No token of Paypal`
        })    
    }

    const { transactionId = '', orderId = '' } = req.body;

    const { data } = await axios.get <IPaypalData>(`${ process.env.PAYPAL_ORDERS_URL }/${transactionId}`,{
        headers:{
            'Authorization': `Bearer ${token_access}`,
        }
    })

    // validar el estado de la transaccion
    if( data.status !== 'COMPLETED'){
        return res.status(400).json({
            ok: false,
            msg:`Don´t Order`
        })    
    }

    await db.connect();
    const dbOrder = await OrderModel.findById(orderId);

    if(!dbOrder){
        await db.disconnect();
        return res.status(400).json({
            ok: false,
            msg:`Don´t Order exist`
        })    
    }

    // comparar los valores de paypal y de la order
    if(dbOrder.orderSumary.total !== Number(data.purchase_units[0].amount.value)){
        await db.disconnect();
        return res.status(400).json({
            ok: false,
            msg:`amount diferent into order`
        })    
    }

    // agg transaccion y stado de l orden
    dbOrder.transactionId = transactionId;
    dbOrder.isPaid =  true;

    await dbOrder.save();

    await db.disconnect();

    return res.status(200).json({
        ok: true,
        msg:`Order Payment`,
        order: dbOrder,
    })
}
