import { Box, Typography } from "@mui/material";
import Head from "next/head";
import { FC, ReactNode } from "react"
import { AdminNavbar } from "../admin";
import { Navbar, SideMenu } from "../ui";

interface Props {
    children?: ReactNode;
    pageDescription: string;
    title: string;
    subTitle: string;
    icon: JSX.Element;
}

export const AdminLayout:FC<Props> = (
    {
        pageDescription, title, subTitle, icon, children
    }
) => {
  return (
    <>
        <Head>
            <title>
                { title }
            </title>

            <meta name="description" content={ pageDescription } />

            <meta name="og:title" content={ title }/>
            <meta name="og:description" content={ pageDescription }/>

        </Head>

        <nav>
            <AdminNavbar />
        </nav>

        {/* Siderbar */}
        <SideMenu />

        <main
            style={{
                margin: `80px auto`,
                maxWidth: `1440px`,
                padding: `0px 30px`,
            }}
        >
            <Box
                display={'flex'}
                flexDirection='column'
            >
                <Typography
                    variant="h1"
                    component={'h1'}
                >
                    {icon}
                    {title}
                </Typography>

                <Typography
                    variant="h2"
                    mb={1}
                >
                    {subTitle}
                </Typography>
            </Box>
            { children }
        </main>

        <footer>
            {/* Custom Footer */}
        </footer>
    </>
  )
}
