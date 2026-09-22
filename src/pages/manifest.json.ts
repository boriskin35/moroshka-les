import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import icon192 from '@images/icon-192.png';
import maskableIcon from '@images/icon-maskable.png';

export const GET: APIRoute = async () => {
  const icon192Img = await getImage({
    src: icon192,
    width: 192,
    height: 192,
    format: 'png',
  });
  const maskable512Img = await getImage({
    src: maskableIcon,
    width: 512,
    height: 512,
    format: 'png',
  });

  const manifest = {
    short_name: 'МорошкаЛес',
    name: 'МорошкаЛес — заводские дома из кедра',
    icons: [
      {
        src: icon192Img.src,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: maskable512Img.src,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    display: 'minimal-ui',
    id: '/',
    start_url: '/',
    theme_color: '#133E22',
    background_color: '#262626',
  };

  return new Response(JSON.stringify(manifest), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  });
};
