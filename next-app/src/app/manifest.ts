import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PerfumeDK Shop',
    short_name: 'PerfumeDK',
    description: `Discover the captivating world of Pèume, where every fragrance is crafted to embody the perfect blend of sophistication and allure. For the distinguished gentleman, our scents evoke timeless elegance, while for the graceful woman, they inspire a touch of luxurious charm. Immerse yourself in a symphony of aromas that redefine the art of perfumery, bringing out the true essence of your individuality. With Pèume, step into a realm of refined beauty and unforgettable impressions.`,
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}