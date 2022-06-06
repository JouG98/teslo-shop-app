import type { NextApiRequest, NextApiResponse } from 'next'
import { db, } from '../../../database';
import { OrderModel, UserModel, ProductModel } from '../../../models';

interface IDashboard {
    numberOfOrder: number;
    paidOrder: number;
    notPaidOrder: number;
    numberOfClient: number;
    numberOfProduct: number;
    productWithNotInventory: number; // 0
    lowInventory: number;
}

type Data = 
{
    ok: boolean,
    msg: string,
    // dataDashboard: IDashboard,
}
|
{
    ok: boolean,
    msg: string,
    dataDashboard: IDashboard,
}


export default function dashboard (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
           return getDataDashboard(req, res);
    
        default:
            return res.status(400).json({
                ok: false,
                msg: `No Authorizace`,
            })
    }

    // res.status(200).json({ name: 'Example' })
}

const getDataDashboard = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();

    const [
        numberOfOrder,
        paidOrder,
        // notPaidOrder,
        numberOfClient,
        numberOfProduct,
        productWithNotInventory,
        lowInventory,
    ] = await Promise.all(
        [  
            OrderModel.count(),
            OrderModel.find({ isPaid: true }).count(),
            // OrderModel.find({ isPaid: false }).count(),
            UserModel.find({ rol: 'client' }).count(),
            ProductModel.count(),
            ProductModel.find({ inStock: 0 }).count(),
            ProductModel.find({ inStock: { $lte: 10} }).count(),
            // OrderModel.countDocuments(),
            // OrderModel.countDocuments({ isPaid: true }),
            // OrderModel.countDocuments({ isPaid: false }),
            // UserModel.countDocuments({ rol: 'client' }),
            // UserModel.countDocuments(),
            // ProductModel.countDocuments({ inStok: 0 }),
            // ProductModel.countDocuments({ inStok: { $lte: 10} }),
        ]
    );

    console.log(lowInventory)

    await db.disconnect();

    return res.status(200).json({
        ok: true,
        msg: `Data found`,
        dataDashboard:{
            // lowInventory: await dbDashboard.lowInventory(),
            // notPaidOrder: await dbDashboard.getOrderNotPaid(),
            // numberOfClient: await dbDashboard.numberClient(),
            // numberOfOrder: await dbDashboard.getNumberOrder(),
            // numberOfProduct: await dbDashboard.numberProduct(),
            // paidOrder: await dbDashboard.getOrderPaid(),
            // productWithNotInventory: await dbDashboard.inStok(),
            numberOfOrder,
            paidOrder,
            notPaidOrder: numberOfOrder - paidOrder,
            numberOfClient,
            numberOfProduct,
            productWithNotInventory,
            lowInventory,
        }
    })
}
