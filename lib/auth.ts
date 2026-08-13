import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import * as prismaAdapterPkg from '@next-auth/prisma-adapter'
import { prisma } from './prisma'

const createPrismaAdapter = (prismaAdapterPkg as any)?.PrismaAdapter ?? (prismaAdapterPkg as any)
const adapterInstance = typeof createPrismaAdapter === 'function' ? createPrismaAdapter(prisma as any) : undefined

export const authOptions = {
  adapter: adapterInstance,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    }),
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      },
      from: process.env.SMTP_FROM || 'no-reply@brokeaf.app'
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, token, user }: any) {
      if (session?.user) session.user.id = token?.sub
      return session
    }
  }
}

export default authOptions
