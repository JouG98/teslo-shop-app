import { useState, useEffect } from 'react';
import { DashboardOutlined, CreditCardOffOutlined } from '@mui/icons-material';
import { AdminLayout } from '../../components/layouts'
import { adminData, routingPages } from '../../utils'
import { SummaryTitle } from '../../components/admin';
import { Grid, Typography } from '@mui/material';
import useSWR from 'swr';
import { IDashboarResponse } from '../../interfaces';

const [ admin ] = routingPages.adminPages;

const info = adminData.info;

const AdminDashboard = () => {

  const { data, error } = useSWR<IDashboarResponse>('/api/admin/dashboard',{
    refreshInterval: 30 * 1000 // 30seg
  });

  const [refreshIn, setRefreshIn] = useState(30);

  // console.log(data);

  useEffect(() => {
    const interval = setInterval( () => {
      console.log('tick')
      setRefreshIn( refresh => refresh > 0 ? refresh-1: 30);
    }, 1000);
  
    return () => clearInterval(interval);
  }, [])
  

  if(data !== undefined){
    
    // info.map( (data)=>{
    //   data.title = 'algon'
    //   return data
    // })

    info[0].title = data.dataDashboard.numberOfOrder;
    info[1].title = data.dataDashboard.paidOrder;
    info[2].title = data.dataDashboard.notPaidOrder;
    info[3].title = data.dataDashboard.numberOfClient;
    info[4].title = data.dataDashboard.numberOfProduct;
    info[5].title = data.dataDashboard.productWithNotInventory;
    info[6].title = data.dataDashboard.lowInventory;

    info[7].title = refreshIn;

  }

  if( !error && !data ){
    return <></>
  }

  if( error ){
    return <Typography> Error </Typography>
  }

  return (
    <AdminLayout 
        pageDescription={ admin.description} 
        title={admin.namePage} 
        subTitle={admin.description} 
        icon={ <DashboardOutlined /> }
    >

      <Grid container mt={1} spacing={2}>

        {
          info.map( (data, idx) =>(
            <SummaryTitle 
              key={idx}
              title={data.title} 
              subtitle={data.subTitle} 
              icon={ <data.icon  color={ data.color } sx={{ fontSize: 40}}/>} 
              // color={ 'error'}
            />
          ))
        }
      
      </Grid>

    </AdminLayout>
  )
}

export default AdminDashboard