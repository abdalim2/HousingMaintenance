/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Provide polyfills for Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: require.resolve('node-libs-browser/mock/net'),
        tls: require.resolve('node-libs-browser/mock/tls'),
        fs: require.resolve('node-libs-browser/mock/empty'),
        dns: require.resolve('node-libs-browser/mock/dns'),
        pg: false,
        'pg-native': false,
        path: require.resolve('path-browserify'),
      };
    }
    return config;
  },
  // Moved out of experimental section
  serverExternalPackages: ['pg'],
};

module.exports = nextConfig;