import * as THREE from 'three';

var Hero, heroSphere, THREE;
Hero = function(currentLane=0, heroBaseY=1.8, heroBaseZ=4.8, heroRadius=0.2, herocolor=0xFF0000) {
    var sphereGeometry = new THREE.DodecahedronGeometry( heroRadius, 1);
    var sphereMaterial = new THREE.MeshStandardMaterial( { color: herocolor ,shading:THREE.FlatShading} )

    heroSphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
    heroSphere.receiveShadow = true;
    heroSphere.castShadow=true;

    heroSphere.position.y=heroBaseY;
    heroSphere.position.z=heroBaseZ;

    heroSphere.position.x=currentLane;
    return heroSphere;
}
export default Hero;