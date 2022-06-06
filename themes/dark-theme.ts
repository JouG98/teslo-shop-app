import { createTheme } from '@mui/material';
import { grey, red,  } from '@mui/material/colors';


export const darkTheme = createTheme({
   palette:{
       mode: 'dark',
      background:{
        //   default: 'hsl(250, 30%, 8%)'
        //   default: 'rgba(0, 0, 0, 0.54)'
          default: '#181818'
          // default: '#000'
      },
      primary:{
        //   main: '#1E1E1E',
          main: '#e1e1e1',
      },
       secondary:{
              main: '#3A64D8'
        //    main: '#19857b',
        //    main: red[100],
       },
       info:{
        // main: '#121212'
        main: '#202020'
      },
       error:{
           main: red.A400,
       }
   },

   components:{
     
    MuiLink: {
        defaultProps: {
            underline: 'none',
        },
    },
    MuiAppBar:{
        defaultProps:{
            elevation: 0,
            position: 'fixed',
            
        },
        styleOverrides:{
            root:{
               backgroundColor: '#202020',
              //  backgroundColor: '#121212',
            //    backgroundColor: '#1f1f1f',
                    height: 60
            }
        }
    },

    MuiTypography: {
        styleOverrides: {
            h1: {
                fontSize: 30,
                fontWeight: 600
            },
            h2: {
                fontSize: 20,
                fontWeight: 400
            },
            subtitle1: {
                fontSize: 18,
                fontWeight: 600
            },
            root:{
                // color: '#e1e1e1'
                color: 'rgba(255, 255, 255, 0.7)'
            }
        } 

    },

    MuiButton: {
        defaultProps: {
          variant: 'contained',
          size: 'small',
          disableElevation: true,
          color: 'info'
        },
        styleOverrides: {
          root: {
            // backgroundColor:'white',
            // color:'#e1e1e1',
            // backgroundColor: '#121212',
            textTransform: 'none',
            boxShadow: 'none',
            borderRadius: 10,
            ":hover": {
              color: '#000',
              backgroundColor: 'rgba(255,255,255,255.05)',
              transition: 'all 0.3s ease-in-out'
            }
          }
        }
      },

      MuiCard: {
        defaultProps: {
          elevation: 0
        },
        styleOverrides: {
          root: {
            boxShadow: '0px 5px 5px rgba(0,0,0,0.05)',
            borderRadius: '10px',
            // backgroundColor: 'rgba(0, 0, 0, 0.54)'
          }
        }
      },
      
       
   }
})