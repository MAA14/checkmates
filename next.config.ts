import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN,
    WHATSAPP_API_URL: process.env.WHATSAPP_API_URL,
  },
};

export default nextConfig;
