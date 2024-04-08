import * as THREE from 'three';
Scene = function() {
    var scene = new THREE.Scene();//the 3d scene
    scene.fog = new THREE.FogExp2( 0xf0fff0, 0.14 );
    return scene;
}
export default Scene;