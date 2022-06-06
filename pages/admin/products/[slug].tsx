import React, { FC , useRef, useState} from 'react'
import { GetServerSideProps } from 'next'
import { AdminLayout } from '../../../components/layouts'
import { IProduct } from '../../../interfaces';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined, AccountBoxOutlined } from '@mui/icons-material';
import { dbProducts } from '../../../database';
import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField, OutlinedInput, FormHelperText, InputAdornment, InputLabel, Typography } from '@mui/material';
import { routingPages } from '../../../utils/routes';
import { useForm } from 'react-hook-form';
import { IType, IGender, ISize } from '../../../interfaces/products';
import { useEffect, ChangeEvent } from 'react';
import { tesloApi } from '../../../api';
import { ProductModel } from '../../../models';
import { useRouter } from 'next/router';


const validTypes  = ['shirts','pants','hoodies','hats']
const validGender = ['men','women','kid','unisex']
const validSizes = ['XS','S','M','L','XL','XXL','XXXL']

const [ , , , , , adminProduct ] = routingPages.adminPages;

const s = {
    display: 'flex', 
    flexDirection: 'column',
    mb:2
}
interface Props {
    product: IProduct;
}

const ProductAdminPage:FC<Props> = ({ product }) => {

    const { replace } = useRouter();

    const inputRef = useRef<HTMLInputElement>(null);

    const [newTagValue, setNewTagValue] = useState('');
    const [saving, setSaving] = useState(false);

    const { register, handleSubmit, watch, formState: { errors }, reset, getValues, setValue } = useForm({
        defaultValues: product
    });

    // Sugerir Slug
    useEffect(() => {
      const subscription = watch( (value, { name, type}) => {
        if(name === 'title'){
            const newSlug = value.title?.trim()
                                .replaceAll(' ', '_')
                                .replaceAll("'", '')
                                .toLowerCase() || '';

            setValue('slug', newSlug);
        }
      })
    
    //   Limpia la subscriptipon
      return () => subscription.unsubscribe();
    }, [watch, setValue])
    

    const onChangeSizes = ( size: ISize ) => {

        // Arreglo actual de las tallas
        const currentSizes = getValues('sizes');

        /**
         * si la talla seleccionada existe en el arreglo
         * la elimino
         */
        if( currentSizes.includes(size))
            return setValue('sizes', 
                        currentSizes.filter( s => s!== size), 
                        { shouldValidate: true}
                    );

        /**
         * si la talla seleccionada no existe en el arreglo
         * la agrego
         */
        setValue('sizes', 
                    [ ...currentSizes, size], 
                    { shouldValidate: true}
                );

    }

    const onNewTags = ( ) => {

        const nTagValue = newTagValue.trim().toLowerCase();
        setNewTagValue('');

        
        const currentTag = getValues('tags');

        // Quiere volver a escribir el mismo tag
        if(currentTag.includes(nTagValue)) return

        currentTag.push(nTagValue);
        // setValue('tags', [...currentTag, newTagValue]);


    }

    const onDeleteTag = ( tag: string ) => {

        const updatedTag = getValues('tags').filter(t => t!== tag);

        setValue('tags', 
                        updatedTag, 
                        {shouldValidate: true}
                    );

    }

    const onFiledSeleced = async ( {target} : ChangeEvent<HTMLInputElement>) => {

        if( !target.files || target.files.length === 0) return

        // console.log(target);
        try {
            
            for(const file of target.files){
    
                const formData = new FormData();
                formData.append('file', file);
                // console.log(file);
                    
                const { data } = await tesloApi.post<{msg:string}>('/admin/upload', formData)
                console.log({data})

                setValue('images', [...getValues('images'), data.msg], {shouldValidate:true})
            }

        } catch (error) {
            console.log({error});
        }
    }

    const onDeleteImage = async ( image: string ) => {

        // Opcion no funcional

        /**
         * El inconveniente es: cuando cargas la img,
         * se sube directamente a cloudinary, si la borras 
         * antes de actualizar la info esta el problema,
         * hace bien el proceso de no reflejarse, pero no 
         * se borra de cloudinary y se pierde la referencia
         * ID de la imagen 
         */

        // try {

        //     const { data } = await tesloApi({
        //         url: `/admin/upload`,
        //         // data: image,
        //         params: {image},
        //         method: 'DELETE'
        //     });

        //     console.log({data})
            
        // } catch (error) {
        //     console.log(error)
        // }

        setValue('images', getValues('images')
        .filter( img => img !==image),
        { shouldValidate: true})
    } 

    const onUpdateProduct = async ( dataForm: IProduct ) => {

        // console.log(data)

        if(dataForm.images.length < 2 ) return;

        setSaving(true);

        try {
            const { data } = await tesloApi({
                url: '/admin/products',
                data: dataForm,
                method: dataForm._id ? 'PUT' : 'POST'
            });

            if(!dataForm._id){
                // TODO: crear producto
                replace(`/admin/products/${dataForm.slug}`)
            }

            setSaving(false)

            console.log(data);
        } catch (error) {
            console.log(error);
        }

    }
 
    return (
        <AdminLayout 
            title={adminProduct.namePage}
            subTitle={`Editando: ${product.title}`}
            icon={<DriveFileRenameOutline />} 
            pageDescription={adminProduct.description}        
        >
            <form
                onSubmit={handleSubmit(onUpdateProduct)}
                noValidate // desactiva valodate html
            >

                {/* BTN SAVE */}
                <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
                    <Button 
                        color="secondary"
                        startIcon={ <SaveOutlined /> }
                        sx={{ width: '150px' }}
                        type="submit"
                        disabled={saving}
                        >
                            {product._id ? 'Update' : 'Save'}
                        {/* Guardar */}
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    {/* TODOD */}

                    {/* letf */}
                    <Grid item xs={12} sm={6}>
                         {/* Title and description */}
                        <Grid item  
                            sx={s}
                        >
                            <InputLabel htmlFor="component-error" sx={{mb:1.5}}>
                                <Typography variant="subtitle2">
                                    Title:
                                </Typography>
                            </InputLabel>

                            <FormControl variant="outlined">
                                <OutlinedInput
                                    type={ `text`}
                                    placeholder="Short"  
                                    fullWidth 
                                    { ...register('title', {
                                        required: `This fieds is required`,
                                        // // minLength: { value: 6, message: `Caracter min: 6`}
                                    })}    
                                    error={ !!errors.title }
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
                                >
                                    {/* { errors.firstName?.message } */}
                                    </FormHelperText>
                            </FormControl>

                        </Grid>

                        <Grid item 
                            sx={s}
                        >
                            <InputLabel sx={{mb:1.5}}>
                                <Typography variant="subtitle2">
                                    Description:
                                </Typography>
                            </InputLabel>

                            <FormControl variant="outlined">
                                <OutlinedInput
                                    type={ `text`}
                                    placeholder="This a product"  
                                    fullWidth 
                                    { ...register('description', {
                                        required: `This fieds is required`,
                                        // minLength: { value: 6, message: `Caracter min: 6`}
                                    })}    
                                    error={ !!errors.description }
                                    endAdornment={ 
                                        <InputAdornment position="end">
                                        <AccountBoxOutlined />
                                        </InputAdornment>
                                    }
                                />
                                <FormHelperText 
                                    // sx={{color: '#FF1744'}} 
                                >
                                    {/* { errors.lastName?.message } */}
                                    </FormHelperText>
                            </FormControl>

                        </Grid>

                        {/* Inventary and price */}
                        <Grid item 
                            sx={s}
                        >
                            <InputLabel htmlFor="component-error" sx={{mb:1.5}}>
                                <Typography variant="subtitle2">
                                    Inventary:
                                </Typography>
                            </InputLabel>

                            <FormControl variant="outlined">
                                <OutlinedInput
                                    type={ `number`}
                                    placeholder="Count Product"  
                                    fullWidth 
                                    { ...register('inStock', {
                                        required: `This fieds is required`,
                                        // // minLength: { value: 6, message: `Caracter min: 6`}
                                    })}    
                                    error={ !!errors.inStock }
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
                                >
                                    {/* { errors.firstName?.message } */}
                                    </FormHelperText>
                            </FormControl>

                        </Grid>

                        <Grid item  
                            sx={s}
                        >
                            <InputLabel sx={{mb:1.5}}>
                                <Typography variant="subtitle2">
                                    Price:
                                </Typography>
                            </InputLabel>

                            <FormControl variant="outlined">
                                <OutlinedInput
                                    type={ `number`}
                                    placeholder="Value of product"  
                                    fullWidth 
                                    { ...register('price', {
                                        required: `This fieds is required`,
                                        // minLength: { value: 6, message: `Caracter min: 6`}
                                    })}    
                                    error={ !!errors.price }
                                    endAdornment={ 
                                        <InputAdornment position="end">
                                        <AccountBoxOutlined />
                                        </InputAdornment>
                                    }
                                />
                                <FormHelperText 
                                    // sx={{color: '#FF1744'}} 
                                >
                                    {/* { errors.lastName?.message } */}
                                    </FormHelperText>
                            </FormControl>

                        </Grid>

                        {/* Tipo and Gender*/}
                        <Grid item  
                            sx={s}
                        >
                            <FormControl sx={{ mb: 2 }}>
                                <FormLabel>Tipo</FormLabel>
                                <RadioGroup
                                    row
                                    value={ getValues('type') }
                                    onChange={ ({target}) => setValue('type', target.value as IType, {shouldValidate: true}) }
                                >
                                    {
                                        validTypes.map( option => (
                                            <FormControlLabel 
                                                key={ option }
                                                value={ option }
                                                control={ <Radio color='secondary' /> }
                                                label={ capitalize(option) }
                                            />
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>

                            <FormControl sx={{ mb: 2 }}>
                                <FormLabel>Género</FormLabel>
                                <RadioGroup
                                    row
                                    value={ getValues('gender') }
                                    onChange={ ({target}) => setValue('gender', target.value as IGender, {shouldValidate: true}) }
                                    // onChange={ onStatusChanged }
                                >
                                    {
                                        validGender.map( option => (
                                            <FormControlLabel 
                                                key={ option }
                                                value={ option }
                                                control={ <Radio color='secondary' /> }
                                                label={ capitalize(option) }
                                            />
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        {/* Sizes */}
                        <Grid item 
                            sx={s}
                        >
                        <FormGroup
                            sx={{
                                display: 'inline-block',
                                flexDirection: 'row',
                                gap: 1
                            }}
                        >
                                <FormLabel sx={{display: 'block'}} >Tallas</FormLabel>
                                    {
                                        validSizes.map(size => (
                                            <FormControlLabel 
                                                sx={{
                                                    // display: 'flex',
                                                    // flexDirection: 'row'
                                                }} 
                                                key={size} 
                                                control={
                                                    <Checkbox 
                                                        sx={{ display: 'flex', flexDirection: 'row'}} 
                                                        checked={ getValues('sizes').includes(size as ISize)}
                                                    />
                                                } 
                                                label={ size } 

                                                onChange={ () => onChangeSizes( size as ISize )}
                                            
                                            />
                                        ))
                                    }
                            </FormGroup>
                        </Grid>
                    </Grid>
                    
                    {/* right */}
                    <Grid item xs={12} sm={6}>
                         {/* Otro compartimiento */}

                        {/* Slug */}
                        <Grid item  
                            sx={s}
                        >
                            <InputLabel htmlFor="component-error" sx={{mb:1.5}}>
                                <Typography variant="subtitle2">
                                    Slug:
                                </Typography>
                            </InputLabel>

                            <FormControl variant="outlined">
                                <OutlinedInput
                                    type={ `text`}
                                    placeholder="Slug"  
                                    fullWidth 
                                    { ...register('slug', {
                                        required: `This fieds is required`,
                                        // // minLength: { value: 6, message: `Caracter min: 6`}
                                    })}    
                                    error={ !!errors.slug }
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
                                >
                                    { errors.slug?.message }
                                    </FormHelperText>
                            </FormControl>

                        </Grid>
                        {/* Tags */}
                        <Grid item  
                            sx={s}
                        >
                            <InputLabel sx={{mb:1.5}}>
                                <Typography variant="subtitle2">
                                    Tags:
                                </Typography>
                            </InputLabel>

                            <FormControl variant="outlined">
                                <OutlinedInput
                                    type={ `text`}
                                    placeholder="tags"  
                                    fullWidth
                                    value={newTagValue}
                                    onChange={ ({target}) => setNewTagValue( target.value)}
                                    onKeyUp={ ({code}) => code === 'Space' ? onNewTags(): undefined}
                                    endAdornment={ 
                                        <InputAdornment position="end">
                                        <AccountBoxOutlined />
                                        </InputAdornment>
                                    }
                                />
                                <FormHelperText 
                                    // sx={{color: '#FF1744'}} 
                                >
                                    Press Space to add
                                    {/* { errors.tags?.message } */}
                                </FormHelperText>
                            </FormControl>

                        </Grid>

                        {/* Tags - circular */}
                        <Grid item  
                            sx={s}
                        >
                            <InputLabel sx={{mb:1.5}}>
                                <Typography variant="subtitle2">
                                    Tags:
                                </Typography>
                            </InputLabel>

                            <Box sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    listStyle: 'none',
                                    p: 0,
                                    m: 0,
                                }}
                                component="ul">
                                    {
                                        getValues('tags').map((tag) => {

                                        return (
                                            <Chip
                                                key={tag}
                                                label={tag}
                                                onDelete={ () => onDeleteTag(tag)}
                                                color="primary"
                                                size='small'
                                                sx={{ ml: 1, mt: 1}}
                                            />
                                        );
                                    })}
                                </Box>

                        </Grid>

                        {/* UploadImg */}
                        <Grid item xs={12} sm={ 12 } 
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column'
                            }}
                        >
                            <InputLabel htmlFor="component-error" sx={{mb:1.5}}>
                                <Typography variant="subtitle2">
                                    Upload:
                                </Typography>
                            </InputLabel>

                            <Box display='flex' flexDirection="column">
                                    <FormLabel sx={{ mb:1}}>Imágenes</FormLabel>
                                    <Button
                                        color="secondary"
                                        fullWidth
                                        startIcon={ <UploadOutlined /> }
                                        sx={{ mb: 3 }}
                                        onClick={ () => inputRef.current?.click()}
                                    >
                                        Cargar imagen
                                    </Button>

                                    <input
                                        type={'file'}
                                        accept='image/png, image/gif, image/jpg, image/jpge'
                                        style={{display: 'none'}}
                                        multiple
                                        ref={inputRef}
                                        onChange={ onFiledSeleced }
                                    />

                                    <Chip 
                                        label="Es necesario al 2 imagenes"
                                        color='error'
                                        variant='outlined'
                                        sx={{ display: getValues('images').length < 2 ?'flex':'none'}}
                                    />

                                    <Grid container spacing={2}>
                                        {
                                            getValues('images').map( img => (
                                                <Grid item xs={12} sm={6} md={4} lg={3} key={img}>
                                                    <Card>
                                                        <CardMedia 
                                                            component='img'
                                                            className='fadeIn'
                                                            image={  img  }
                                                            alt={ img }
                                                        />
                                                        <CardActions>
                                                            <Button 
                                                                fullWidth 
                                                                color="error"
                                                                onClick={ ( ) => onDeleteImage(img)}
                                                            >
                                                                Borrar
                                                            </Button>
                                                        </CardActions>
                                                    </Card>
                                                </Grid>
                                            ))
                                        }
                                    </Grid>

                                </Box>
                        </Grid>       
                    </Grid>

                </Grid>
            </form>
        </AdminLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    
    const { slug = ''} = query;

    let product : IProduct | null;

    if( slug === 'new'){
        // crear producto 
        const tempProduct = JSON.parse(JSON.stringify( new ProductModel()))

        delete tempProduct._id;
        tempProduct.images = [ 'image1.jpg', 'image2.jpg'];
        product = tempProduct;
    } else {

        product = await dbProducts.getProductBySlug(slug.toString());
    }
    

    if ( !product ) {
        return {
            redirect: {
                destination: '/admin/products',
                permanent: false,
            }
        }
    }
    

    return {
        props: {
            product
        }
    }
}


export default ProductAdminPage