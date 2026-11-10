/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  // 开发模式的悬浮标识会压住手机端底栏，关掉
  devIndicators: { appIsrStatus: false, buildActivity: false },
};

export default nextConfig;
