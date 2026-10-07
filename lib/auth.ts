import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { compare } from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    }),
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: any) {
        const email = String(credentials?.email || '').trim().toLowerCase()
        const password = String(credentials?.password || '')
        if (!email || !password) return null

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user?.passwordHash) return null

        const valid = await compare(password, user.passwordHash)
        if (!valid) return null

        return {
          id: user.id,
          name: user.name || email.split('@')[0],
          email: user.email,
          image: user.image || undefined
        }
      }
    })
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60
  },

  pages: {
    signIn: '/auth/login'
  },

  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === 'google' && user?.email) {
        const email = user.email.toLowerCase()

        await prisma.user.upsert({
          where: { email },
          update: {
            name: user.name || undefined,
            image: user.image || undefined,
            emailVerified: new Date()
          },
          create: {
            email,
            name: user.name || undefined,
            image: user.image || undefined,
            emailVerified: new Date()
          }
        })
      }

      return true
    },

    async jwt({ token, user }: any) {
      if (user?.id) token.sub = user.id
      return token
    },

    async session({ session, token }: any) {
      if (session?.user) session.user.id = token?.sub
      return session
    }
  }
}

export default authOptions
