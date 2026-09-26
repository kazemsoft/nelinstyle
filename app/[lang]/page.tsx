import {notFound} from 'next/navigation';
import Store from '../store';
export function generateStaticParams(){return ['fa','en','ar'].map(lang=>({lang}));}
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){const {lang}=await params;return {metadataBase:new URL('https://nelinstyle.com'),title:lang==='fa'?'Nelin | روایت تو، در نقش و رنگ':lang==='ar'?'Nelin | حكايتك بالألوان':'Nelin | Wear your own story',description:'Discover the Nelin scarf collection. کشف مجموعه روسری‌های نلین. اكتشفي مجموعة أوشحة نيلين.',alternates:{canonical:`/${lang}`,languages:{fa:'/fa',en:'/en',ar:'/ar'}},icons:{icon:'/icon.svg'}};}
export default async function Page({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!['fa','en','ar'].includes(lang))notFound();return <Store lang={lang as 'fa'|'en'|'ar'}/>;}
