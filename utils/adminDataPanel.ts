import { AttachMoneyOutlined, CreditCardOffOutlined, CreditCardOutlined, GroupsOutlined, CategoryOutlined, CancelPresentationOutlined, ProductionQuantityLimits, AccessTimeOutlined } from '@mui/icons-material';
import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
export interface IDataAdmin {

    info : Data[]
}
// OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
//     muiName: string;
// }
interface Data {
    title: string | number,
    subTitle: string,
    // icon: ReactElement,
    // icon: JSX.Element,
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
        muiName: string;
    }
    color: "inherit" | "disabled" | "action" | "primary" | "secondary" | "error" | "info" | "success" | "warning" | undefined
}

export const adminData: IDataAdmin = {
    info:[
        {
            color: 'secondary',
            icon: CreditCardOutlined ,
            subTitle: 'Orderes totales',
            title: 1,
        },
        {
            color: 'success',
            icon: AttachMoneyOutlined ,
            subTitle: 'Ordenes Pagadas',
            title: 2,
        },
        {
            color: 'error',
            icon: CreditCardOffOutlined ,
            subTitle: 'Ordenes Pendiente',
            title: 3,
        },
        {
            color: 'primary',
            icon: GroupsOutlined ,
            subTitle: 'Client',
            title: 4,
        },
        {
            color: 'warning',
            icon: CategoryOutlined ,
            subTitle: 'Product',
            title: 5,
        },
        {
            color: 'error',
            icon: CancelPresentationOutlined ,
            subTitle: 'Sin Existencia',
            title: 6,
        },
        {
            color: 'warning',
            icon: ProductionQuantityLimits ,
            subTitle: 'Bajo Inventario',
            title: 7,
        },
        {
            color: 'secondary',
            icon: AccessTimeOutlined ,
            subTitle: 'Actualizacion en:',
            title: 8,
        },
    ]
}