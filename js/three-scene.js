(() => {
  const canvas = document.getElementById('space');
  if (!canvas || !window.THREE || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (canvas) canvas.hidden = true;
    return;
  }
  try {
    const renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:false,powerPreference:'low-power'});
    renderer.setPixelRatio(0.45);
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x11110f,7,22);
    const camera = new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.1,40);
    camera.position.set(0,3.6,8);
    const grid = new THREE.GridHelper(36,36,0x6f9f3d,0x24351a);
    grid.position.y = -2.1; scene.add(grid);
    const geo = new THREE.BoxGeometry(1,1,1);
    const blocks = Array.from({length:18},(_,i) => {
      const mat = new THREE.MeshBasicMaterial({color:i%4===0?0xff8a35:0x6f9f3d,wireframe:true,transparent:true,opacity:.35});
      const b = new THREE.Mesh(geo,mat);
      b.position.set((Math.random()-.5)*18,(Math.random()-.5)*8,-2-Math.random()*13);
      b.scale.setScalar(.25+Math.random()*.8); scene.add(b); return b;
    });
    const smile = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25,0),new THREE.MeshBasicMaterial({color:0xb6ff4a,wireframe:true,transparent:true,opacity:.16}));
    smile.position.set(5,1,-7); scene.add(smile);
    let mx=0,my=0,frame=0;
    addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-.5)*.5;my=(e.clientY/innerHeight-.5)*.25},{passive:true});
    const resize=()=>{renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()};
    addEventListener('resize',resize); resize();
    function loop(){requestAnimationFrame(loop);frame++;if(frame%4)return;camera.position.x+=(mx-camera.position.x)*.025;camera.position.y+=(3.6-my-camera.position.y)*.025;smile.rotation.x+=.012;smile.rotation.y+=.018;blocks.forEach((b,i)=>{b.rotation.y+=.003*(i%3+1);if(frame%280===0&&Math.random()<.14)b.visible=!b.visible});renderer.render(scene,camera)}
    loop();
  } catch (err) { canvas.hidden=true; }
})();
