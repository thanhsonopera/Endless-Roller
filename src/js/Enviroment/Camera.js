import * as THREE from 'three';
var Camera = function(sceneWidth, sceneHeight) {
    var camera = new THREE.PerspectiveCamera( 60, sceneWidth / sceneHeight, 0.1, 1000 );//perspective camera
    camera.position.z = 6.5;
    camera.position.y = 2.5;
    return camera;
}

export default Camera;