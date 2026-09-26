'use client';
import {useEffect,useState} from 'react';
import Image from 'next/image';
import {ChevronLeft,ChevronRight,Pause,Play} from 'lucide-react';

export default function ProductGallery({lang,name,images}:{lang:'fa'|'en'|'ar';name:string;images:string[]}){
 const labels={fa:{gallery:'تصاویر محصول',views:['نمای کامل طرح','روی مدل و جزئیات'],pause:'توقف نمایش خودکار',play:'پخش خودکار تصاویر',previous:'تصویر قبلی',next:'تصویر بعدی'},en:{gallery:'Product gallery',views:['Full design','On model & details'],pause:'Pause slideshow',play:'Play slideshow',previous:'Previous image',next:'Next image'},ar:{gallery:'صور المنتج',views:['التصميم الكامل','على العارضة والتفاصيل'],pause:'إيقاف العرض التلقائي',play:'تشغيل العرض التلقائي',previous:'الصورة السابقة',next:'الصورة التالية'}}[lang];
 const [active,setActive]=useState(0),[playing,setPlaying]=useState(false),[hovered,setHovered]=useState(false),[hidden,setHidden]=useState(false);
 useEffect(()=>{const motion=matchMedia('(prefers-reduced-motion: reduce)');setPlaying(!motion.matches);const change=()=>setPlaying(!motion.matches);motion.addEventListener('change',change);const visibility=()=>setHidden(document.hidden);document.addEventListener('visibilitychange',visibility);return()=>{motion.removeEventListener('change',change);document.removeEventListener('visibilitychange',visibility)}},[]);
 useEffect(()=>{if(!playing||hovered||hidden)return;const timer=setInterval(()=>setActive(i=>(i+1)%images.length),4500);return()=>clearInterval(timer)},[playing,hovered,hidden,images.length]);
 const choose=(index:number)=>{setActive((index+images.length)%images.length);setPlaying(false)};
 return <section className="product-gallery" aria-label={`${labels.gallery}: ${name}`} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();choose(active+(e.key==='ArrowRight'?1:-1))}}}>
  <div className="gallery-stage">{images.map((src,index)=><Image key={src} className={`gallery-slide ${active===index?'is-active':''}`} src={src} alt={`${name} — ${labels.views[index]}`} aria-hidden={active!==index} width={1024} height={1024} sizes="(max-width:700px) 90vw, 480px" loading="eager"/>)}
   <div className="gallery-controls" dir="ltr"><button type="button" aria-label={labels.previous} onClick={()=>choose(active-1)}><ChevronLeft size={19}/></button><span>{(active+1).toLocaleString(lang)} / {images.length.toLocaleString(lang)}</span><button type="button" aria-label={labels.next} onClick={()=>choose(active+1)}><ChevronRight size={19}/></button><button type="button" aria-label={playing?labels.pause:labels.play} onClick={()=>setPlaying(p=>!p)}>{playing?<Pause size={17}/>:<Play size={17}/>}</button></div>
  </div>
  <div className="gallery-thumbnails">{images.map((src,index)=><button type="button" key={src} aria-label={labels.views[index]} aria-pressed={active===index} onClick={()=>choose(index)}><Image src={src} alt="" width={62} height={68} sizes="62px"/><span>{labels.views[index]}</span></button>)}</div>
 </section>;
}
