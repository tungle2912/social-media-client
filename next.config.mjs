/** @type {import('next').NextConfig} */
import withPlugins from 'next-compose-plugins';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();
const plugins = [];

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  output: 'standalone',
  // Use the CDN in production and localhost for development. https://nextjs.org/docs/app/api-reference/next-config-js/assetPrefix
  assetPrefix: isProd ? process.env.CDN_HOST : undefined,
  // experimental: {
  //   appDir: true, // Nếu bạn đang sử dụng App Directory trong Next.js 14
  // },
  sassOptions: {
    includePaths: ['./src', './styles'],
  },
  images: {
    // Learn more NextJS's remotePatterns: https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/my-bucket/**',
      },
    ],
    domains: ['res.cloudinary.com'],
  },
  // Doc: https://nextjs.org/docs/app/api-reference/next-config-js/redirects
  async redirects() {
    return [];
  },
};

export default withPlugins(plugins, withNextIntl(nextConfig));
