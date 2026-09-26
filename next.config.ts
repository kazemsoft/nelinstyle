import type { NextConfig } from 'next';
const config: NextConfig = { poweredByHeader:false, turbopack:{root:process.cwd()},async redirects(){return [{source:'/',destination:'/fa',permanent:false}]}};
export default config;
