import { useContext, useEffect, useState } from 'react';

import { useRouter } from "next/router";

import { AccountBoxOutlined, ContactPhoneOutlined, DriveFileRenameOutline, InfoOutlined, LocalShippingOutlined, LocationCityOutlined } from "@mui/icons-material"
import { Box, Button, FormControl, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Typography, FormHelperText, TextField,  } from '@mui/material';
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";

import { CartContext } from "../../context";
import { ShopLayout } from "../../components/layouts"
import { countries, routingPages } from "../../utils";
import { IShippingAddress } from '../../interfaces'


type FormData = {
    firstName : string;
    lastName  : string;
    address   : string;
    address2 ?: string;
    zipCode   : string;
    city      : string;
    country   : string;
    phone     : string;

}
const getDataAddressFromCookie = ( ) : FormData => {

    if( !Cookies.get('data')){
        // console.log('No existe data')
        return {
            firstName: '',
            lastName: '',
            address: '',
            address2: '',
            zipCode: '',
            city: '',
            // country: countries[6].code,
            country: '',
            phone: '',
        }
    }

    // console.log('Si existe data')
    return JSON.parse( Cookies.get('data')!);

}


const AddressPage = () => {
    

    const { updateAddress } = useContext(CartContext);

    const { push } = useRouter();

    const { description, namePage } = routingPages.checkoutPages[0];

    // console.log(getDataAddressFromCookie())
    const [defaultCountry, setDefaultCountry] = useState(countries[1].code);
   

    // hook form
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormData>({
        mode:'onTouched',
        // defaultValues: JSON.parse( Cookies.get('data')!),
        defaultValues: getDataAddressFromCookie(), 
    });

    // Solucion a problema de rehidratacion de la data de country: server diferente de client
    useEffect(() => {
        reset(getDataAddressFromCookie());

        // setDefaultCountry( watch('country'));
        // let a = JSON.parse( Cookies.get('data')!);
        // console.log(a.country);

        // setDefaultCountry( watch('country')  );

        

    }, [reset])
    
    // console.log(watch('country'))
   
    
    const onRegisterData = ( data: FormData ) => {
        // console.log({data});
        updateAddress(data as IShippingAddress);

        push( routingPages.checkoutPages[1].path );
        // push('/checkout/summary');

    }
  

  return (
    <ShopLayout title={namePage} pageDescription={ description }>
        <Typography variant="h1" component='h1'> { namePage } </Typography>
        <form
            onSubmit={handleSubmit(onRegisterData)}
            noValidate // desactiva valodate html
        >
            <Grid container spacing={ 2 } sx={{ mt: 2 }}>
                
                {/* FirstName and LastName */}
                <Grid item xs={12} sm={ 6 } 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column'
                    }}
                >
                    <InputLabel htmlFor="component-error" sx={{mb:1.5}}>
                        <Typography variant="subtitle2">
                            Name:
                        </Typography>
                    </InputLabel>

                    <FormControl variant="outlined">
                        <OutlinedInput
                            type={ `text`}
                            placeholder="FirstName"  
                            fullWidth 
                            { ...register('firstName', {
                                required: `This fieds is required`,
                                // // minLength: { value: 6, message: `Caracter min: 6`}
                            })}    
                            error={ !!errors.firstName }
                            aria-describedby="component-error-text"
                            id="component-error"
                            endAdornment={ 
                                <InputAdornment position="end">
                                <DriveFileRenameOutline />
                                </InputAdornment>
                            }
                        />
                        <FormHelperText 
                            // sx={{color: '#FF1744'}} 
                        >{ errors.firstName?.message }</FormHelperText>
                    </FormControl>

                </Grid>
                <Grid item xs={12} sm={ 6 } 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column'
                    }}
                >
                    <InputLabel sx={{mb:1.5}}>
                        <Typography variant="subtitle2">
                            LastName:
                        </Typography>
                    </InputLabel>

                    <FormControl variant="outlined">
                        <OutlinedInput
                            type={ `text`}
                            placeholder="LastName"  
                            fullWidth 
                            { ...register('lastName', {
                                required: `This fieds is required`,
                                // minLength: { value: 6, message: `Caracter min: 6`}
                            })}    
                            error={ !!errors.lastName }
                            endAdornment={ 
                                <InputAdornment position="end">
                                <AccountBoxOutlined />
                                </InputAdornment>
                            }
                        />
                        <FormHelperText 
                            // sx={{color: '#FF1744'}} 
                        >{ errors.lastName?.message }</FormHelperText>
                    </FormControl>

                </Grid>

                {/* Direccion */}
                <Grid item xs={12} sm={ 6 } 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column'
                    }}
                >
                    <InputLabel sx={{mb:1.5}}>
                        <Typography variant="subtitle2">
                            Addres:
                        </Typography>
                    </InputLabel>

                    <FormControl variant="outlined">
                        <OutlinedInput
                            type={ `text`}
                            placeholder="Address"  
                            fullWidth 
                            { ...register('address', {
                                required: `This fieds is required`,
                                // minLength: { value: 6, message: `Caracter min: 6`}
                            })}    
                            error={ !!errors.address }
                            endAdornment={ 
                                <InputAdornment position="end">
                                <InfoOutlined />
                                </InputAdornment>
                            }
                        />
                        <FormHelperText 
                            // sx={{color: '#FF1744'}} 
                        >{ errors.address?.message }</FormHelperText>
                    </FormControl>
                

                </Grid>
                <Grid item xs={12} sm={ 6 } 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column'
                    }}
                >
                    <InputLabel sx={{mb:1.5}}>
                        <Typography variant="subtitle2">
                            Addres 2: (Optional)
                        </Typography>
                    </InputLabel>

                    <FormControl variant="outlined">
                        <OutlinedInput
                            type={ `text`}
                            placeholder="Address 2"  
                            fullWidth 
                            { ...register('address2', {
                                required: `This fieds is required`,
                                // minLength: { value: 6, message: `Caracter min: 6`}
                            })}    
                            error={ !!errors.address2 }
                            endAdornment={ 
                                <InputAdornment position="end">
                                <InfoOutlined />
                                </InputAdornment>
                            }
                        />
                        <FormHelperText 
                            // sx={{color: '#FF1744'}} 
                        >{ errors.address2?.message }</FormHelperText>
                    </FormControl>

                </Grid>

                {/* Code postal and city */}
                <Grid item xs={12} sm={ 6 } 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column'
                    }}
                >
                    <InputLabel sx={{mb:1.5}}>
                        <Typography variant="subtitle2">
                            Zip Code:
                        </Typography>
                    </InputLabel>

                    <FormControl variant="outlined">
                        <OutlinedInput
                            type={ `text`}
                            placeholder="Zip Code"  
                            fullWidth 
                            { ...register('zipCode', {
                                required: `This fieds is required`,
                                // minLength: { value: 6, message: `Caracter min: 6`}
                            })}    
                            error={ !!errors.zipCode }
                            endAdornment={ 
                                <InputAdornment position="end">
                                <LocalShippingOutlined />
                                </InputAdornment>
                            }
                        />
                        <FormHelperText 
                            // sx={{color: '#FF1744'}} 
                        >{ errors.zipCode?.message }</FormHelperText>
                    </FormControl>
                
                </Grid>
                <Grid item xs={12} sm={ 6 } 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column'
                    }}
                >
                    <InputLabel sx={{mb:1.5}}>
                        <Typography variant="subtitle2">
                            City
                        </Typography>
                    </InputLabel>
                    <FormControl variant="outlined">
                        <OutlinedInput
                            type={ `text`}
                            placeholder="City"  
                            fullWidth 
                            { ...register('city', {
                                required: `This fieds is required`,
                                // minLength: { value: 6, message: `Caracter min: 6`}
                            })}    
                            error={ !!errors.city }
                            endAdornment={ 
                                <InputAdornment position="end">
                                <LocationCityOutlined />
                                </InputAdornment>
                            }
                        />
                        <FormHelperText 
                            // sx={{color: '#FF1744'}} 
                        >{ errors.city?.message }</FormHelperText>
                    </FormControl>

                </Grid>

                {/* Country and phone */}
                <Grid item xs={12} sm={ 6 } 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column'
                    }}
                >
                    <InputLabel sx={{mb:1.5}}>
                        <Typography variant="subtitle2">
                            Country:
                        </Typography>
                    </InputLabel>

                    <FormControl 
                        fullWidth
                    >
                        {/* <Select
                            variant="outlined"
                            // value={ defaultCountry }
                            value={ watch('country')}
                            { ...register('country',{
                                required: `This field is required`
                            })}
                            error={ !!errors.country }
                        >
                            {
                                countries.map( ({name, code}) => (
                                    <MenuItem 
                                        key={ code }
                                        value={ code }
                                        
                                    >
                                    {name}
                                    </MenuItem>

                                ))
                            }
                            
                        </Select>
                        <FormHelperText >{ errors.country?.message }</FormHelperText> */}

                    <TextField 
                        // select
                        placeholder="Zip Code:" 
                        label={  <LocalShippingOutlined /> } 
                        variant="outlined" 
                        fullWidth 
                        // defaultValue={ watch('country')}
                        { ...register('country',{
                            required: `This field is required`
                        })}
                        error={ !!errors.country }
                        helperText={  errors.country?.message  }
                    >
                        {
                                countries.map( ({name, code}) => (
                                    <MenuItem 
                                        key={ code }
                                        value={ code }
                                        
                                    >
                                    {name}
                                    </MenuItem>

                                ))
                            }
                    </TextField>
                   
                    </FormControl>

                </Grid>

                <Grid item xs={12} sm={ 6 } 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column'
                    }}
                >
                    <InputLabel sx={{mb:1.5}}>
                        <Typography variant="subtitle2">
                            Phone:
                        </Typography>
                    </InputLabel>

                    <FormControl variant="outlined">
                        <OutlinedInput
                            type={ `text`}
                            placeholder="Phone"  
                            fullWidth 
                            { ...register('phone', {
                                required: `This fieds is required`,
                                // minLength: { value: 6, message: `Caracter min: 6`}
                            })}    
                            error={ !!errors.phone }
                            endAdornment={ 
                                <InputAdornment position="end">
                                <ContactPhoneOutlined />
                                </InputAdornment>
                            }
                        />
                        <FormHelperText 
                            // sx={{color: '#FF1744'}} 
                        >{ errors.phone?.message }</FormHelperText>
                    </FormControl>

                </Grid>

            </Grid>

            {/* Button  */}
            <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
                <Button 
                    color="secondary" 
                    type="submit"
                    className="circular-btn" 
                    size="large"
                    // href="/checkout/summary"
                >
                    Review Order
                </Button>
            </Box>
        </form>
    </ShopLayout>
  )
}

export default AddressPage