import { PayPalButtons } from '@paypal/react-paypal-js';
import { useRouter } from 'next/router';
import { Dispatch, FC, SetStateAction } from 'react';
import { tesloApi } from '../../api';

type OrderResponseBody = {
    id: string;
    status: "COMPLETED" | "SAVED" | "APPROVED" | "VOIDED" | "COMPLETED" | "PAYER_ACTION_REQUIRED";
}

interface Props {
    mount: number;
    orderId: string;
    setIsPaying: ( status: boolean ) => void;
}

export const CustomPayPalBtn: FC<Props> = ({mount, orderId, setIsPaying}) => {
    const { reload } = useRouter();

    const onPayment = async ( details : OrderResponseBody ) => {

        if( details.status !== 'COMPLETED'){
            return alert('No hay ago en Paypal')
        }

        setIsPaying(true);
        try {
            
            const { data } =  await tesloApi.post('/orders/pay', {
                transactionId: details.id,
                orderId,
            })

            console.log({data})

            reload()


        } catch (error) {
            console.log(error)
            setIsPaying(false);
            
        }

    }

  return (
    <>
        <PayPalButtons 
            createOrder={(data, actions) => {
                return actions.order.create({
                    purchase_units: [
                        {
                            amount: {
                                value: `${mount}`,
                            },
                        },
                    ],
                });
            }}
            onApprove={(data, actions) => {
                return actions.order!.capture().then((details) => {
                    console.log({details})
                    onPayment(details);
                    // const name = details.payer.name!.given_name;

                    // alert(`Transaction completed by ${name}`);
                });
            }}
        />
    </>
  )
}
