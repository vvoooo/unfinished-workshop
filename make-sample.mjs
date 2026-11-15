// A small, original, untextured GLB for practicing model import without credits.
import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { mkdir, writeFile } from 'node:fs/promises';
globalThis.FileReader = class {
  readAsArrayBuffer(blob){blob.arrayBuffer().then(b=>{this.result=b;this.onloadend?.();});}
  readAsDataURL(blob){blob.arrayBuffer().then(b=>{this.result=`data:${blob.type};base64,${Buffer.from(b).toString('base64')}`;this.onloadend?.();});}
};
const model=new THREE.Group();model.name='practice_spool';
for(const [radius,height,y,color] of [[.43,.75,.5,0x6a9f94],[.56,.13,.06,0xcba976],[.56,.13,.94,0xcba976]]){
  const part=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,height,24),new THREE.MeshStandardMaterial({color,roughness:.9}));
  part.position.y=y;model.add(part);
}
const result=await new GLTFExporter().parseAsync(model,{binary:true});
await mkdir('assets',{recursive:true});await writeFile('assets/practice_spool.glb',Buffer.from(result));
console.log(`Original sample GLB: ${result.byteLength} bytes`);
