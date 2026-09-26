import '../globals.css';
import {notFound} from 'next/navigation';
export default async function Layout({children,params}:{children:React.ReactNode;params:Promise<{lang:string}>}){const {lang}=await params;if(!['fa','en','ar'].includes(lang))notFound();return <html lang={lang} dir={lang==='en'?'ltr':'rtl'}><body>{children}</body></html>;}
