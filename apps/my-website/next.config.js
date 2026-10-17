//@ts-check

const { composePlugins, withNx } = require("@nx/next");

/**
 * @type {import("@nx/next/plugins/with-nx").WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
  distDir: "../../dist/apps/my-website",
  output: "export",
  images: { unoptimized: true },
  // Experience durations count up to the month the site was built
  env: { BUILD_DATE: new Date().toISOString() },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
