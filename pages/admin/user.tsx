import { PeopleOutlined } from '@mui/icons-material';
import { Grid, MenuItem, Select } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import React, { useState } from 'react'
import useSWR from 'swr';
import { AdminLayout } from '../../components/layouts'
import { IUser } from '../../interfaces';
import { routingPages } from '../../utils'
import tesloApi from '../../api/tesloApi';
import { useEffect } from 'react';

const [ , adminUser] = routingPages.adminPages;

interface IResponse {
    ok: boolean;
    msg: string;
    users: IUser[];
}

const UserPage = () => {

    const { data, error } = useSWR<IResponse>('/api/admin/user');
    // const users  = data.users as IUser[];
    // console.log(data)
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
      if(data){
          setUsers(data.users);
      }
    }, [data]);
    

    if( !error && !data ) return <></>;

    const onUpdateRol = async ( userId: string, newRol: string) => {

        const previewData = users.map( user => user);
        const updateData = users.map( user => ({
            ...user,
            rol: user._id === userId ? newRol : user.rol, 
        }));
        
        setUsers(updateData);

        try {

            await tesloApi.put('/admin/user', {userId, rol: newRol});
            
        } catch (error) {
            setUsers(previewData);
            console.log(error);

        }

    }

    const columns: GridColDef[] = [
        { field:'email', headerName: 'Email', width: 250,  },
        { field:'name', headerName: 'Full Name', width: 300,  },
        { field:'rol', headerName: 'Rol', width: 300, align: 'center',
            renderCell: ({row}: GridValueGetterParams) => {
                return(
                    <Select
                        value={row.rol}
                        label='ROl'
                        onChange={ ({target}) => onUpdateRol( row.id,  target.value)}
                        sx={{
                            width: 300,
                        }}
                    >

                        <MenuItem value='admin' > Admin </MenuItem>
                        <MenuItem value='client' > Client </MenuItem>
                        <MenuItem value='super-user' > Super Client </MenuItem>
                        <MenuItem value='SEO' > SEO </MenuItem>

                    </Select>
                )
            }
        },
    ]

    const row = users.map( data => ({
        id: data._id,
        email: data.email,
        name: `${data.name}`,
        rol: data.rol,
    }))

  return (
    <AdminLayout 
        pageDescription={ adminUser.description} 
        title={ adminUser.namePage} 
        subTitle={adminUser.description} 
        icon={ <PeopleOutlined />}    
    >

        <Grid container mt={1}>
            <Grid mt={1} item xs={12} sx={{ height:650, width: '100%' }}>
                <DataGrid 
                    rows={ row }
                    columns={ columns }
                    pageSize={ 10 }
                    rowsPerPageOptions={ [10] }
                />

            </Grid>
        </Grid>


    </AdminLayout>
  )
}

export default UserPage