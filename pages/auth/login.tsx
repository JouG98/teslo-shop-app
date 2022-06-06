import { useState, useEffect } from 'react';

import { getProviders, getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { GetServerSideProps } from 'next'

import { useForm } from 'react-hook-form';

import { Box, Button, FormControl, FormHelperText, Grid, InputAdornment, InputLabel, Link,  OutlinedInput,  Typography, Chip, IconButton } from '@mui/material';
import { AlternateEmailOutlined,  VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';

import { SocialNetwork } from '../../components/ui/SocialNetwork';
import { AuthLayout } from '../../components/layouts'
import { validations } from '../../utils';



type DataForm = {
    email: string,
    password: string,
};

const LoginPage = () => {

    const { replace, query, asPath } = useRouter();
    // const { loginUser } = useContext(AuthContext)

   
    

    const [showText, setShowText] = useState(false);
    const [showError, setShowError] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm<DataForm>({mode:'onTouched'});
    // console.log(register('email'))

    const onLogin = async ({email, password}: DataForm ) => {

        /**
         * 
         * Login sin nextAuth
         * 
            // console.log({data})
            setBtnDisabled(true);
            setShowError(false);
    
            const isAuth = await loginUser( email, password );
    
            if(!isAuth){
                setShowError(true)
                setTimeout(() => {
                    setShowError(false);
                    setBtnDisabled(false)
                }, 3000);
    
                return
            }
    
    
            setBtnDisabled(false);
    
            // navegacion con query
            const destination = query.p?.toString() || '/';
            replace(destination);
         * 
         */


        await signIn('credentials', { email, password});
    }

    const handleViewText = ( ) => {
        setShowText(!showText);
    }

    

  return (
    <AuthLayout title={'Ingresar'}>
        <form
            onSubmit={handleSubmit(onLogin)}
            noValidate // desactiva valodate html
        >
            <Box sx={{ width: 350, padding:'10px 20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h1' textAlign={`center`} component="h1">Login</Typography>

                        <Chip 
                            color='error'
                            label={`Error in email and password`}
                            sx={{
                                display: showError ? 'flex' : 'none',
                                mt: '.9rem'
                            }}
                        />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12} 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column'
                        }}
                    >
                        <InputLabel sx={{mb:1.5}}>
                            <Typography variant="subtitle2">
                                Email:
                            </Typography>
                        </InputLabel>

                        <FormControl variant="outlined">
                            <OutlinedInput
                                type={`email`}
                                placeholder="example@example.com" 
                                fullWidth 
                                { ...register('email', {
                                    required: `This fieds is required`,
                                    validate: validations.isEmail,
                                })}

                                error={ !!errors.email }
                                endAdornment={ 
                                    <InputAdornment position="end">
                                        <AlternateEmailOutlined />
                                    </InputAdornment>
                                }
                            />
                            <FormHelperText>{ errors.email?.message }</FormHelperText>
                        </FormControl>

                    </Grid>

                    
                    {/* Field password hidden and show */}
                    <Grid item xs={12} 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column'
                        }}
                    >
                        <InputLabel sx={{mb:1.5}}>
                            <Typography variant="subtitle2">
                                Password:
                            </Typography>
                        </InputLabel>

                        <FormControl variant="outlined">
                            <OutlinedInput
                                type={ showText ? `text` : `password`}
                                placeholder="*******" 
                                fullWidth 
                                { ...register('password', {
                                    required: `This fieds is required`,
                                    minLength: { value: 6, message: `Caracter min: 6`}
                                })}

                                error={ !!errors.password }
                                endAdornment={ 
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={ handleViewText }
                                        >
                                            {
                                                showText ?
                                                    <VisibilityOutlined />
                                                    :
                                                    <VisibilityOffOutlined />
                                            }
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            <FormHelperText>{ errors.password?.message }</FormHelperText>
                        </FormControl>
                    </Grid>

                    {/* button */}
                    <Grid item xs={12}>
                        <Button 
                            type='submit'
                            color="secondary" 
                            className='circular-btn' 
                            size='large' 
                            fullWidth
                            disabled={ btnDisabled}
                        >
                            Login
                        </Button>
                    </Grid>


                    <Grid item xs={12} display='flex' justifyContent='end'>
                        <NextLink href={`/auth/register?p=${query.p?.toString()}`} passHref>
                            <Link underline='always'>
                                {`Don't have an account?`}
                            </Link>
                        </NextLink>
                    </Grid>

                    {/* <Grid item xs={12} display='flex' justifyContent='end' flexDirection={`column`}>

                        {
                            Object.values( providers ).map( (provider: any) => {
                                
                                if( provider.id ===  'credentials'){
                                    return(
                                        <div key={ provider.id } ></div>
                                    )
                                }

                                return(
                                    <Button
                                        key={ provider.id}
                                        variant='outlined'
                                        fullWidth
                                        color='primary'
                                        sx={{ mb: 1}}
                                        onClick={ () => signIn(provider.id)}
                                    >
                                        { provider.name }
                                    </Button>
                                )
                            })
                        }


                    </Grid> */}


                {/* REdes Sociales */}
                <SocialNetwork />
                    

                </Grid>
            </Box>
        </form>
    </AuthLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {

    const sesion = await getSession({req});

    const { p = '/' } = query;
    
    if (sesion){
        return{
            redirect:{
                destination: p === undefined ? '/': p.toString(),
                permanent: false,
            }
        }
    }

    return {
        props: {
            
        }
    }
}

export default LoginPage