import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    ok: boolean,
    msg: string,
}

export default function search (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        
    
        default:
            return res.status(404).json({
                ok: false,
                msg: `Endpoint not found`,
            })
    }
}