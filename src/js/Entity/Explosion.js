import * as THREE from 'three';
var particleCount=20;
ParticleGeometry = function() {
    var particleGeometry = new THREE.Geometry();
    for (var i = 0; i < particleCount; i ++ ) {
        var vertex = new THREE.Vector3();
        particleGeometry.vertices.push( vertex );
    }
    return particleGeometry 
}
PMaterial = function() {
    var pMaterial = new THREE.ParticleBasicMaterial({
        color: 0xfffafa,
        size: 0.2
    });
    return pMaterial;
}
Explosion = function (particleGeometry, pMaterial) {
    
	var particles = new THREE.Points( particleGeometry, pMaterial );
    particles.visible=false;
    return particles;
}
export  {ParticleGeometry, PMaterial, Explosion};