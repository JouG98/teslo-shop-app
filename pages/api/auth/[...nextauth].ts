import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import GitlabProvider from "next-auth/providers/gitlab";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { dbUsers } from "../../../database";

export default NextAuth({

  // Configure one or more authentication providers
  providers: [

  // credentials  

    Credentials({
      name: 'Custom Login',
      credentials:{
        email: {
          label: 'Email:', type: 'email', placeholder: 'name@google.com',
        },
        password:{
          label: 'Password:', type: 'password', placeholder: '********',
        }
      },

      async authorize( credentials ){
        // console.log({credentials})

        // return null;
        // return { name: 'Barry', email: 'flash@gmail.com', rol: 'admin' }

        return await dbUsers.checkUserEmailAndPassword(credentials!.email, credentials!.password);
      }
    }),
  
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here

    GitlabProvider({
        clientId: process.env.GITLAB_CLIENT_ID,
        clientSecret: process.env.GITLAB_CLIENT_SECRET,
    }),

    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
    }),

    FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID || '',
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    }),
  ],

  // pages: especificar paginas personalizadas
  pages:{
    signIn:`/auth/login`,
    newUser: `/auth/register`, 
  },

 
  jwt:{

  },

  // Sesion
  // session:{
  //   maxAge: 2592000,  // 30dias
  //   strategy: 'jwt',
  //   updateAge: 86400, // cada dia
  // },

   // callbacks
  callbacks: {
    async jwt({ token, account, user }) {
      // Persist the OAuth access_token to the token right after signin
      // console.log({user})
      // console.log({account})
      if (account) {
        token.accessToken = account.access_token

        switch( account.type ){

          case 'oauth':
            // TODO: crear o verificar user en mi db

            token.user = await dbUsers.OAuthToDbUser( 
              user?.email || '', 
              user?.name || '', 
              user?.image || '',
              account.provider,
            );
          break;

          case 'credentials':
            token.user = user;
            break;

          
        }
      }
      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      // console.log(user)
      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session
    }
  },


})