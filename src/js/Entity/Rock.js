import * as THREE from "three";

Rock = function () {
    var sides = 8;
    var tiers = 6;
    var scalarMultiplier = Math.random() * (0.25 - 0.1) + 0.05;
    var midPointVector = new THREE.Vector3();
    var treeGeometry = new THREE.ConeGeometry(0.5, 1, sides, tiers);
    midPointVector = treeGeometry.vertices[0].clone();
    blowUpRock(treeGeometry.vertices, sides, 0, scalarMultiplier);
    tightenRock(treeGeometry.vertices, sides, 1);
    blowUpRock(treeGeometry.vertices, sides, 2, scalarMultiplier * 1.1, true);
    tightenRock(treeGeometry.vertices, sides, 3);
    blowUpRock(treeGeometry.vertices, sides, 4, scalarMultiplier * 1.2);
    tightenRock(treeGeometry.vertices, sides, 5);

    var rockGeometry = new THREE.IcosahedronGeometry(0.3, 1);
    var rockMaterial = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        shading: THREE.FlatShading,
    });
    var rock = new THREE.Mesh(rockGeometry, rockMaterial);
    rock.position.y = 0.15;
    var tree = new THREE.Object3D();
    tree.add(rock);
    tree.isCollided = false;
    return tree;
};

function blowUpRock(vertices, sides, currentTier, scalarMultiplier, odd) {
    var vertexIndex;
    var vertexVector = new THREE.Vector3();
    var midPointVector = vertices[0].clone();
    var offset;
    for (var i = 0; i < sides; i++) {
        vertexIndex = currentTier * sides + 1;
        vertexVector = vertices[i + vertexIndex].clone();
        midPointVector.y = vertexVector.y;
        offset = vertexVector.sub(midPointVector);
        if (odd) {
            if (i % 2 === 0) {
                offset.normalize().multiplyScalar(scalarMultiplier / 6);
                vertices[i + vertexIndex].add(offset);
            } else {
                offset.normalize().multiplyScalar(scalarMultiplier);
                vertices[i + vertexIndex].add(offset);
                vertices[i + vertexIndex].y = vertices[i + vertexIndex + sides].y + 0.05;
            }
        } else {
            if (i % 2 !== 0) {
                offset.normalize().multiplyScalar(scalarMultiplier / 6);
                vertices[i + vertexIndex].add(offset);
            } else {
                offset.normalize().multiplyScalar(scalarMultiplier);
                vertices[i + vertexIndex].add(offset);
                vertices[i + vertexIndex].y = vertices[i + vertexIndex + sides].y + 0.05;
            }
        }
    }
}

function tightenRock(vertices, sides, currentTier) {
    var vertexIndex;
    var vertexVector = new THREE.Vector3();
    var midPointVector = vertices[0].clone();
    var offset;
    for (var i = 0; i < sides; i++) {
        vertexIndex = currentTier * sides + 1;
        vertexVector = vertices[i + vertexIndex].clone();
        midPointVector.y = vertexVector.y;
        offset = vertexVector.sub(midPointVector);
        offset.normalize().multiplyScalar(0.06);
        vertices[i + vertexIndex].sub(offset);
    }
}

export default Rock;
