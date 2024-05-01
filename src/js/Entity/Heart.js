import * as THREE from "three";

Heart = function () {
    var x = 0,
        y = 0;
    var heartShape = new THREE.Shape();

    heartShape.moveTo(x + 5, y + 5);
    heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

    var geometry = new THREE.ExtrudeGeometry(heartShape, {
        steps: 2,
        depth: 2,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 1,
    });

    var material = new THREE.MeshStandardMaterial({
        color: 0xaa0000,
        shading: THREE.FlatShading,
    });

    var heart = new THREE.Mesh(geometry, material);
    heart.position.y = 0.15;
    var object3D = new THREE.Object3D();
    object3D.add(heart);
    object3D.isCollided = false;
    object3D.scale.set(0.03, 0.03, 0.03);
    return object3D;
};

export default Heart;
