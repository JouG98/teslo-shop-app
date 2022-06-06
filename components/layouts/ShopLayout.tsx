import Head from "next/head";
import { FC, ReactNode } from "react"
import { Navbar, SideMenu } from "../ui";

interface Props {
    children?: ReactNode;
    imageFullURL?: string;
    pageDescription: string;
    title: string;
}

export const ShopLayout:FC<Props> = (
    {
        imageFullURL, pageDescription, title, children
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

            {
                (imageFullURL) && (
                    <meta name="og:image" content={ imageFullURL }/>
                )
            }
        </Head>

        <nav>
            <Navbar />
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
            { children }
        </main>

        <footer>
            {/* Custom Footer */}
        </footer>
    </>
  )
}
