//import * as THREE from '../Web_AR_Library_from_Udemy_course/libs/three.js-r132/build/three.module.js';
//import { GLTFLoader } from '../Web_AR_Library_from_Udemy_course/libs/three.js-r132/examples/jsm/loaders/GLTFLoader.js';
//import  * as gsap from '../Web_AR_Library_from_Udemy_course/libs/three.js-r132/build/gsap.min.js';
//import  * as gsap from '../final/gsap.min.js';

document.addEventListener('DOMContentLoaded',() => {
    const start = async() => {
        const size = {
            h:window.innerHeight,
            w:window.innerWidth
        }
        
        let scrollY = window.scrollY;

        const cursor = {x:0,y:0}
        const canvas = document.querySelector('canvas.webglRenderer');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35,size.w/size.h, 0.2,20);
        const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true,canvas:canvas});
        const cameraGroup = new THREE.Group();
        const bg = new THREE.BufferGeometry();
        const particles = 2500;
        const vertices = new Float32Array(particles * 3);
        const dist = -3;

        const directionalLight = new THREE.DirectionalLight(0xffffff,0.2);
        directionalLight.position.set(0,25,0);
        const ambientLight = new THREE.AmbientLight(0xffffff,0.2);
        const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.2);

        scene.add(directionalLight);
        scene.add(ambientLight);
        scene.add(hemisphereLight);

        //camera.position.set( new THREE.Vector3( 0, 0, 0.8 ));
        camera.position.z = 5;
        camera.lookAt(0,0,0);
        console.log(camera.rotation);
        console.log(camera.quaternion);
        console.log(camera.matrix);

        // camera.quaternion.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), Math.PI );
        // camera.quaternion.set(0,0,0,1);
        camera.updateProjectionMatrix();
        cameraGroup.add(camera);

        renderer.setSize(size.w,size.h);
        renderer.setPixelRatio(size.w/size.h);
        //renderer.render(scene,camera);

        const models = Array(9).fill();
        //const mesh = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60),new THREE.MeshToonMaterial({ color: '#ffeded' }));
        const loader = new GLTFLoader();
        
        function glb(address, meshIndex) {
            loader.load(address,(gltf)=>{
                var mesh = gltf.scene;
                console.log(mesh.children[0].name);
                for(let m in mesh.children){
                    console.log(m.name);
                }
                
                mesh.updateMatrix();
                mesh.position.set(0,Math.round(dist*meshIndex),0);
                mesh.quaternion.setFromAxisAngle( new THREE.Vector3( 1, 0.5, 0 ), Math.PI / 5 );
                
                const box = new THREE.Box3().setFromObject(mesh);
                const boxSize = box.getSize(new THREE.Vector3());
                mesh.scale.multiplyScalar(1.6/Math.max(boxSize.x,boxSize.y,boxSize.z));
                models[meshIndex] = (mesh);
                scene.add(mesh);
            });
        }
        //document.getElementById("model").appendChild(renderer.domElement);
        let currentSection = 0;
        window.addEventListener('scroll',()=>{
            scrollY = window.scrollY;
            console.log(camera.position.y + " " + window.scrollY+ " " + window.scrollY/ size.h+ " " + window.scrollY/ size.h * dist);
            var newSection = Math.round(scrollY/size.h);
            if ( newSection != currentSection){
                currentSection = newSection;
                gsap.to(
                    models[currentSection].rotation,{
                    duration: 2,
                    ease: 'power2.inOut',
                    x:'+=6',
                    y:'+=3'
                })
            }
        })

        /*glb('./components/glb/rc522.glb',0);
        glb('./components/glb/potentiometer.glb',1);
        glb('./components/glb/stepper.glb',2);
        glb('./components/glb/pushbutton.glb',3);
        glb('./components/glb/buzzer.glb',4);
        glb('./components/glb/servomotor.glb',5);
        glb('./components/glb/dhtsensor.glb',6);
        glb('./components/glb/led.glb',7);
        glb('./components/glb/uno.glb',8);
        glb('./components/glb/compass.glb',9);*/
        glb('./rc522.glb',0);
        glb('./potentiometer.glb',1);
        glb('./stepper.glb',2);
        glb('./pushbutton.glb',3);
        glb('./buzzer.glb',4);
        glb('./servomotor.glb',5);
        glb('./dhtsensor.glb',6);
        glb('./led.glb',7);
        glb('./uno.glb',8);
        glb('./compass.glb',9);
        const animate_tick = () => {
            window.requestAnimationFrame(animate_tick);
            for(var meshModel of models){
                //meshModel.position.y += 0.001* Math.sin(time*0.002+2);
            }
            cameraGroup.position.x += (cursor.x * 0.4 - cameraGroup.position.x)  * 0.2;//* 5 * deltaTime;
            cameraGroup.position.y += (-cursor.y * 0.4 - cameraGroup.position.y)  * 0.2;//* 5 * deltaTime;
            camera.position.y = (scrollY/ size.h * dist);//.toFixed(2);//uncomment to add jitter stutter shaky virating 
            camera.lookAt(0,scrollY/ size.h * dist,0);
            renderer.render(scene,camera);
        }

        window.addEventListener('mousemove',(event)=>{
            cursor.x = -event.clientX/size.w + 0.5;
            cursor.y = -event.clientY/size.h + 0.5;
        })

        for (let n = 0;n < particles; n++){
            vertices[n * 3 + 0] = (Math.random()-0.5) * 5;
            vertices[n * 3 + 1] = (-dist * 0.5 + Math.random() * dist * models.length);
            vertices[n * 3 + 2] = (Math.random()-0.5) * 5;
        };

        bg.setAttribute('position',  new THREE.BufferAttribute(vertices , 3) );

        const points = new THREE.Points(bg, new THREE.PointsMaterial({
            color: '#ffeded',
            sizeAttenuation: true,
            size: 0.032})
        );
        scene.add(points);

        window.addEventListener('resize',()=>{
            size.w=window.innerWidth;
            size.h=window.innerHeight;
            camera.aspect=(size.w/size.h);
            camera.updateProjectionMatrix();
            renderer.setSize(size.w,size.h);
            renderer.setPixelRatio(size.w/size.h);
        })
        animate_tick();
        setTimeout(() => {console.log('i_came_after__sec')},20000);
    }
    start();
})