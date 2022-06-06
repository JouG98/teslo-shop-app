import { useState, useContext } from 'react';

import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { GetServerSideProps } from 'next'

import { useForm } from 'react-hook-form';

import { Box, Button, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, Link, OutlinedInput,  Typography, Chip } from '@mui/material';
import {  AlternateEmailOutlined, AccountCircleOutlined, VisibilityOutlined, VisibilityOffOutlined } from '@mui/icons-material';

import { AuthLayout } from '../../components/layouts'
import { validations } from '../../utils';
import { AuthContext } from '../../context';
import { SocialNetwork } from '../../components/ui';


type DataForm = {
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
};

const RegisterPage = () => {

    const { registerUser } = useContext(AuthContext);

    const { replace, query } = useRouter();

    const [showText, setShowText] = useState(false);
    const [showText1, setShowText1] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [showError, setShowError] = useState(false);
    const [msgError, setMsgError] = useState('');


    const { register, handleSubmit, watch, formState: { errors } } = useForm<DataForm>({mode:'onTouched'});

    const onRegister = async ( { name, email, password}: DataForm) => {
        // console.log(dataF)
        setBtnDisabled(true);
        setShowError(false);

        const { hasError, msg } = await registerUser( name, email, password);

        if( hasError ){
            setShowError(true)
            setMsgError(msg!);
            setTimeout(() => {
                setShowError(false);
                setBtnDisabled(false)
            }, 3000);
            return
        }

        setBtnDisabled(false);

        // const destination = query.p?.toString() || '/';
        // replace(destination)

        await signIn('credentials', { email, password});

      
    }

    const handleViewText = ( ) => {
        setShowText(!showText);
    }
    const handleViewText1 = ( ) => {
        setShowText1(!showText1);
    }

    const matchPassword = watch('password');

  return (
    <AuthLayout title={'Register acount'}>
        <form onSubmit={handleSubmit(onRegister)} noValidate>
            <Box sx={{ width: 350, padding:'10px 20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h1' component="h1">Create an account</Typography>

                        <Chip 
                            color='error'
                            label={ msgError }
                            sx={{
                                display: showError ? 'flex' : 'none',
                                mt: '.9rem'
                            }}
                        />
                    </Grid>

                    {/* UserAcount */}
                    <Grid item xs={12} 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column'
                        }}
                    >
                        <InputLabel sx={{mb:1.5}}>
                            <Typography variant="subtitle2">
                                User:
                            </Typography>
                        </InputLabel>

                        <FormControl variant="outlined">
                            <OutlinedInput
                            // autoFocus={true}
                                type={`text`}
                                placeholder="UserName" 
                                fullWidth 
                                { ...register('name', {
                                    required: `This fieds is required`,
                                    minLength: { value: 3, message: `Caracter min: 3`}
                                })}

                                error={ !!errors.name }
                                endAdornment={ 
                                    <InputAdornment position="end">
                                        <AccountCircleOutlined />
                                    </InputAdornment>
                                }
                            />
                            <FormHelperText>{ errors.name?.message }</FormHelperText>
                        </FormControl>

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
                                placeholder="UserName" 
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

                    {/* password */}
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


                    {/* Confirm passwprd */}
                    <Grid item xs={12} 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column'
                        }}
                    >
                        <InputLabel sx={{mb:1.5}}>
                            <Typography variant="subtitle2">
                                Confirm Password:
                            </Typography>
                        </InputLabel>

                        <FormControl variant="outlined">
                            <OutlinedInput
                                type={ showText1 ? `text` : `password`}
                                placeholder="*******" 
                                onPaste={ ( e ) => { e.preventDefault(); return false}}
                                fullWidth 
                                { ...register('confirmPassword', {
                                    required: `This fieds is required`,
                                    minLength: { value: 6, message: `Caracter min: 6`},
                                    validate: ( value ) => value === matchPassword || `The password don´t match`
                                    
                                })}

                                error={ !!errors.confirmPassword }
                                endAdornment={ 
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={ handleViewText1 }
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
                            <FormHelperText>{ errors.confirmPassword?.message }</FormHelperText>
                        </FormControl>
                    
                    </Grid>

                    {/* Button register */}
                    <Grid item xs={12}>
                        <Button  
                            type='submit'
                            color="secondary" 
                            className='circular-btn' 
                            size='large' 
                            disabled={ btnDisabled}
                            fullWidth
                        >
                            Register
                        </Button>
                    </Grid>

                    {/* Redirection acount */}
                    <Grid item xs={12} display='flex' justifyContent='end'>
                        <NextLink href={`/auth/login?p=${query.p?.toString()}`} passHref>
                            <Link underline='always'>
                                Already have an account?
                            </Link>
                        </NextLink>
                    </Grid>


                    {/* Social Network */}
                    <SocialNetwork />
                    
                </Grid>
            </Box>
        </form>
    </AuthLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query}) => {

    const sesion = await getSession({ req });

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

export default RegisterPage