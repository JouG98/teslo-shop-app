import useSWR, { SWRConfiguration } from 'swr'
import { IProduct } from '../interfaces/products';

// const fetcher = (...args: [Key: string]) => fetch(...args).then(res => res.json());

interface respBack {
    ok: boolean,
    msg: string,
    products: IProduct[],
}

export const useProducts = ( url: string, config: SWRConfiguration = {} ) => {

    const { data, error } = useSWR<respBack>(`/api${url}`, config); // poner el fetcher global: _app
    // const { data, error } = useSWR<respBack>(`/api${url}`, fetcher, config);

    return{
        products: data?.products || [],
        isLoading: !error && ! data,
        isError: error,
    }

}