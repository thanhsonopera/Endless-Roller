import * as THREE from 'three';

Hero = function(currentLane, heroBaseY, heroRadius) {
    var sphereGeometry = new THREE.DodecahedronGeometry( heroRadius, 1);
    var sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xe5f2f2 ,shading:THREE.FlatShading} )

    heroSphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
    heroSphere.receiveShadow = true;
    heroSphere.castShadow=true;

    heroSphere.position.y=heroBaseY;
    heroSphere.position.z=4.8;

    heroSphere.position.x=currentLane;
    return heroSphere;
}
export default Hero;