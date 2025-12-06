
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { hostname: 'picsum.photos' },
      { hostname: 'images.unsplash.com' },
      { hostname: 'i.postimg.cc' },
      { hostname: '*.imimg.com' },
      { hostname: '*.tistatic.com' },
      { hostname: 'i0.wp.com' },
      { hostname: 'www.unikeyterra.com' },
      { hostname: 'kisaancart.in' },
      { hostname: 'www.agroes.in' },
      { hostname: 'www.kribhco.net' },
      { hostname: 'mahadhan.co.in' },
      { hostname: 'instamart-media-assets.swiggy.com' },
      { hostname: 'dukaan.b-cdn.net' },
      { hostname: 'rukminim2.flixcart.com' },
      { hostname: 'd91ztqmtx7u1k.cloudfront.net' },
      { hostname: 'agribegri.com' },
      { hostname: 'trivandrumnursery.com' },
      { hostname: 'kisanjeevan.com' },
      { hostname: 'cdn.moglix.com' },
      { hostname: 'dujjhct8zer0r.cloudfront.net' },
      { hostname: 'static.agrostar.in' },
      { hostname: 'kisansewakendra.in' },
      { hostname: 'www.deere.co.in' },
      { hostname: 'www.mahindratractor.com' },
      { hostname: 'www.fieldking.com' },
      { hostname: 'www.kisanestore.com' },
      { hostname: 'nurserylive.com' },
      { hostname: 'www.machinerydukaan.com' },
      { hostname: 'www.alkarty.com' },
      { hostname: 'media.istockphoto.com' },
      { hostname: 'www.toolsaggarwalsteels.com' },
      { hostname: 'www.faithfulltools.com' },
      { hostname: 'yantratools.com' },
      { hostname: 'pre-live-admin.balwaan.com' },
      { hostname: 'static1.industrybuying.com' },
      { hostname: 'gardenerspath.com' },
      { hostname: 'cdn.britannica.com' },
      { hostname: 'nucons.in' },
      { hostname: 'www.trustbasket.com' },
      { hostname: 'www.sveagritech.com' },
      { hostname: 'images-cdn.ubuy.co.in' },
      { hostname: 'www.icl-group.com' },
      { hostname: 'www.krishitek.com' },
      { hostname: 'hobitech.in' },
      { hostname: '*.media-amazon.com' },
      { hostname: '*.gstatic.com' },
      { hostname: 'encrypted-tbn0.gstatic.com' },
      { hostname: 'encrypted-tbn1.gstatic.com' },
      { hostname: 'www.shutterstock.com' },
    ],
  },
  // Allow forwarded Server Actions/dev origins (useful when using dev tunnels)
  experimental: {
    allowedDevOrigins: ['localhost:9002', '127.0.0.1:9002', '.devtunnels.ms'],
  },
};

export default nextConfig;
