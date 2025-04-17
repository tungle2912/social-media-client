/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import { publicPost } from '~/api/request';

async function refreshAccessToken(refreshToken: string) {
  try {
    console.log('1');
    const response = await publicPost('/api/auth/refresh-token', { refresh_token: refreshToken });
    return {
      accessToken: response.result.access_token,
      accessTokenExpires: response.result.exp,
      refreshToken: response.result.refresh_token,
    };
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    return null; // Trả về null nếu refresh thất bại
  }
}

const nextAuthOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials: any) {
        const { email, password } = credentials;
        const res = await publicPost('/api/auth/login', { email, password });
        if (res.result) {
          return res.result; // Trả về { access_token, refresh_token, exp, role }
        } else {
          // Nếu có lỗi từ server, tạo thông điệp lỗi
          const errorMessage = res.errors
            ? Object.values(res.errors)
                .map((err: any) => err.msg)
                .join(', ') // Ghép các thông điệp lỗi nếu có nhiều lỗi
            : res.message || 'Authentication failed'; // Dùng message mặc định nếu không có errors
          throw new Error(errorMessage);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET || '',
  callbacks: {
    async signIn({ account, profile }: any) {
      if (account.provider === 'google') {
        return profile.email_verified;
      }
      return true;
    },
    async redirect({ url, baseUrl }: any) {
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
    async jwt({ token, user, account }: any) {
      const currentTime = Date.now() / 1000; // Thời gian hiện tại tính bằng giây

      // Xử lý khi đăng nhập lần đầu (Credentials)
      if (user) {
        return {
          ...token,
          accessToken: user.access_token,
          refreshToken: user.refresh_token,
          accessTokenExpires: user.exp, // Sử dụng trực tiếp exp từ server
          isAuthenticated: true,
        };
      }
      // Xử lý đăng nhập SSO (Google, GitHub)
      else if (account) {
        token.accessToken = account.access_token;
        // Nếu SSO cung cấp exp, có thể thêm vào đây
      }

      // Kiểm tra và làm mới token nếu cần
      if (token.accessTokenExpires) {
        const threshold = 300; // 5 phút trước khi hết hạn
        if (currentTime + threshold >= token.accessTokenExpires) {
          const refreshedTokens = await refreshAccessToken(token.refreshToken);
          if (refreshedTokens) {
            token.accessToken = refreshedTokens.accessToken;
            token.accessTokenExpires = refreshedTokens.accessTokenExpires;
            token.refreshToken = refreshedTokens.refreshToken;
          }
        }
        // Cập nhật trạng thái xác thực dựa trên token hiện tại
        token.isAuthenticated = currentTime < token.accessTokenExpires;
      } else {
        // Với SSO không có exp, giả định luôn xác thực
        token.isAuthenticated = true;
      }

      return token;
    },
    async session({ session, token }: any) {
      // Truyền các giá trị từ token sang session để sử dụng phía client
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.accessTokenExpires = token.accessTokenExpires;
      session.isAuthenticated = token.isAuthenticated;
      return session;
    },
  },
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
