import vertex from './vertex.glsl';
import fragment from './fragment.glsl';

export default {
    uniforms:
        {
            time: { value: 1.0 },
            power: { value: 1.0 },
            particleSize: { value: 4.0 },
            resolution: { value: new THREE.Vector2() },
            mouse: { value: new THREE.Vector2() }
        },
    vertexShader: vertex,
    fragmentShader: fragment
};