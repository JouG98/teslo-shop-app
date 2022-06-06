import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { OrderModel } from '../../../models';
import { IOrder } from '../../../interfaces/order';

type Data = 
{
    ok: boolean,
    msg: string,
}
|{
    ok: boolean,
    msg: string,
    orders: IOrder[],
}

export default function handle (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getOrders(req, res);
    
        default:
            return res.status(400).json({
                ok: false,
                msg: `No authorizado`,
            });
    }
}

const getOrders = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();

    const orders = await OrderModel.find().sort({createAt: 'desc'}).populate('user', 'name email').lean();


    await db.disconnect();

    return res.status(200).json({
        ok:true,
        msg: `Find Order`,
        orders,
    })
}
