import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Only the local GitHub mark (public/photos/logos/github-logo.svg) needs this —
    // no remote/user-supplied SVGs are ever rendered through next/image.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
