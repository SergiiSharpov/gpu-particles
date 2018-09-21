import * as _ from 'lodash';
import PointsDeform from './shaders/PointsDeform/index';
import * as dat from './lib/dat.gui.min';
import * as Stats from './lib/stats.min';

let camera, scene, renderer, gui, stats;
let points;
let shaderData;
let clock;

let mouse = new THREE.Vector2();

const particles = +localStorage.getItem('particles_count') || 64000;

const API = {
    particles,
    particleSize: 4.0,
    power: 1.0
};

init();
initGUI();
animate();

function init() {
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 5, 3500 );
    camera.position.z = 2750;
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x050505 );
    scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

    clock = new THREE.Clock();

    let geometry = new THREE.BufferGeometry();
    let positions = [];
    let colors = [];
    let normals = [];
    let color = new THREE.Color();
    let n = 1000, n2 = n / 2;
    for ( let i = 0; i < particles; i ++ ) {
        // positions
        let x = Math.random() * n - n2;
        let y = Math.random() * n - n2;
        let z = Math.random() * n - n2;
        positions.push( x, y, z );
        // colors
        let vx = ( x / n ) + 0.5;
        let vy = ( y / n ) + 0.5;
        let vz = ( z / n ) + 0.5;

        color.setRGB( vx, vy, vz );

        colors.push( color.r, color.g, color.b );

        // colors
        let nx = Math.random() - 0.5;
        let ny = Math.random() - 0.5;
        let nz = Math.random() - 0.5;
        normals.push( nx, ny, nz );
    }
    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
    geometry.computeBoundingSphere();
    
    shaderData = _.extend({}, PointsDeform);
    let material = new THREE.ShaderMaterial(shaderData);
    points = new THREE.Points( geometry, material );
    scene.add( points );
    
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    stats = new Stats();
    document.body.appendChild( stats.dom );

    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener( 'mousemove', onMouseMove, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

function animate() {
    requestAnimationFrame( animate );

    stats.begin();
    render();
    stats.end();
}

function render() {
    let time = Date.now() * 0.001;
    points.rotation.x = time * 0.25;
    points.rotation.y = time * 0.5;

    clock.getDelta();
    shaderData.uniforms.time.value = clock.elapsedTime;

    shaderData.uniforms.resolution.value.x = window.innerWidth;
    shaderData.uniforms.resolution.value.y = window.innerHeight;

    shaderData.uniforms.mouse.value = mouse;
    shaderData.uniforms.particleSize.value = API.particleSize;
    shaderData.uniforms.power.value = API.power;

    renderer.render( scene, camera );
}

function initGUI() {

    gui = new dat.GUI();

    gui.add(API, 'particles', [64000, 256000, 512000, 1000000, 2000000, 5000000]).onChange(() => {
        localStorage.setItem('particles_count', API.particles);
        location.reload();
    });

    gui.add(API, 'particleSize', 1.0, 16.0);
    gui.add(API, 'power', 0.1, 16.0);
}