import mongoose from 'mongoose';

// Estados de Coneccion

/**
 * 
 *  0 = diconnected
 *  1 = connected
 *  2 = connecting
 *  3 = diconnecting
 * 
 */

const mongoConnection = {
    isConnecting: 0
}


export const connect = async () =>{

    // Si la coneccion ya existe
    if ( mongoConnection.isConnecting ){
        console.log(`dbMongo Connected`);
        return;
    }

    // Si existe alguna coneccion
    if ( mongoose.connections.length > 0 ){
        mongoConnection.isConnecting = mongoose.connections[0].readyState; // trae la coneccion que tenga

        // Si existe la conneccion anterior
        if ( mongoConnection.isConnecting === 1 ){
            console.log(`Usando la coneccion anterior`)
            return;
        }

        // cerramos coneccion si no es la que queremos
        await mongoose.disconnect();
    }

    await mongoose.connect(`${process.env.MONGO_URL}`)
    mongoConnection.isConnecting = 1 ;
    console.log(`Database of Mongo Online in: ${process.env.MONGO_URL} `)
}


export const disconnect = async ( ) => {

    // Si estoy en desarrollo no me desconecto
    if ( process.env.NODE_ENV === 'development') return;

    if ( mongoConnection.isConnecting === 0 ) return;

    await mongoose.disconnect();
    mongoConnection.isConnecting = 0;
    console.log(`DB Disconnect`)

}
