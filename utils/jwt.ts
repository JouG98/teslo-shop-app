import jwt from 'jsonwebtoken'

export const generateJWT = ( _id: string, email: string ) => {

    if(!process.env.TOKENKEY){
        throw new Error(`No existe llave - Token`);
    }

    const payload = { _id, email };

    return jwt.sign(payload, process.env.TOKENKEY, { expiresIn: '2h' });
}

export const validateToken = ( token: string ): Promise<string> => {
    
    if(!process.env.TOKENKEY){
        throw new Error(`No existe llave - Token`);
    }

    if( token.length <= 10 ){
        return Promise.reject(`JWT no valid`);
    }

    return new Promise( (resolve, reject) => {
        try {
             jwt.verify(token, process.env.TOKENKEY!, (err, payload) => {
                 if (err) return reject('Error in validaToken')

                 const { _id } = payload as {_id: string };

                 resolve(_id);

             } )     
        } catch (error) {
            reject('Error in validaToken!')
            
        }
    })

}