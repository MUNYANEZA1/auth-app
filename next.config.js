// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'randomuser.me', 'ui-avatars.com'],
  },
}

module.exports = nextConfig