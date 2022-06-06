import { IOrder } from "../interfaces";
import { isValidObjectId } from 'mongoose'
import { OrderModel } from "../models";
import { db } from ".";


export const getOrderById = async ( id: string ): Promise<IOrder | null> => {

    // si es un id valido de mongo
    if( !isValidObjectId( id )){
        return null;
    }

    await db.connect();
    const order = await OrderModel.findById(id).lean();
    await db.disconnect();

    if (!order){
        return null;
    }


    // todo bn
    return JSON.parse(JSON.stringify(order)); // serializado
    
}


export const getByUserOrder = async (id:string): Promise<IOrder[]> => {

    if(!isValidObjectId(id)){
        return [];
    }

    await db.connect();
    const orders = await OrderModel.find({ user: id });
    await db.disconnect();

    if(!orders){
        return [];
    }

    return JSON.parse(JSON.stringify(orders))

    
}