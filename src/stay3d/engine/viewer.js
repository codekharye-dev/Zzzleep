import * as THREE from './vendor/three.module.js';
import { OrbitControls } from './vendor/OrbitControls.js';

const mats=new Map();
function mat(color,opts={}){const key=color+JSON.stringify(opts);if(!mats.has(key))mats.set(key,new THREE.MeshStandardMaterial({color,roughness:.82,...opts}));return mats.get(key);}
function box(g,w,h,d,x,y,z,color,opts={}){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color,opts));m.position.set(x,y+h/2,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function cylinder(g,r,h,x,y,z,color,r2=r,opts={}){const m=new THREE.Mesh(new THREE.CylinderGeometry(r2,r,h,20),mat(color,opts));m.position.set(x,y+h/2,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function sphere(g,x,y,z,sx,sy,sz,color){const m=new THREE.Mesh(new THREE.SphereGeometry(1,12,10),mat(color));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;g.add(m);return m;}
function legs(g,x,z,w,d,h,color='#635143'){for(const a of[-1,1])for(const b of[-1,1])box(g,.045,h,.045,x+a*(w/2-.06),0,z+b*(d/2-.06),color);}
function furniture(g,f){
  const {kind:k,x,z,width:w,depth:d,height:h,color:c}=f,y=f.y||0;
  if(['rug','runner','bathmat'].includes(k)){box(g,w,.016,d,x,.016,z,c);return;}
  if(k==='sofa'||k==='armchair'){
    legs(g,x,z,w,d,.16);box(g,w,.2,d,x,.13,z,c);
    box(g,w,h-.28,.16,x,.28,z+d/2-.08,c);
    for(const a of[-1,1])box(g,.14,h-.26,d,x+a*(w/2-.07),.26,z,c);
    const n=k==='sofa'?3:1;for(let i=0;i<n;i++){const px=x-w/2+.19+(i+.5)*(w-.38)/n;box(g,(w-.40)/n,.14,d-.22,px,.34,z-.04,c);box(g,(w-.42)/n,.32,.13,px,.48,z+d/2-.23,c);}
    return;
  }
  if(k==='bed'){
    legs(g,x,z,w,d,.18);box(g,w,.20,d,x,.13,z,'#b2987e');box(g,w-.04,.23,d-.05,x,.33,z,'#f5f0e6');
    box(g,w-.06,.035,d*.62,x,.57,z-d*.13,'#e3d8c4');
    for(const a of[-1,1])box(g,w*.41,.12,.43,x+a*w*.25,.58,z+d*.31,'#fffdf8');
    box(g,w+.05,.035,.46,x,.61,z-d*.31,'#a2b1a0');return;
  }
  if(['coffee','dining','bistro','desk'].includes(k)){
    legs(g,x,z,w,d,h-.08);box(g,w,.075,d,x,h-.075,z,c);return;
  }
  if(k==='chair'){
    legs(g,x,z,w,d,.43);box(g,w,.06,d,x,.43,z,c);box(g,w,h-.46,.055,x,.46,z+d/2-.03,c);return;
  }
  if(['wardrobe','sideboard','counter','upper','nightstand','vanity','shelf','console'].includes(k)){
    box(g,w,h,d,x,y,z,c);const n=Math.max(1,Math.round(w/.5));
    if(k==='shelf'){
      for(let i=1;i<5;i++){box(g,w+.01,.035,d+.01,x,y+h*i/5,z,'#c4af90');for(let j=0;j<4;j++)box(g,.07,.18+j*.035,d*.4,x-w*.30+j*.14,y+h*(i-1)/5+.035,z-d*.32,['#6d7b70','#c2a98c','#c8c5b8','#8b6659'][j]);}
    }else for(let i=0;i<n;i++){const px=x-w/2+(i+.5)*w/n;box(g,w/n-.025,h-.045,.02,px,y+.023,z-d/2-.012,c);box(g,.11,.018,.035,px,y+h*.62,z-d/2-.035,'#77736a',{metalness:.55});}
    if(['counter','vanity'].includes(k))box(g,w+.025,.045,d+.03,x,y+h,z,'#e2ddd3');return;
  }
  if(k==='sink'){
    box(g,w,h,d,x,y,z,c,{metalness:.45});box(g,w*.74,.012,d*.66,x,y+h,z,'#a4adae');
    cylinder(g,.018,.20,x,y+h,z+d*.38,'#8b9698',.018,{metalness:.9});box(g,.02,.025,.16,x,y+h+.18,z+d*.25,'#8b9698');return;
  }
  if(k==='hob'){
    box(g,w,h,d,x,y,z,c);for(const a of[-1,1])for(const b of[-1,1])cylinder(g,.078,.008,x+a*w*.25,y+h,z+b*d*.25,'#747773');return;
  }
  if(k==='fridge'){
    box(g,w,h,d,x,y,z,c,{metalness:.35});box(g,w-.03,.016,.012,x,h*.66,z-d/2-.01,'#777b79');box(g,.025,.37,.025,x+w*.34,h*.3,z-d/2-.03,'#686e6b');return;
  }
  if(k==='tv'){
    box(g,w,.35,d,x,0,z,'#957c61');box(g,w*.85,.75,.065,x,.49,z,'#262c2d');box(g,w*.82,.70,.008,x,.515,z-.04,'#344347',{roughness:.3});return;
  }
  if(k==='plant'||k==='planter'){
    const potH=h*.35; if(k==='planter')box(g,w,potH,d,x,0,z,'#c5b39b');else cylinder(g,w*.38,potH,x,0,z,'#c5b39b',w*.48);
    cylinder(g,.025,h*.5,x,potH,z,'#5b5940');for(let i=0;i<7;i++){const a=i*2.4; sphere(g,x+Math.sin(a)*w*.38,potH+(h-potH)*(.45+i*.065),z+Math.cos(a)*d*.38,w*.31,h*.14,d*.22,i%2?'#6f8a60':c);}return;
  }
  if(k==='shower'){
    box(g,w,.07,d,x,0,z,'#e5e4df');box(g,.025,h,d,x+w/2,.07,z,'#bad0d3',{transparent:true,opacity:.20,depthWrite:false});box(g,w,h,.025,x,.07,z-d/2,'#bad0d3',{transparent:true,opacity:.20,depthWrite:false});
    cylinder(g,.018,1.8,x-w*.35,.1,z+d*.46,'#8f9c9d');box(g,.02,.03,.35,x-w*.35,1.85,z+d*.3,'#8f9c9d');box(g,.20,.025,.22,x-w*.35,1.85,z+d*.12,'#8f9c9d');return;
  }
  if(k==='toilet'){
    cylinder(g,w*.31,.30,x,0,z,'#f5f6f2');sphere(g,x,.38,z,w*.50,.18,d*.46,'#f5f6f2');box(g,w*.85,.47,.18,x,.22,z+d*.37,'#f5f6f2');return;
  }
  box(g,w,h,d,x,y,z,c);
}
function makeTexture(palette,tile=false){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;const c=canvas.getContext('2d');c.fillStyle=tile?'#d7d4cb':palette[2];c.fillRect(0,0,512,512);
  if(tile){c.strokeStyle='#bdb9b0';c.lineWidth=3;for(let i=0;i<=512;i+=128){c.beginPath();c.moveTo(i,0);c.lineTo(i,512);c.moveTo(0,i);c.lineTo(512,i);c.stroke();}}
  else{for(let i=0;i<8;i++){c.strokeStyle='rgba(71,50,31,.19)';c.lineWidth=2;c.strokeRect(i*64,0,64,512);for(let j=0;j<12;j++){const seed=(i*23+j*17)%41;c.strokeStyle=`rgba(80,50,24,${.03+(j%3)*.015})`;c.beginPath();c.moveTo(i*64+seed+5,0);c.bezierCurveTo(i*64+seed-4,160,i*64+seed+10,340,i*64+seed+5,512);c.stroke();}c.strokeStyle='rgba(71,50,31,.15)';c.beginPath();c.moveTo(i*64,(i%3)*160);c.lineTo((i+1)*64,(i%3)*160);c.stroke();}}
  const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;
}
function wall(g,len,h,x,z,axis,color,opening){
  const thick=.10;
  const part=(start,l,bottom,height)=>{if(l<=0||height<=0)return;box(g,axis==='x'?l:thick,height,axis==='x'?thick:l,axis==='x'?x+start+l/2:x,bottom,axis==='x'?z:z+start+l/2,color);};
  if(!opening){part(0,len,0,h);return;}
  const start=Math.max(.12,(len-opening.width)/2),end=Math.min(len-.12,start+opening.width);
  part(0,start,0,h);part(end,len-end,0,h);if(opening.kind==='window'){
    part(start,end-start,0,Math.min(.88,h));if(h>2.15)part(start,end-start,2.15,h-2.15);
    if(h>1){const wh=Math.min(h-.88,1.27);box(g,axis==='x'?end-start:.035,wh,axis==='x'?.035:end-start,axis==='x'?x+(start+end)/2:x,.88,axis==='x'?z:z+(start+end)/2,'#c0dfe2',{transparent:true,opacity:.26,depthWrite:false});}
  } else if(h>2.15)part(start,end-start,2.15,h-2.15);
}
function roomGroup(room,palette,full=false){
  const g=new THREE.Group();g.userData.roomId=room.id;const{width:w,depth:d,type}=room,h=full?room.height:.68;
  const texture=makeTexture(palette,['bathroom','balcony','kitchen'].includes(type));texture.repeat.set(w/3,d/3);
  const fm=new THREE.MeshStandardMaterial({map:texture,roughness:.86});const floor=new THREE.Mesh(new THREE.BoxGeometry(w,.12,d),fm);floor.position.set(w/2,-.06,d/2);floor.receiveShadow=true;floor.userData.roomId=room.id;g.add(floor);
  if(type==='balcony'){
    for(const x of[0,w])box(g,.055,1.0,d,x,0,d/2,'#66786f');box(g,w,.05,.05,w/2,1.0,d,'#66786f');
    for(let x=.15;x<w;x+=.32)box(g,.025,.98,.025,x,0,d,'#66786f');
    // Back wall is the shared facade; a central opening connects the corridor.
    wall(g,w,h,0,0,'x',palette[0],{kind:'door',width:1.4});
  }else if(type==='corridor'){
    // Side walls and doors are supplied by the adjacent rooms.
    wall(g,w,h,0,0,'x',palette[0],{kind:'door',width:1});
    wall(g,w,h,0,d,'x',palette[0],{kind:'door',width:1.2});
  }else{
    wall(g,w,h,0,0,'x',palette[0]);wall(g,w,h,0,d,'x',palette[0]);
    wall(g,d,h,0,0,'z',palette[0],room.doorSide==='west'?{kind:'door',width:.95}:{kind:'window',width:Math.min(1.8,d*.5)});
    wall(g,d,h,w,0,'z',palette[0],room.doorSide==='east'?{kind:'door',width:.95}:{kind:'window',width:Math.min(1.8,d*.5)});
    if(full){
      const art=new THREE.Group();box(art,.75,.65,.035,w*.35,1.3,d-.055,'#8b745b');box(art,.64,.54,.04,w*.35,1.35,d-.08,palette[3]);g.add(art);
      // Baseboards remain attached to the metric wall outlines.
      box(g,w,.065,.025,w/2,0,.065,'#f6f0e8');box(g,w,.065,.025,w/2,0,d-.065,'#f6f0e8');
    }
  }
  const ordered=[...room.furniture].sort((a,b)=>(['rug','runner','bathmat'].includes(a.kind)?-1:0)-(['rug','runner','bathmat'].includes(b.kind)?-1:0));
  for(const f of ordered)furniture(g,f);
  if(full&&type!=='balcony'){
    const light=new THREE.PointLight('#fff3df',12,9,2);light.position.set(w*.50,2.4,d*.50);g.add(light);
  }
  return g;
}
function disposeGroup(group){group.traverse(o=>{if(o.isMesh){o.geometry?.dispose();const ms=Array.isArray(o.material)?o.material:[o.material];for(const m of ms)if(m?.map){m.map.dispose();m.dispose();}}});}
export class HomeViewer{
  constructor(container,{onRoomSelect}={}){
    this.container=container;this.onRoomSelect=onRoomSelect;this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#edece6');
    this.camera=new THREE.PerspectiveCamera(42,1,.03,250);
    this.renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=.95;
    container.replaceChildren(this.renderer.domElement);this.renderer.domElement.setAttribute('aria-label','Evin interaktiv 3D planı. Siçanla fırladın və təkərlə yaxınlaşın.');
    this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.enableDamping=true;this.controls.dampingFactor=.09;this.controls.maxPolarAngle=Math.PI*.49;this.controls.minDistance=.6;this.controls.maxDistance=70;
    this.scene.add(new THREE.HemisphereLight('#fff7e9','#929888',2.2));const sun=new THREE.DirectionalLight('#fff3df',2.6);sun.position.set(-8,18,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-30;sun.shadow.camera.right=30;sun.shadow.camera.top=30;sun.shadow.camera.bottom=-30;sun.shadow.bias=-.0005;sun.shadow.normalBias=.03;this.scene.add(sun);
    this.group=new THREE.Group();this.scene.add(this.group);this.pointer=new THREE.Vector2();this.ray=new THREE.Raycaster();
    this.pointerDown=e=>{this.down={x:e.clientX,y:e.clientY};};this.pointerUp=e=>{if(!this.down||Math.hypot(this.down.x-e.clientX,this.down.y-e.clientY)>5||this.mode!=='home')return;const rect=this.renderer.domElement.getBoundingClientRect();this.pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);this.ray.setFromCamera(this.pointer,this.camera);for(const hit of this.ray.intersectObjects(this.group.children,true)){let obj=hit.object;while(obj&&!obj.userData.roomId)obj=obj.parent;if(obj?.userData.roomId){this.onRoomSelect?.(obj.userData.roomId);break;}}};
    this.renderer.domElement.addEventListener('pointerdown',this.pointerDown);this.renderer.domElement.addEventListener('pointerup',this.pointerUp);
    this.resize=new ResizeObserver(()=>{const w=container.clientWidth,h=container.clientHeight;if(w&&h){this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h);}});this.resize.observe(container);
    this.renderer.setAnimationLoop(()=>{this.controls.update();this.renderer.render(this.scene,this.camera);});
  }
  clear(){disposeGroup(this.group);this.group.clear();}
  home(listing,floor=0){
    this.listing=listing;this.floor=floor;this.mode='home';this.camera.fov=42;this.camera.updateProjectionMatrix();this.controls.maxPolarAngle=Math.PI*.49;this.controls.minDistance=2;this.clear();
    const rooms=listing.rooms.filter(r=>r.floor===floor);let maxX=0,maxZ=0;
    for(const r of rooms){const g=roomGroup(r,listing.palette);g.position.set(r.x,0,r.z);this.group.add(g);maxX=Math.max(maxX,r.x+r.width);maxZ=Math.max(maxZ,r.z+r.depth);}
    box(this.group,maxX+.3,.16,maxZ+.3,maxX/2,-.28,maxZ/2,'#d0ccc0');
    const c=new THREE.Vector3(maxX/2,0,maxZ/2),size=Math.max(maxX,maxZ);this.controls.target.copy(c);this.camera.position.set(c.x-size*.9,size*1.05,c.z+size*1.1);this.controls.update();this.renderer.render(this.scene,this.camera);
  }
  room(listing,roomId,view=0){
    const r=listing.rooms.find(r=>r.id===roomId);if(!r)return;
    this.listing=listing;this.floor=r.floor;this.mode='room';this.controls.maxPolarAngle=Math.PI*.92;this.controls.minDistance=.25;this.clear();this.group.add(roomGroup(r,listing.palette,true));
    const w=r.width,d=r.depth;this.camera.fov=r.type==='corridor'?78:68;this.camera.updateProjectionMatrix();
    if(view===0)this.camera.position.set(.22,1.65,.22);else this.camera.position.set(w-.22,1.65,d-.22);
    this.controls.target.set(w*.50,1.05,d*.53);this.controls.update();this.renderer.render(this.scene,this.camera);
  }
  top(){if(this.mode!=='home')return;const t=this.controls.target;this.camera.position.set(t.x+.01,25,t.z+.01);this.controls.update();}
  rotate(value){this.controls.autoRotate=value;}
  capture(){this.renderer.render(this.scene,this.camera);return this.renderer.domElement.toDataURL('image/jpeg',.88);}
  dispose(){this.renderer.setAnimationLoop(null);this.resize.disconnect();this.controls.dispose();this.renderer.domElement.removeEventListener('pointerdown',this.pointerDown);this.renderer.domElement.removeEventListener('pointerup',this.pointerUp);this.clear();this.renderer.dispose();this.container.replaceChildren();}
}

// One shared off-screen renderer creates exact model views, avoiding dozens of WebGL contexts.
let photoViewer;
export function renderRoomPhoto(listing,roomId,view=0){
  if(!photoViewer){const el=document.createElement('div');el.style.cssText='position:fixed;left:-5000px;top:0;width:900px;height:600px;pointer-events:none';document.body.append(el);photoViewer=new HomeViewer(el);photoViewer.renderer.setAnimationLoop(null);photoViewer.renderer.setSize(900,600);photoViewer.camera.aspect=1.5;photoViewer.camera.updateProjectionMatrix();}
  photoViewer.room(listing,roomId,view);return photoViewer.capture();
}
