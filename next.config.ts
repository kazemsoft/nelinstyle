import type { NextConfig } from 'next';
const config: NextConfig = {
 // Standalone output only for the Docker build (Dockerfile sets NEXT_OUTPUT); `npm start` and Vercel use the default.
 ...(process.env.NEXT_OUTPUT==='standalone'&&{output:'standalone' as const}),
 // Stage host CPU lacks SSE4.2, so sharp crashes (SIGILL); serve originals there.
 images:{unoptimized:process.env.NEXT_IMAGE_UNOPTIMIZED==='1'},
 poweredByHeader:false, turbopack:{root:process.cwd()},
 async redirects(){return [{source:'/',destination:'/fa',permanent:false}]},
 async headers(){return [{source:'/:path*',headers:[{key:'X-Content-Type-Options',value:'nosniff'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},{key:'X-Frame-Options',value:'DENY'}]}]}};
export default config;
