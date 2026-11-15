import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// Edit these named settings first when adapting this room to your own world.
const ROOM = {width:16, depth:12, speed:3.4, characterHeight:1.85};
const $ = id => document.getElementById(id);
const state = {cloth:false,bear:false,thread:false,repair:false};
const scene = new THREE.Scene();
scene.background = new THREE.Color('#dce6d5');
scene.fog = new THREE.Fog('#dce6d5',85,150);
const camera = new THREE.PerspectiveCamera(38,innerWidth/innerHeight,.1,100);
const renderer = new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
$('world').appendChild(renderer.domElement);
const controls = new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.minDistance=9;controls.maxDistance=38;
controls.minPolarAngle=.25;controls.maxPolarAngle=Math.PI*.44;controls.enablePan=false;
function homeView(){controls.maxDistance=innerWidth<600?80:38;camera.position.set(18,18,23);controls.target.set(-.2,.3,0);if(innerWidth<600){camera.position.set(35,40,48);controls.target.set(0,0,0);}controls.update();}
homeView();
const hemi = new THREE.HemisphereLight('#fff5da','#8a9a79',2.3);scene.add(hemi);
const sun = new THREE.DirectionalLight('#fff1cf',3.2);sun.position.set(-3,13,8);sun.castShadow=true;
Object.assign(sun.shadow.camera,{left:-12,right:12,top:12,bottom:-12,near:.5,far:35});sun.shadow.mapSize.set(2048,2048);sun.shadow.normalBias=.03;scene.add(sun);
const fill=new THREE.DirectionalLight('#c8dcf7',.65);fill.position.set(6,5,-5);scene.add(fill);
const materials=new Map();
function mat(color,roughness=.9){const k=color+roughness;if(!materials.has(k))materials.set(k,new THREE.MeshStandardMaterial({color,roughness}));return materials.get(k);}
function addMesh(geo,color,x=0,y=0,z=0,parent=scene){const m=new THREE.Mesh(geo,typeof color==='string'?mat(color):color);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function box(w,h,d,color,x=0,y=0,z=0,parent=scene,r=.08){return addMesh(new RoundedBoxGeometry(w,h,d,2,Math.min(r,w/3,h/3,d/3)),color,x,y,z,parent);}
function ball(w,h,d,color,x=0,y=0,z=0,parent=scene){const o=addMesh(new THREE.SphereGeometry(1,20,14),color,x,y,z,parent);o.scale.set(w,h,d);return o;}
function cyl(r,h,color,x,y,z,parent=scene){return addMesh(new THREE.CylinderGeometry(r,r,h,32),color,x,y,z,parent);}
function line(points,color='#785940',width=1){const g=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));const l=new THREE.Line(g,new THREE.LineBasicMaterial({color,linewidth:width}));scene.add(l);return l;}
function label(text,x,y,z,color='#3a5642',size=1.7){const c=document.createElement('canvas');c.width=256;c.height=64;const q=c.getContext('2d');q.fillStyle='#fffdf0';q.beginPath();q.roundRect(2,2,252,60,22);q.fill();q.font=`600 ${text.length>7?26:34}px "Malgun Gothic",sans-serif`;q.textAlign='center';q.textBaseline='middle';q.fillStyle=color;q.fillText(text,128,33);const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map,depthTest:false,toneMapped:false,fog:false}));sprite.position.set(x,y,z);sprite.scale.set(size*1.2,size*1.2*64/256,1);sprite.renderOrder=20;scene.add(sprite);return sprite;}
// The room is a small wooden sewing box, built entirely from editable shapes.
box(16.4,.65,12.4,'#9b7957',0,-.39,0,scene,.2);
for(let i=0;i<12;i++)box(15.95,.12,.97,i%2?'#dac39b':'#e0cba8',0,-.03,-5.5+i,scene,.02);
box(16.25,3.7,.27,'#b6c7a3',0,1.75,-6.05);
box(.27,2.1,12.2,'#b6c7a3',-8,1,0);
box(16.3,.16,.4,'#f3dfb2',0,3.64,-6.05);
box(.4,.16,12.2,'#f3dfb2',-8,2.1,0);
for(let x=-7.5;x<8;x+=1.25)box(.045,2.9,.03,'#9eb58b',x,1.7,-5.88,scene,.01);
box(16,.22,.16,'#f1d8a6',0,.2,-5.85);
// A framed window and a small sign.
box(3.8,2.15,.12,'#f4edd8',4.7,2.15,-5.83);
box(3.45,1.8,.08,'#a5c9c5',4.7,2.15,-5.73);
box(.10,1.85,.1,'#f6e7c6',4.7,2.15,-5.64);box(3.45,.10,.1,'#f6e7c6',4.7,2.15,-5.64);
ball(.58,.58,.03,'#ecdfb2',5.5,2.55,-5.66);
label('손길이 모이는 곳',-.9,2.9,-5.75,'#365943',3.2);
// Woven circular rug.
const rug=cyl(3.35,.04,'#b2bd92',0,.05,1.3);rug.scale.z=.77;
for(let r=2.85;r<3.3;r+=.13){const ring=addMesh(new THREE.TorusGeometry(r,.022,6,80),'#dce0bb',0,.08,1.3);ring.rotation.x=Math.PI/2;ring.scale.y=.77;}
const obstacles=[];const interactive=[];
function obstacle(x,z,w,d){obstacles.push({x,z,w:w/2+.30,d:d/2+.30});}
function register(object,id,x,z,standX=x,standZ=z){object.userData.id=id;interactive.push(object);return {id,x,z,standX,standZ};}
const places={};
// Main worktable and cloth.
const table=new THREE.Group();scene.add(table);table.position.set(0,0,-1.2);
box(3.7,.24,2.2,'#bc8d58',0,1.12,0,table,.1);
for(const x of [-1.5,1.5])for(const z of [-.78,.78])box(.18,1,.18,'#8e6846',x,.55,z,table);
box(1.55,.045,1.3,'#f3e6b9',0,1.27,0,table,.03);
const patch=box(.6,.04,.62,'#4b9a91',.3,1.31,.1,table,.02);patch.visible=false;
for(let i=0;i<8;i++){const stitch=box(.018,.012,.09,'#f5e7bd',.03+i*.075,1.34,-.23,table,.006);stitch.visible=false;stitch.name='stitch';}
const starShape=new THREE.Shape();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,r=i%2?.13:.29;const x=Math.cos(a)*r,y=Math.sin(a)*r;i?starShape.lineTo(x,y):starShape.moveTo(x,y);}starShape.closePath();
const star=addMesh(new THREE.ShapeGeometry(starShape),'#d4ac4f',-.32,1.30,-.2,table);star.rotation.x=-Math.PI/2;
const tear=line([[-.18,1.31,-.85],[.05,1.31,-1],[.1,1.31,-1.14],[.42,1.31,-1.3]],'#aa8155');
places.table=register(table,'table',0,-1.2,0,.65);obstacle(0,-1.2,3.7,2.2);label('작업대',0,2.2,-1.2);
// Material drawers.
const drawers=new THREE.Group();scene.add(drawers);drawers.position.set(-5.1,0,-4.7);
box(3.15,1.9,1.2,'#ae7c4b',0,.95,0,drawers);
for(let j=0;j<2;j++)for(let i=0;i<3;i++){box(.93,.68,.1,j?'#d4ad79':'#e5c396',-1.03+i*1.03,.5+j*.84,.65,drawers);ball(.09,.07,.07,'#735b3e',-1.03+i*1.03,.5+j*.84,.74,drawers);}
box(3.4,.16,1.4,'#edcfa1',0,1.99,0,drawers);
for(let i=0;i<4;i++)box(.95,.1,.7,['#e6bb9d','#89a39a','#d7ac70','#ddd5b2'][i],-.7,2.12+i*.1,0,drawers);
places.drawer=register(drawers,'drawer',-5.1,-4.7,-5.1,-3.5);obstacle(-5.1,-4.7,3.3,1.4);label('천 서랍',-5.1,2.9,-4.7);
// Shelf, yarn and books.
const shelf=new THREE.Group();shelf.position.set(.2,0,-5);scene.add(shelf);
box(4.5,.15,1,'#aa8054',0,.23,0,shelf);box(4.5,.15,1,'#aa8054',0,1.2,0,shelf);box(4.5,.15,1,'#aa8054',0,2.2,0,shelf);
for(const x of [-2.2,0,2.2])box(.12,2.3,1,'#c39a69',x,1.15,0,shelf);
for(let i=0;i<6;i++){cyl(.19,.48,['#b77362','#76917b','#d6ad5f','#9a9db4','#b77362','#80a9a3'][i],-1.8+i*.63,1.5,0,shelf);cyl(.24,.07,'#e2c99d',-1.8+i*.63,1.77,0,shelf);}
for(let i=0;i<7;i++)box(.22,.64+(i%3)*.08,.65,['#7f9e91','#dfbd8b','#ba8a73'][i%3],-1.75+i*.32,.62,0,shelf,.025);
for(let i=0;i<3;i++)ball(.30,.30,.30,['#d3aa72','#c2846c','#8a9b73'][i],.5+i*.58,.6,0,shelf);
obstacle(.2,-5,4.5,1);
// Decorative bunting, stitching basket, potted plants.
line([[-7.5,3.4,-5.65],[-4,3.05,-5.65],[0,3.25,-5.65]],'#80694b');
for(let i=0;i<9;i++){const tri=new THREE.Shape();tri.moveTo(-.18,0);tri.lineTo(.18,0);tri.lineTo(0,-.34);tri.closePath();addMesh(new THREE.ShapeGeometry(tri),['#dfbb80','#7f9a81','#bc8b72'][i%3],-7+i*.77,3.1+Math.abs(4-i)*.04,-5.6);}
function plant(x,z,s=1){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g);cyl(.32,.45,'#cc9773',0,.24,0,g);cyl(.29,.02,'#71553b',0,.48,0,g);for(let i=0;i<7;i++){const a=i*2.4;const leaf=ball(.15,.42,.09,i%2?'#789667':'#9dab78',Math.cos(a)*.23,.75+Math.random()*.15,Math.sin(a)*.23,g);leaf.rotation.z=Math.cos(a)*.6;leaf.rotation.x=Math.sin(a)*.6;}return g;}
plant(6.9,-4.7,1.4);plant(-6.9,3.9,1.3);plant(6.8,4.7);
const bench=new THREE.Group();bench.position.set(-5.7,0,1);scene.add(bench);box(2.4,.25,1.1,'#d4b280',0,.65,0,bench);for(const x of [-.85,.85])box(.2,.6,.8,'#aa845b',x,.3,0,bench);box(2.2,.15,.8,'#e5c7a4',0,.84,0,bench);obstacle(-5.7,1,2.4,1.1);places.bench=register(bench,'bench',-5.7,1,-5.7,2.1);label('잠깐 쉬기',-5.7,1.7,1);
// Model display: local GLB loads here. No upload and no external network.
const display=new THREE.Group();display.position.set(5.3,0,1.7);scene.add(display);
cyl(1.08,.55,'#d5c29a',0,.28,0,display);cyl(1.16,.12,'#f3e3bf',0,.6,0,display);
const defaultProp=new THREE.Group();display.add(defaultProp);cyl(.43,.75,'#6a9f94',0,1.06,0,defaultProp);cyl(.56,.13,'#cba976',0,.73,0,defaultProp);cyl(.56,.13,'#cba976',0,1.48,0,defaultProp);
for(let i=0;i<11;i++){const r=addMesh(new THREE.TorusGeometry(.435,.013,6,36),'#90b5a4',0,.75+i*.062,0,defaultProp);r.rotation.x=Math.PI/2;}
obstacle(5.3,1.7,2.1,2.1);places.display=register(display,'display',5.3,1.7,5.3,3.2);label('나의 3D 소품',5.3,2.55,1.7,'#4b765c',2);
// Simplified cloth-character stand-ins. Anatomical left is +X when facing +Z.
function character(kind){const g=new THREE.Group();const fur=kind==='rabbit'?'#eee4ca':kind==='bear'?'#caba96':'#b5824c';const patchColor=kind==='rabbit'?'#46958b':kind==='bear'?'#9f5041':'#8f526b';
 const body=ball(.38,.49,.29,fur,0,.8,0,g);ball(.43,.40,.34,fur,0,1.48,0,g);
 if(kind==='rabbit'){for(const x of [-.22,.22]){const ear=ball(.11,.48,.10,fur,x,2.02,0,g);ear.rotation.z=x*.4;ball(.055,.32,.025,'#d5b9a6',x,2.02,.09,g);}}
 else{for(const x of [-.31,.31]){ball(.17,.19,.13,fur,x,1.78,0,g);ball(.09,.105,.025,'#b89573',x,1.79,.12,g);}}
 for(const x of [-.14,.14])ball(.036,.047,.025,'#382e27',x,1.5,.319,g);
 ball(.035,.027,.025,'#765849',0,1.40,.343,g);
 for(const x of [-.22,.22])ball(.07,.035,.015,'#d8b0a0',x,1.40,.29,g);
 box(.17,.18,.028,patchColor,.17,.96,.277,g,.015);
 for(const x of [.10,.24])for(const y of [.90,1.02])box(.035,.008,.01,'#f1ddbb',x,y,.295,g,.002);
 const arms=[];for(const x of [-.42,.42]){const pivot=new THREE.Group();pivot.position.set(x,1.03,0);g.add(pivot);ball(.12,.28,.13,fur,0,-.15,0,pivot);arms.push(pivot);}
 const legs=[];for(const x of [-.20,.20]){const l=ball(.15,.19,.20,fur,x,.28,.07,g);legs.push(l);}
 if(kind==='squirrel'){const tail=ball(.37,.62,.32,fur,.29,.78,-.38,g);tail.rotation.z=-.25;ball(.22,.32,.2,'#d6b07a',.34,.98,-.52,g);}
 if(kind==='rabbit')for(let y=1.68;y<1.86;y+=.055)box(.035,.012,.02,'#bcae92',0,y,.21,g,.002);
 g.userData={kind,arms,legs};g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});return g;
}
const hanto=character('rabbit');hanto.position.set(0,0,3.7);scene.add(hanto);const meLabel=label('한토 · 나',0,2.85,3.7,'#3e7060',1.4);
const bear=character('bear');bear.position.set(-2.7,0,-1.25);bear.rotation.y=.4;scene.add(bear);places.bear=register(bear,'bear',-2.7,-1.25,-3.6,-.1);label('두곰',-2.7,2.25,-1.25,'#875f49',1.1);
const squirrel=character('squirrel');squirrel.position.set(2.9,0,-1.5);squirrel.rotation.y=-.4;scene.add(squirrel);places.thread=register(squirrel,'thread',2.9,-1.5,3.5,-.2);label('세람',2.9,2.25,-1.5,'#8a6073',1.1);
// Ground is separately raycast so a model never becomes a walkable floor.
const floorPick=addMesh(new THREE.PlaneGeometry(15.5,11.5),new THREE.MeshBasicMaterial({visible:false}),0,.015,0);floorPick.rotation.x=-Math.PI/2;
const marker=addMesh(new THREE.RingGeometry(.12,.19,32),new THREE.MeshBasicMaterial({color:'#fff1c7',side:THREE.DoubleSide,transparent:true,opacity:.9}),0,.09,0);marker.rotation.x=-Math.PI/2;marker.visible=false;
const route=[];let pending=null;const keys=new Set();let waveUntil=0,sit=false;
function free(x,z){return x>-7.5&&x<7.5&&z>-5.5&&z<5.5&&!obstacles.some(o=>Math.abs(x-o.x)<o.w&&Math.abs(z-o.z)<o.d);}
// Grid routing avoids walking through the table. This is pathfinding, not physics.
function navigate(x,z,action=null){x=THREE.MathUtils.clamp(x,-7.3,7.3);z=THREE.MathUtils.clamp(z,-5.3,5.3);if(!free(x,z)){toast('이곳에는 물건이 있어요. 옆의 빈 바닥을 눌러주세요.');return;}
 const step=.4,key=(x,z)=>`${x},${z}`,cell=(v)=>Math.round(v/step),sx=cell(hanto.position.x),sz=cell(hanto.position.z),tx=cell(x),tz=cell(z);
 const queue=[[sx,sz]],visited=new Map([[key(sx,sz),null]]);let found=null;
 while(queue.length&&visited.size<2500){const cur=queue.shift();if(cur[0]===tx&&cur[1]===tz){found=cur;break;}for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=cur[0]+dx,nz=cur[1]+dz,k=key(nx,nz);if(!visited.has(k)&&free(nx*step,nz*step)){visited.set(k,cur);queue.push([nx,nz]);}}}
 route.length=0;if(found){let p=found;while(p){route.unshift(new THREE.Vector3(p[0]*step,0,p[1]*step));p=visited.get(key(...p));}route.shift();route.push(new THREE.Vector3(x,0,z));pending=action;marker.position.set(x,.09,z);marker.visible=true;sit=false;}else toast('조금 더 가까운 바닥을 눌러주세요.');}
const raycaster=new THREE.Raycaster();const pointer=new THREE.Vector2();let down=null;
renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,time:performance.now()};});
renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>7||performance.now()-down.time>600)return;pointer.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(interactive,true)[0];if(hit){let obj=hit.object;while(obj&&!obj.userData.id)obj=obj.parent;const p=Object.values(places).find(p=>p.id===obj?.userData.id);if(p)navigate(p.standX,p.standZ,p.id);return;}const ground=raycaster.intersectObject(floorPick)[0];if(ground)navigate(ground.point.x,ground.point.z);});
window.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||e.target.matches('input,textarea,select'))return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys.add(e.key.toLowerCase());if(e.key.toLowerCase()==='e')nearest();});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>keys.clear());
for(const b of document.querySelectorAll('[data-key]')){b.addEventListener('pointerdown',e=>{e.preventDefault();keys.add(b.dataset.key.toLowerCase());b.setPointerCapture(e.pointerId);});for(const type of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(type,()=>keys.delete(b.dataset.key.toLowerCase()));}
function nearest(){let closest=null,d=Infinity;for(const p of Object.values(places)){const n=Math.hypot(hanto.position.x-p.standX,hanto.position.z-p.standZ);if(n<d){closest=p;d=n;}}if(closest&&d<2.2)interact(closest.id);else toast('서랍, 친구 또는 작업대 가까이 다가가 보세요.');}
let toastTimeout;function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$('toast').classList.remove('show'),4000);}
function updateQuest(){for(const el of document.querySelectorAll('[data-step]')){const yes=state[el.dataset.step];el.classList.toggle('done',yes);el.querySelector('i').textContent=yes?'✓':({cloth:1,bear:2,thread:3,repair:4}[el.dataset.step]);}patch.visible=state.repair;tear.visible=!state.repair;table.children.filter(o=>o.name==='stitch').forEach(o=>o.visible=state.repair);if(state.repair)$('quest-note').textContent='별도, 수선 자국도 함께 남았어요. 이제 작업실에서 천천히 쉬어가세요.';}
function dialog(speaker,title,text,actionLabel,fn){keys.clear();route.length=0;pending=null;marker.visible=false;$('speaker').textContent=speaker;$('dialog-title').textContent=title;$('text').textContent=text;$('dialog-action').textContent=actionLabel;$('dialog-action').onclick=()=>{$('conversation').close();fn?.();};$('conversation').showModal();}
function interact(id){if(id==='drawer')dialog('천 서랍','어떤 천을 덧댈까요?',state.cloth?'청록색 천을 챙겼어요. 두곰과 세람에게 필요한 도움을 부탁해 보세요.':'낡은 별 자수를 가리지 않을 작은 청록색 천이 있어요. 찢어진 부분을 덮을 만큼만 챙겨볼까요?',state.cloth?'확인':'천 챙기기',()=>{state.cloth=true;updateQuest();toast('청록색 천을 챙겼어요.');});
 else if(id==='bear')dialog('두곰','한쪽은 내가 잡아줄게.',state.bear?'천이 구겨지지 않게 잡고 있을게. 별 자수는 그대로 남겨주자.':'혼자 팽팽하게 잡기는 어렵지? 내가 반대쪽을 잡을게. 오래된 별 자수는 남기면 좋겠어.',state.bear?'고마워':'도움 부탁하기',()=>{state.bear=true;updateQuest();waveUntil=performance.now()+1500;toast('두곰이 천을 잡아주기로 했어요.');});
 else if(id==='thread')dialog('세람','맞는 실을 찾아왔어!',state.thread?'튼튼한 실을 준비했어. 이제 작업대로 가보자.':'도구 선반에서 튼튼한 실을 찾았어. 서두르기 전에 색과 길이가 맞는지 함께 확인할까?',state.thread?'좋아':'실 부탁하기',()=>{state.thread=true;updateQuest();toast('세람이 실을 준비했어요.');});
 else if(id==='table'){if(state.repair)dialog('작업대','흔적이 남아도 괜찮아.','오래된 금색 별 옆에 청록색 덧댐과 봉제선이 남았어요. 한토의 솜씨, 두곰의 손길, 세람이 고른 실이 함께 만든 결과예요.','사진 남기기',savePhoto);else if(!state.cloth||!state.bear||!state.thread)dialog('작업대','함께 준비해 볼까요?','필요한 준비\n'+[!state.cloth&&'• 서랍에서 청록색 천 찾기',!state.bear&&'• 두곰에게 천을 잡아 달라고 부탁하기',!state.thread&&'• 세람에게 실 부탁하기'].filter(Boolean).join('\n'),'찾아보기');else dialog('작업대','서로의 손길을 연결해요.','두곰이 천을 잡고, 세람이 실을 건네면 한토가 꿰맵니다. 금색 별은 남기고 찢어진 부분에 새 천을 덧대요.','함께 수선하기',()=>{state.repair=true;updateQuest();toast('작은 수선이 끝났어요. 우리 셋이 함께 했어요.');});}
 else if(id==='bench'){sit=!sit;toast(sit?'잠시 쉬어가요. 다시 걸으면 일어나요.':'다시 작업실을 둘러봐요.');}
 else if(id==='display')$('assets').showModal();}
for(const b of document.querySelectorAll('dialog .close'))b.onclick=()=>b.closest('dialog').close();$('dialog-cancel').onclick=()=>$('conversation').close();$('help-btn').onclick=()=>$('help').showModal();document.querySelector('.close-help').onclick=()=>$('help').close();$('asset-btn').onclick=()=>$('assets').showModal();$('asset-done').onclick=()=>{$('assets').close();navigate(5.3,3.2);};$('interact-btn').onclick=nearest;$('view-btn').onclick=homeView;$('wave-btn').onclick=()=>{waveUntil=performance.now()+1800;toast('한토가 손을 흔들어요.');};
$('reset-btn').onclick=()=>{for(const k of Object.keys(state))state[k]=false;route.length=0;pending=null;sit=false;hanto.position.set(0,0,3.7);$('quest-note').innerHTML='한토로 작업실을 둘러보세요.<br>사물이나 친구를 누르면 다가가요.';updateQuest();$('help').close();toast('새로운 하루를 시작해요.');};
$('quest-toggle').onclick=()=>{const expanded=document.querySelector('.quest').classList.toggle('expanded');$('quest-toggle').textContent=expanded?'접기':'할 일 펼치기';$('quest-toggle').setAttribute('aria-expanded',String(expanded));};
let evening=false;$('light-btn').onclick=()=>{evening=!evening;$('light-btn').textContent=evening?'☾ 저녁의 빛':'☀ 오후의 빛';sun.color.set(evening?'#ffbf82':'#fff1cf');sun.intensity=evening?1.8:3.2;hemi.intensity=evening?1.3:2.3;scene.background.set(evening?'#a8b8b0':'#dce6d5');scene.fog.color.copy(scene.background);};
function savePhoto(){renderer.render(scene,camera);const a=document.createElement('a');a.download='미완성수선소_작업실.png';a.href=renderer.domElement.toDataURL('image/png');a.click();toast('작업실 사진을 저장했어요.');}$('photo-btn').onclick=savePhoto;
// GLB is parsed from the local File ArrayBuffer. Texture files must be embedded.
let imported=null,importVersion=0;const loader=new GLTFLoader();
function disposeModel(model){const geo=new Set(),mats=new Set(),textures=new Set();model.traverse(o=>{if(o.geometry)geo.add(o.geometry);for(const m of (Array.isArray(o.material)?o.material:[o.material]).filter(Boolean)){mats.add(m);for(const v of Object.values(m))if(v?.isTexture)textures.add(v);}});geo.forEach(g=>g.dispose());textures.forEach(t=>t.dispose());mats.forEach(m=>m.dispose());}
function clearImported(){if(imported){display.remove(imported);disposeModel(imported);imported=null;}defaultProp.visible=true;}
function modelTransform(){if(!imported)return;const s=Number($('model-scale').value);imported.scale.setScalar(s);imported.rotation.y=THREE.MathUtils.degToRad(Number($('model-rotation').value));$('scale-value').textContent=s.toFixed(1);}
function modelColor(){if(!imported)return;imported.traverse(o=>{if(!o.isMesh)return;for(const m of Array.isArray(o.material)?o.material:[o.material]){if(!m?.color)continue;if($('recolor').checked){m.map=null;m.color.set($('model-color').value);}else{m.map=m.userData.originalMap;m.color.copy(m.userData.originalColor);}m.needsUpdate=true;}});}
$('model-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;const version=++importVersion;if(!file.name.toLowerCase().endsWith('.glb')){toast('GLB 파일을 선택해주세요.');return;}if(file.size>25*1024*1024){$('import-status').textContent='25MB 이하의 가벼운 GLB를 사용해주세요.';return;}$('import-status').textContent='소품을 읽는 중…';try{const gltf=await loader.parseAsync(await file.arrayBuffer(),'');if(version!==importVersion){disposeModel(gltf.scene);return;}const model=gltf.scene;model.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());const maximum=Math.max(size.x,size.y,size.z);if(!Number.isFinite(maximum)||maximum<1e-6)throw new Error('크기를 확인할 수 없는 모델입니다.');const norm=new THREE.Group();norm.add(model);const factor=1.7/maximum;model.position.sub(center);model.position.y+=size.y/2;model.scale.multiplyScalar(factor);model.position.multiplyScalar(factor);model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;const originals=Array.isArray(o.material)?o.material:[o.material];const copies=originals.map(m=>{const clone=m.clone();clone.userData.originalColor=clone.color?.clone();clone.userData.originalMap=clone.map;return clone;});o.material=Array.isArray(o.material)?copies:copies[0];}});clearImported();norm.position.y=.68;display.add(norm);imported=norm;defaultProp.visible=false;$('model-scale').value='1';$('model-rotation').value='0';$('recolor').checked=false;modelTransform();$('import-status').textContent=`${file.name} · ${(file.size/1024/1024).toFixed(1)}MB · 이 화면에서만 사용 중`;toast('전시대에 소품을 놓았어요.');}catch(error){$('import-status').textContent='불러오지 못했어요. 외부 파일이 없는 비압축 GLB인지 확인하세요. '+error.message;}};
$('model-scale').oninput=modelTransform;$('model-rotation').oninput=modelTransform;$('model-color').oninput=modelColor;$('recolor').onchange=modelColor;$('remove-model').onclick=()=>{importVersion++;clearImported();$('model-file').value='';$('import-status').textContent='기본 실타래를 다시 놓았습니다.';};
const clock=new THREE.Clock();const forward=new THREE.Vector3(),right=new THREE.Vector3();let elapsed=0;
function animate(){const dt=Math.min(clock.getDelta(),.05);elapsed+=dt;let moving=false;if(!document.querySelector('dialog[open]')){let ix=0,iz=0;if(keys.has('w')||keys.has('arrowup'))iz+=1;if(keys.has('s')||keys.has('arrowdown'))iz-=1;if(keys.has('d')||keys.has('arrowright'))ix+=1;if(keys.has('a')||keys.has('arrowleft'))ix-=1;
 let velocity=new THREE.Vector3();if(ix||iz){route.length=0;pending=null;marker.visible=false;sit=false;camera.getWorldDirection(forward);forward.y=0;forward.normalize();right.crossVectors(forward,new THREE.Vector3(0,1,0)).normalize();velocity.addScaledVector(forward,iz).addScaledVector(right,ix).normalize().multiplyScalar(ROOM.speed*dt);}
 else if(route.length){const diff=route[0].clone().sub(hanto.position);diff.y=0;if(diff.length()<.12)route.shift();else velocity.copy(diff.normalize().multiplyScalar(ROOM.speed*dt));}
 if(velocity.lengthSq()>0){const px=hanto.position.x,pz=hanto.position.z;if(free(px+velocity.x,pz))hanto.position.x+=velocity.x;if(free(hanto.position.x,pz+velocity.z))hanto.position.z+=velocity.z;moving=true;hanto.rotation.y=Math.atan2(velocity.x,velocity.z);}
 if(!route.length&&pending){const next=pending;pending=null;marker.visible=false;interact(next);}}
 hanto.position.y=sit?-.19:(moving?Math.sin(elapsed*14)*.04:Math.sin(elapsed*2)*.012);hanto.userData.legs.forEach((leg,i)=>leg.rotation.x=moving?Math.sin(elapsed*14+i*Math.PI)*.45:0);hanto.userData.arms.forEach((arm,i)=>arm.rotation.x=moving?Math.sin(elapsed*14+i*Math.PI)*.35:0);
 hanto.userData.arms[1].rotation.z=performance.now()<waveUntil?-1.8+Math.sin(elapsed*16)*.3:0;
 bear.position.y=Math.sin(elapsed*1.8)*.015;squirrel.position.y=Math.sin(elapsed*2.3)*.018;
 bear.userData.arms[0].rotation.x=state.bear?-.7:0;bear.userData.arms[1].rotation.x=state.bear?-.7:0;squirrel.userData.arms[0].rotation.x=state.thread?-.8:0;
 meLabel.position.set(hanto.position.x,2.85+hanto.position.y,hanto.position.z);controls.update();renderer.render(scene,camera);requestAnimationFrame(animate);}
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
updateQuest();animate();$('loading').remove();toast('한토의 작업실에 오신 걸 환영해요.');
