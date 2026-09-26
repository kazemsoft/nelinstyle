'use client';
import {useEffect,useRef,useState} from 'react';
import {RotateCcw,MoveHorizontal,ZoomIn} from 'lucide-react';

export default function ScarfScene({lang,products,onSelect}:{lang:'fa'|'en'|'ar';products:{id:number;image:string;name:string}[];onSelect:(id:number)=>void}){
 const selection=useRef(onSelect);selection.current=onSelect;const [hovered,setHovered]=useState<number|null>(null);
 const [zoom,setZoom]=useState(1),[zoomOpen,setZoomOpen]=useState(false);const changeZoom=useRef((value:number)=>{});
 const zoomText={fa:"بزرگ‌نمایی",en:"Zoom",ar:"التكبير"}[lang];
 const host=useRef<HTMLDivElement>(null),reset=useRef(()=>{});const [ready,setReady]=useState(false);
 const text={fa:{hint:'اسکرول: تغییر زاویه · لمس روسری: جزئیات',reset:'بازنشانی زاویه',label:'نمای سه‌بعدی روسری نلین در جعبه؛ برای تغییر زاویه بکشید یا از کلیدهای جهت استفاده کنید.'},en:{hint:'Scroll to explore · Tap a scarf',reset:'Reset view',label:'Nelin scarf in a three-dimensional box. Drag or use arrow keys to adjust the view.'},ar:{hint:'مرّر لتغيير الزاوية · اضغط على الوشاح',reset:'إعادة ضبط العرض',label:'وشاح نيلين في صندوق ثلاثي الأبعاد. اسحب أو استخدم مفاتيح الأسهم لتغيير الزاوية.'}}[lang];
 useEffect(()=>{
  const element=host.current;if(!element)return;let disposed=false,cleanup=()=>{};
  const start=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){start.disconnect();void initialize()}},{rootMargin:'250px'});start.observe(element);
  async function initialize(){
   const T=await import('three');if(disposed)return;
   let renderer:import('three').WebGLRenderer;
   try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'})}catch{return}
   renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;
   element.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
   const scene=new T.Scene(),camera=new T.PerspectiveCamera(35,1,.1,60),group=new T.Group();scene.add(group);group.rotation.y=-.16;
   scene.add(new T.HemisphereLight(0xfff2e5,0x54404a,2.15));
   const key=new T.DirectionalLight(0xfff1e2,2.2);key.position.set(-3,7,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-6;key.shadow.camera.right=6;key.shadow.camera.top=6;key.shadow.camera.bottom=-6;key.shadow.normalBias=.018;scene.add(key);
   const fill=new T.DirectionalLight(0xffeee7,.65);fill.position.set(4,4,2);scene.add(fill);
   const boxMaterial=new T.MeshStandardMaterial({color:0x36151f,roughness:.94,metalness:0}),gold=new T.MeshStandardMaterial({color:0xb99557,roughness:.52,metalness:.62}),lining=new T.MeshStandardMaterial({color:0x683748,roughness:1});
   function block(w:number,h:number,d:number,x:number,y:number,z:number,material:import('three').Material,parent:import('three').Group=group){const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh}
   // A shallow presentation case, with a real upright hinged lid behind the fabric.
   block(4.2,.16,3.5,0,-.15,0,boxMaterial);block(3.9,.06,3.2,0,-.04,0,lining);
   for(const sign of [-1,1]){
    block(4.2,.43,.13,0,.135,sign*1.685,boxMaterial);
    block(.13,.43,3.24,sign*2.035,.135,0,boxMaterial);
    block(3.94,.018,.025,0,.356,sign*1.68,gold);
    block(.025,.018,3.35,sign*2.03,.356,0,gold);
   }
   const lid=new T.Group();lid.position.set(0,.35,-1.69);lid.rotation.x=-.16;group.add(lid);
   block(4.2,3.45,.12,0,1.725,-.07,boxMaterial,lid);
   // Fine irregular pile and a diffuse finish keep the lid velvet dark at every angle.
   const velvetSize=256,velvetData=new Uint8Array(velvetSize*velvetSize*4);
   let seed=19;
   for(let i=0;i<velvetSize*velvetSize;i++){seed=(seed*1664525+1013904223)>>>0;const shade=85+(seed>>>24)%95;velvetData[i*4]=velvetData[i*4+1]=velvetData[i*4+2]=shade;velvetData[i*4+3]=255}
   const velvetTexture=new T.DataTexture(velvetData,velvetSize,velvetSize);velvetTexture.wrapS=velvetTexture.wrapT=T.RepeatWrapping;velvetTexture.repeat.set(5,5);velvetTexture.needsUpdate=true;
   const velvet=new T.MeshStandardMaterial({color:0x080809,roughness:1,metalness:0,bumpMap:velvetTexture,bumpScale:.012});
   block(3.9,3.15,.035,0,1.725,.005,velvet,lid);
   const logoMaterial=new T.MeshBasicMaterial({transparent:true,depthWrite:false,toneMapped:false,blending:T.AdditiveBlending});
   const logo=new T.Mesh(new T.PlaneGeometry(1.55,1.55),logoMaterial);logo.position.set(0,1.725,.026);lid.add(logo);
   let logoTexture:import('three').Texture|undefined;
   new T.TextureLoader().load('/images/79.png',texture=>{if(disposed){texture.dispose();return}logoTexture=texture;texture.colorSpace=T.SRGBColorSpace;logoMaterial.map=texture;logoMaterial.needsUpdate=true;schedule()});
   for(const sign of [-1,1])block(.14,3.45,.14,sign*2.03,1.725,.03,boxMaterial,lid);
   block(4.2,.14,.14,0,3.38,.03,boxMaterial,lid);block(4.2,.14,.14,0,.07,.03,boxMaterial,lid);
   // Small hardware accents, rather than a metallic picture-frame surround.
   for(const x of [-1.3,1.3])block(.38,.085,.14,x,.35,-1.68,gold);
   block(.44,.16,.055,0,.14,1.775,gold);block(.14,.23,.075,0,.12,1.81,gold);
   block(.055,.045,.01,0,.13,1.853,boxMaterial);block(.3,.095,.1,0,3.49,.04,gold,lid);
   // Low-contrast woven relief, with matte cotton/silk finish and no synthetic sheen.
   const weaveSize=128,weaveData=new Uint8Array(weaveSize*weaveSize*4);
   for(let y=0;y<weaveSize;y++)for(let x=0;x<weaveSize;x++){const i=(y*weaveSize+x)*4;const over=((x>>2)+(y>>2))%2;const v=128+Math.round(22*Math.sin((over?x:y)*Math.PI/2)+9*Math.sin((over?y:x)*Math.PI/2));weaveData[i]=weaveData[i+1]=weaveData[i+2]=v;weaveData[i+3]=255}
   const weave=new T.DataTexture(weaveData,weaveSize,weaveSize);weave.wrapS=weave.wrapT=T.RepeatWrapping;weave.repeat.set(9,14);weave.needsUpdate=true;
   const clothMaterials=products.map(()=>new T.MeshStandardMaterial({color:0xffffff,roughness:1,metalness:0,bumpMap:weave,bumpScale:.003,side:T.DoubleSide}));
   const hemMaterial=new T.MeshStandardMaterial({color:0x5a2733,roughness:1});
   // Each folded sheet travels over its top, curls around the front and returns
   // underneath. The open side edges and three nested folds give actual thickness.
   function foldedPoint(u:number,t:number,layer:number,bundle:number){
    const length=2.75-layer*.06,radius=.065,straight=length-2*radius;
    const perimeter=2*straight+2*Math.PI*radius,d=t*perimeter;
    let y:number,z:number;
    if(d<straight){z=-straight/2+d;y=radius}
    else if(d<straight+Math.PI*radius){const angle=(d-straight)/radius;z=straight/2+Math.sin(angle)*radius;y=Math.cos(angle)*radius}
    else if(d<2*straight+Math.PI*radius){z=straight/2-(d-straight-Math.PI*radius);y=-radius}
    else{const angle=(d-2*straight-Math.PI*radius)/radius;z=-straight/2-Math.sin(angle)*radius;y=-Math.cos(angle)*radius}
    const x=(u-.5)*(1.77-layer*.045);
    const crown=.085*Math.sin(Math.PI*u)+.018*Math.sin(z*3.2+u*5+bundle);
    const crease=.024*Math.sin(u*18+z*1.2)*Math.pow(Math.sin(Math.PI*u),2);
    return new T.Vector3(x+.015*Math.sin(z*2.1+layer),y+.12+layer*.135+crown+crease,z+.025*Math.sin(u*5+bundle));
   }
      for(let bundle=0;bundle<6;bundle++){
    const folded=new T.Group();folded.position.set(bundle%2===0?-.965:.965,.035,Math.floor(bundle/2)*1.02-1.02);folded.scale.z=.32;folded.rotation.y=bundle%2===0?-.018:.022;folded.userData.productIndex=bundle;group.add(folded);
    for(let layer=0;layer<1;layer++){
     const widthSegments=40,foldSegments=144,vertices:number[]=[],uvs:number[]=[],indices:number[]=[];
     for(let j=0;j<=foldSegments;j++)for(let i=0;i<=widthSegments;i++){
      const u=i/widthSegments,t=j/foldSegments,p=foldedPoint(u,t,layer,bundle);vertices.push(p.x,p.y,p.z);
      // Adjacent portions of the same print, not a framed full artwork per panel.
      uvs.push(.04+u*.92,.04+((p.z+1.4)/2.8)*.92);
     }
     for(let j=0;j<foldSegments;j++)for(let i=0;i<widthSegments;i++){const a=j*(widthSegments+1)+i,b=a+widthSegments+1;indices.push(a,b,a+1,b,b+1,a+1)}
     const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);geometry.computeVertexNormals();
     const cloth=new T.Mesh(geometry,clothMaterials[bundle]);cloth.castShadow=true;cloth.receiveShadow=true;folded.add(cloth);
     for(const u of [0,1]){const points=[];for(let j=0;j<=foldSegments;j++)points.push(foldedPoint(u,j/foldSegments,layer,bundle));const hem=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),144,.006,4,false),hemMaterial);hem.castShadow=true;folded.add(hem)}
    }
   }
   const ground=new T.Mesh(new T.PlaneGeometry(200,200),new T.ShadowMaterial({opacity:.3}));ground.rotation.x=-Math.PI/2;ground.position.y=-.28;ground.receiveShadow=true;scene.add(ground);
   const textures:import('three').Texture[]=[];let settledCount=0;const settle=()=>{settledCount++;if(settledCount===products.length)setReady(true);schedule()};
   products.forEach((product,index)=>new T.TextureLoader().load(product.image,texture=>{if(disposed){texture.dispose();return}textures.push(texture);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());clothMaterials[index].map=texture;clothMaterials[index].needsUpdate=true;settle()},undefined,()=>{if(disposed)return;clothMaterials[index].color.setHex(0x5a2733);settle()}));
   const raycaster=new T.Raycaster(),pointer=new T.Vector2();
   function hit(e:PointerEvent){const r=element!.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);let object:import('three').Object3D|null|undefined=raycaster.intersectObject(group,true)[0]?.object;while(object&&object.userData.productIndex===undefined)object=object.parent;return object?.userData.productIndex as number|undefined}
   let hoveredIndex:number|undefined;
   function hover(index:number|undefined){if(index===hoveredIndex)return;hoveredIndex=index;setHovered(index??null);element!.style.cursor=index===undefined?'grab':'pointer';clothMaterials.forEach((m,i)=>{m.emissive.setHex(i===index?0x33200d:0);m.emissiveIntensity=.3});schedule()}
   let targetZoom=1,currentZoom=1,pinchDistance=0,pinchZoom=1,pinching=false,suppressTap=false;
   function updateZoom(value:number){targetZoom=T.MathUtils.clamp(value,.75,2);setZoom(targetZoom);schedule()}
   changeZoom.current=updateZoom;
   const span=(touches:TouchList)=>Math.hypot(touches[0].clientX-touches[1].clientX,touches[0].clientY-touches[1].clientY);
   function touchStart(e:TouchEvent){if(e.targetTouches.length>=2){e.preventDefault();pinching=true;suppressTap=true;down=false;moved=true;pinchDistance=span(e.targetTouches);pinchZoom=targetZoom;hover(undefined)}}
   function touchMove(e:TouchEvent){if(e.targetTouches.length>=2&&pinching){e.preventDefault();if(pinchDistance>0)updateZoom(pinchZoom*span(e.targetTouches)/pinchDistance)}}
   function touchEnd(e:TouchEvent){if(e.targetTouches.length<2)pinching=false;if(e.targetTouches.length===0){down=false;element!.classList.remove("dragging")}}
   let scroll=0,dragX=0,dragY=0,yaw=.15,pitch=.91,frame=0,visible=true,down=false,lastX=0,lastY=0,startX=0,startY=0,moved=false;const reduce=matchMedia('(prefers-reduced-motion: reduce)');
   function draw(){if(disposed||!visible||document.hidden)return;const ty=(reduce.matches?.15:-.18+scroll*.5)+dragX,tp=(reduce.matches?.94:.48+scroll*.72)+dragY;yaw+=(ty-yaw)*.09;pitch+=(tp-pitch)*.09;currentZoom+=(targetZoom-currentZoom)*(reduce.matches?1:.16);const radius=12/Math.min(camera.aspect,1)/currentZoom;camera.position.set(radius*Math.sin(pitch)*Math.sin(yaw),1.25+radius*Math.cos(pitch),-.15+radius*Math.sin(pitch)*Math.cos(yaw));camera.lookAt(0,1.25,-.15);renderer.render(scene,camera);element!.dataset.zoom=currentZoom.toFixed(3);element!.dataset.view=`${yaw.toFixed(3)},${pitch.toFixed(3)}`;if(Math.abs(ty-yaw)+Math.abs(tp-pitch)+Math.abs(targetZoom-currentZoom)>.0008)schedule()}
   function schedule(){if(!frame&&!disposed)frame=requestAnimationFrame(()=>{frame=0;draw()})}
   function onScroll(){const rect=element!.getBoundingClientRect();scroll=T.MathUtils.clamp((innerHeight*.85-rect.top)/(innerHeight*.7),0,1);schedule()}
   function resize(){const {width,height}=element!.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();onScroll()}
   const ro=new ResizeObserver(resize);ro.observe(element);const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){onScroll();schedule()}});io.observe(element);
   function pointerDown(e:PointerEvent){if(e.button!==0||!e.isPrimary||pinching)return;suppressTap=false;down=true;moved=false;startX=lastX=e.clientX;startY=lastY=e.clientY;element!.setPointerCapture(e.pointerId);element!.classList.add('dragging')}
   function pointerMove(e:PointerEvent){if(pinching||suppressTap)return;if(!down){if(e.pointerType==='mouse')hover(hit(e));return}if(Math.hypot(e.clientX-startX,e.clientY-startY)>7)moved=true;dragX=T.MathUtils.clamp(dragX-(e.clientX-lastX)*.002,-.26,.26);if(e.pointerType!=='touch')dragY=T.MathUtils.clamp(dragY+(e.clientY-lastY)*.0015,-.13,.13);lastX=e.clientX;lastY=e.clientY;schedule()}
   function pointerUp(e:PointerEvent){const activate=down&&!moved&&!suppressTap&&!pinching&&e.type==='pointerup';down=false;element!.classList.remove('dragging');if(activate){const index=hit(e);if(index!==undefined)selection.current(products[index].id)}}
   function pointerLeave(){if(!down)hover(undefined)}
   function keyboard(e:KeyboardEvent){if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();if(e.key==='Home'){dragX=dragY=0;updateZoom(1)}else{dragX=T.MathUtils.clamp(dragX+(e.key==='ArrowLeft'?-.06:e.key==='ArrowRight'?.06:0),-.26,.26);dragY=T.MathUtils.clamp(dragY+(e.key==='ArrowUp'?-.04:e.key==='ArrowDown'?.04:0),-.13,.13)}schedule()}
   reset.current=()=>{dragX=dragY=0;updateZoom(1);schedule()};const visibility=()=>{if(!document.hidden)schedule()};const contextLost=(e:Event)=>{e.preventDefault();setReady(false);visible=false};const contextRestored=()=>{visible=true;if(settledCount===products.length)setReady(true);schedule()};const gesture=(e:Event)=>e.preventDefault();
   element.addEventListener('touchstart',touchStart,{passive:false});element.addEventListener('touchmove',touchMove,{passive:false});element.addEventListener('touchend',touchEnd);element.addEventListener('touchcancel',touchEnd);
   element.addEventListener('pointerleave',pointerLeave);element.addEventListener('pointerdown',pointerDown);element.addEventListener('pointermove',pointerMove);element.addEventListener('pointerup',pointerUp);element.addEventListener('pointercancel',pointerUp);element.addEventListener('lostpointercapture',pointerUp);element.addEventListener('keydown',keyboard);renderer.domElement.addEventListener('webglcontextlost',contextLost);renderer.domElement.addEventListener('webglcontextrestored',contextRestored);element.addEventListener('gesturestart',gesture);window.addEventListener('scroll',onScroll,{passive:true});document.addEventListener('visibilitychange',visibility);reduce.addEventListener('change',onScroll);resize();
   cleanup=()=>{changeZoom.current=()=>{};element!.removeEventListener('touchstart',touchStart);element!.removeEventListener('touchmove',touchMove);element!.removeEventListener('touchend',touchEnd);element!.removeEventListener('touchcancel',touchEnd);cancelAnimationFrame(frame);ro.disconnect();io.disconnect();window.removeEventListener('scroll',onScroll);document.removeEventListener('visibilitychange',visibility);reduce.removeEventListener('change',onScroll);element!.removeEventListener('pointerleave',pointerLeave);element!.removeEventListener('pointerdown',pointerDown);element!.removeEventListener('pointermove',pointerMove);element!.removeEventListener('pointerup',pointerUp);element!.removeEventListener('pointercancel',pointerUp);element!.removeEventListener('lostpointercapture',pointerUp);element!.removeEventListener('keydown',keyboard);renderer.domElement.removeEventListener('webglcontextlost',contextLost);renderer.domElement.removeEventListener('webglcontextrestored',contextRestored);element!.removeEventListener('gesturestart',gesture);scene.traverse(object=>{if(object instanceof T.Mesh){object.geometry.dispose();const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach(m=>m.dispose())}});textures.forEach(t=>t.dispose());logoTexture?.dispose();velvetTexture.dispose();weave.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove()};
  }
  return()=>{disposed=true;start.disconnect();cleanup()};
 },[]);
 return <div className={`scarf-showcase ${ready?'scene-ready':''}`}><img className="scene-fallback" src="/images/4.png" alt="Nelin — Midnight Rose"/><div ref={host} className="scarf-canvas" tabIndex={0} role="group" aria-label={text.label}/>{ready&&<div className="scene-caption"><span><MoveHorizontal size={17}/>{text.hint}</span><div className="scene-controls"><div className="scene-zoom">{zoomOpen&&<div className="scene-zoom-panel"><output>{Math.round(zoom*100)}%</output><input aria-label={zoomText} type="range" min="0.75" max="2" step="0.01" value={zoom} onChange={e=>changeZoom.current(Number(e.target.value))}/></div>}<button onClick={()=>setZoomOpen(v=>!v)} aria-label={zoomText} aria-expanded={zoomOpen} title={zoomText}><ZoomIn size={17}/></button></div><button onClick={()=>reset.current()} aria-label={text.reset}><RotateCcw size={17}/></button></div></div>}{ready&&<div className="scene-products">{products.map((p,i)=><button key={p.id} className={hovered===i?'active':''} onClick={()=>onSelect(p.id)} aria-label={p.name} title={p.name}><img src={p.image} alt=""/></button>)}</div>}</div>;
}
