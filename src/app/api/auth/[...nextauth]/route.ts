/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import { publicPost } from '~/api/request';

async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await publicPost('/api/auth/refresh-token', { refresh_token: refreshToken });
    return {
      accessToken: response.data.result.access_token,
      accessTokenExpires: response.data.result.exp,
      refreshToken: response.data.result.refresh_token,
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
        try {
          const { email, password } = credentials;
          const response = await publicPost('/api/auth/login', { email, password });

          // Trả về dữ liệu người dùng nếu thành công
          return response.data.result; // Giả sử dữ liệu trả về nằm trong result
        } catch (error: any) {
          // Xử lý lỗi từ server
          const errorData = error.response?.data;

          // Ném lỗi có cấu trúc để client xử lý
          throw new Error(
            JSON.stringify({
              message: errorData?.message || 'Authentication failed',
              errors: errorData?.errors,
            })
          );
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
          user: user.user,
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
      session.user = token.user; // Thêm thông tin người dùng vào session
      return session;
    },
  },
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
