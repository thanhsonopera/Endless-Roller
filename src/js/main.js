import * as THREE from "three";
import RollingGroundSphere from "./Entity/World.js";
import Tree from "./Entity/Tree.js";
import { ParticleGeometry, PMaterial, Explosion } from "./Entity/Explosion.js";
import Hero from "./Entity/Hero.js";
import Camera from "./Enviroment/Camera.js";
import Renderer from "./Enviroment/Renderer.js";
import Scene from "./Enviroment/Scene.js";
import Light from "./Enviroment/Light.js";
import Rock from "./Entity/Rock.js";
var sceneWidth;
var sceneHeight;
var camera;
var scene;
var renderer;
var dom;
var sun;
var ground;
//var orbitControl;
var rollingGroundSphere;
var heroSphere;
var rollingSpeed = 0.008;
var heroRollingSpeed;
var worldRadius = 26;
var heroRadius = 0.2;
var sphericalHelper;
var pathAngleValues;
var heroBaseY = 1.8;
var bounceValue = 0.1;
var gravity = 0.005;
var leftLane = -1;
var rightLane = 1;
var middleLane = 0;
var currentLane;
var clock;
var jumping;
var treeReleaseInterval = 0.5;
var lastTreeReleaseTime = 0;
var treesInPath;
var treesPool;
var rocksInPath;
var rocksPool;
var particleGeometry;
var particleCount = 20;
var explosionPower = 1.06;
var particles;
//var stats;
var scoreText;
var score;
var hasCollided;

var state = 0;
var health = 10; // Initialize health

initEnviroment()
window.selected = -1
window.onclick = function() {
    if (window.selected != -1) {
        console.log(window.selected);
        while(scene.children.length > 0){ 
            scene.remove(scene.children[0]); 
        }
        listSceneObjects(scene)
        state = 1
        init()
        camera.position.z = 6.5;
        camera.position.y = 2.5;
    }
}
    
function init() {
    // set up the scene
    createScene();
    //call game loop
    // update();
}

// Initialize default values
function initDefaultValues() {
    // Game parameters
    rollingSpeed = 0.008;
    heroRadius = 0.2;
    worldRadius = 26;
    heroBaseY = 1.8;
    treeReleaseInterval = 0.5;
    gravity = 0.005;
    // Lane positions
    leftLane = -1;
    rightLane = 1;
    middleLane = 0;
    currentLane = middleLane;
}
function initEnviroment() {
    sceneWidth = window.innerWidth;
    sceneHeight = window.innerHeight;

    scene = Scene();
    camera = Camera(sceneWidth, sceneHeight);
    renderer = Renderer(sceneWidth, sceneHeight);

    dom = document.getElementById("TutContainer");
    dom.appendChild(renderer.domElement);

    window.addEventListener("resize", onWindowResize, false); //resize callback
    document.onkeydown = handleKeyDown;
    
    createHeroMenu()
    addLight()
    // addWorld()
    update()
    // init();
}
function handleKeyDown(keyEvent) {
    if (jumping) return;
    var validMove = true;
    if (keyEvent.keyCode === 37) {
        //left
        if (currentLane == middleLane) {
            currentLane = leftLane;
        } else if (currentLane == rightLane) {
            currentLane = middleLane;
        } else {
            validMove = false;
        }
    } else if (keyEvent.keyCode === 39) {
        //right
        if (currentLane == middleLane) {
            currentLane = rightLane;
        } else if (currentLane == leftLane) {
            currentLane = middleLane;
        } else {
            validMove = false;
        }
    } else {
        if (keyEvent.keyCode === 38) {
            //up, jump
            bounceValue = 0.1;
            jumping = true;
        }
        validMove = false;
    }
    //heroSphere.position.x=currentLane;
    if (validMove) {
        jumping = true;
        bounceValue = 0.06;
    }
}

function createHeroMenu() {
    var heroSphereRight = Hero(1.2, 2, 4.8, 0.2, 0x0000FF);
    scene.add(heroSphereRight)

    var heroSphereCenter = Hero(0, 2, 4.8, 0.22, 0xFF0000);
    scene.add(heroSphereCenter)

    var heroSphereLeft = Hero(-1.2, 2, 4.8, 0.2, 0xe5f2f2);
    scene.add(heroSphereLeft)

    listSceneObjects(scene);
}

function listSceneObjects(scene) {
    scene.children.forEach((object) => {
        console.log(object);
    });
}
function createScene() {
    hasCollided = false;
    score = 0;
    treesInPath = [];
    treesPool = [];
    rocksInPath = [];
    rocksPool = [];

    heroRollingSpeed = (rollingSpeed * worldRadius) / heroRadius / 5;
    sphericalHelper = new THREE.Spherical();
    pathAngleValues = [1.52, 1.57, 1.62];

    clock = new THREE.Clock();
    clock.start();

    createTreesPool();
    createRocksPool();
    addWorld();
    addHero();
    addLight()
    addExplosion();
}

function addLight() {
    var hemisphereLight = new THREE.HemisphereLight(0xfffafa, 0x000000, 0.9);
    scene.add(hemisphereLight);
    sun = Light();
    scene.add(sun);
}

function addWorld() {
    rollingGroundSphere = RollingGroundSphere();
    scene.add(rollingGroundSphere);
    addWorldTrees();
    addWorldRocks();
}

function addHero() {
    jumping = false;
    currentLane = middleLane;
    heroSphere = Hero(currentLane, heroBaseY, 4.8, heroRadius, 0xFF0000);
    scene.add(heroSphere);
}

function addExplosion() {
    particleGeometry = ParticleGeometry();
    var pMaterial = PMaterial();
    particles = Explosion(particleGeometry, pMaterial);
    scene.add(particles);
}

function createTreesPool() {
    var maxTreesInPool = 10;
    var newTree;
    for (var i = 0; i < maxTreesInPool; i++) {
        newTree = Tree();
        treesPool.push(newTree);
    }
}

function createRocksPool() {
    var maxRocksInPool = 10;
    var newRock;
    for (var i = 0; i < maxRocksInPool; i++) {
        newRock = Rock();
        rocksPool.push(newRock);
    }
}

function addPathTree() {
    var options = [0, 1, 2];
    var lane = Math.floor(Math.random() * 3);
    addTree(true, lane);
    options.splice(lane, 1);
    if (Math.random() > 0.5) {
        lane = Math.floor(Math.random() * 2);
        addTree(true, options[lane]);
    }
}

function addWorldTrees() {
    var numTrees = 36;
    var gap = 6.28 / 36;
    for (var i = 0; i < numTrees; i++) {
        addTree(false, i * gap, true);
        addTree(false, i * gap, false);
    }
}
function addTree(inPath, row, isLeft) {
    var newTree;
    if (inPath) {
        if (treesPool.length == 0) return;
        newTree = treesPool.pop();
        newTree.visible = true;
        //console.log("add tree");
        treesInPath.push(newTree);
        sphericalHelper.set(
            worldRadius - 0.3,
            pathAngleValues[row],
            -rollingGroundSphere.rotation.x + 4
        );
    } else {
        newTree = Tree();
        var forestAreaAngle = 0; //[1.52,1.57,1.62];
        if (isLeft) {
            forestAreaAngle = 1.68 + Math.random() * 0.1;
        } else {
            forestAreaAngle = 1.46 - Math.random() * 0.1;
        }
        sphericalHelper.set(worldRadius - 0.3, forestAreaAngle, row);
    }
    newTree.position.setFromSpherical(sphericalHelper);
    var rollingGroundVector = rollingGroundSphere.position.clone().normalize();
    var treeVector = newTree.position.clone().normalize();
    newTree.quaternion.setFromUnitVectors(treeVector, rollingGroundVector);
    newTree.rotation.x += Math.random() * ((2 * Math.PI) / 10) + -Math.PI / 10;

    rollingGroundSphere.add(newTree);
}
function checkRockTreeCollision(rock, treesInPath) {
    for (let i = 0; i < treesInPath.length; i++) {
        if (rock.position.equals(treesInPath[i].position)) {
            // If the rock is in the same position as a tree, move the rock
            rock.position.y += 1; // Adjust this value as needed
            break;
        }
    }
}

function addPathRock() {
    var options = [0, 1, 2];
    var lane = Math.floor(Math.random() * 3);
    addRock(true, lane);
    options.splice(lane, 1);
    if (Math.random() > 0.5) {
        lane = Math.floor(Math.random() * 2);
        addRock(true, options[lane]);
    }
}

function addWorldRocks() {
    var numRocks = 15;
    var gap = 6.28 / numRocks;
    for (var i = 0; i < numRocks; i++) {
        addRock(false, i * gap, true);
        addRock(false, i * gap, false);
    }
}

function addRock(inPath, row, isLeft) {
    let newRock;
    if (inPath) {
        if (rocksPool.length == 0) return;
        newRock = rocksPool.pop();
        newRock.visible = true;
        rocksInPath.push(newRock);
        sphericalHelper.set(
            worldRadius - 0.3,
            pathAngleValues[row],
            -rollingGroundSphere.rotation.x + 4
        );
    } else {
        newRock = Rock(); // Assuming you have a Rock function similar to the Tree function
        let rockAreaAngle = 0;
        if (isLeft) {
            rockAreaAngle = 1.68 + Math.random() * 0.1;
        } else {
            rockAreaAngle = 1.46 - Math.random() * 0.1;
        }
        sphericalHelper.set(worldRadius - 0.3, rockAreaAngle, row);
    }
    newRock.position.setFromSpherical(sphericalHelper);
    const rollingGroundVector = rollingGroundSphere.position.clone().normalize();
    const rockVector = newRock.position.clone().normalize();
    newRock.quaternion.setFromUnitVectors(rockVector, rollingGroundVector);
    newRock.rotation.x += Math.random() * ((2 * Math.PI) / 10) + -Math.PI / 10;

    rollingGroundSphere.add(newRock);
    checkRockTreeCollision(newRock, treesInPath);
}
function animateSceneObjects(scene) {
    scene.children.forEach((object) => {
        object.rotation.x += 0.01;
        object.rotation.y += 0.01;
    });
}
function update() {
    //animate
    if (state == 1) {
        rollingGroundSphere.rotation.x += rollingSpeed;
        heroSphere.rotation.x -= heroRollingSpeed;
        if (heroSphere.position.y <= heroBaseY) {
            jumping = false;
            bounceValue = Math.random() * 0.04 + 0.005;
        }
        heroSphere.position.y += bounceValue;
        heroSphere.position.x = THREE.Math.lerp(
            heroSphere.position.x,
            currentLane,
            2 * clock.getDelta()
        ); //clock.getElapsedTime());
        bounceValue -= gravity;
        if (clock.getElapsedTime() > treeReleaseInterval) {
            clock.start();
            addPathTree();
            addPathRock();
            // if(!hasCollided){
            score += 2 * treeReleaseInterval;
            document.getElementById("high-score-value").textContent = score.toString();
            // }
        }
        doTreeLogic();
        doRockLogic();
        doExplosionLogic();
        render();
    }
    if (state == 0) {
        animateSceneObjects(scene);
        render();
    }
    requestAnimationFrame(update); //request next update
}

document.getElementById("resume-button").addEventListener("click", resumeGame);

function resumeGame() {
    document.getElementById("pause-screen").style.display = "none";
    state = 1;
    console.log(heroRollingSpeed, " ", rollingSpeed);
}

document.addEventListener("keydown", function (event) {
    if (event.key === "p" || event.key === "P") {
        pauseGame();
    } else if (event.key == "r") {
        resetGame();
    }
});

function pauseGame() {
    console.log(heroSphere);
    document.getElementById("pause-screen").style.display = "block";
    state = 2;
    console.log(heroRollingSpeed, " ", rollingSpeed);
}

// Reset the game
function resetGame() {
    console.log(heroSphere);
    initDefaultValues();
    resetVariables();
    resetScene();
}

// Reset game variables
function resetVariables() {
    bouncingValue = 0.1;
    hasCollided = false;
    jumping = false;
    score = 0;
    health = 10;
    currentLane = middleLane;
}

// Reset the scene
function resetScene() {
    // Reset hero position
    heroSphere.position.set(currentLane, heroBaseY, 4.8);
    // Reset tree pool and trees in path
    treesInPath.forEach(function (tree) {
        tree.visible = false;
        treesPool.push(tree);
    });
    treesInPath = [];
    // Reset rock pool and rocks in path
    rocksInPath.forEach(function (rock) {
        rock.visible = false;
        rocksPool.push(rock);
    });
    rocksInPath = [];
    // Reset explosion
    particles.visible = false;
    explosionPower = 1.06;
    particles.position.set(0, 2, 4.8);
    for (var i = 0; i < particleCount; i++) {
        var vertex = new THREE.Vector3();
        vertex.x = -0.2 + Math.random() * 0.4;
        vertex.y = -0.2 + Math.random() * 0.4;
        vertex.z = -0.2 + Math.random() * 0.4;
        particleGeometry.vertices[i] = vertex;
    }
    particleGeometry.verticesNeedUpdate = true;
    // Update UI elements
    document.getElementById("high-score-value").textContent = score.toString();
    document.getElementById("health-value").textContent = health.toString();
}

// Update health
function updateHealth(newHealth) {
    health = newHealth;
    document.getElementById("health-value").textContent = health;
}
function doTreeLogic() {
    //var oneTree;
    var treePos = new THREE.Vector3();
    var treesToRemove = [];
    console.log(treesInPath.length);
    treesInPath.forEach(function (element, index) {
        var oneTree = treesInPath[index];
        treePos.setFromMatrixPosition(oneTree.matrixWorld);
        if (treePos.z > 6 && oneTree.visible) {
            //gone out of our view zone
            treesToRemove.push(oneTree);
        } else {
            //check collision
            if (treePos.distanceTo(heroSphere.position) <= 0.6) {
                console.log(oneTree.isCollided);
                if (oneTree.isCollided == false) {
                    updateHealth(health - 1);
                }
                oneTree.isCollided = true;
                hasCollided = true;
                explode();
            }
        }
    });
    var fromWhere;
    treesToRemove.forEach(function (element, index) {
        var oneTree = treesToRemove[index];
        fromWhere = treesInPath.indexOf(oneTree);
        treesInPath.splice(fromWhere, 1);
        treesPool.push(oneTree);
        oneTree.isCollided = false;
        oneTree.visible = false;
        console.log("remove tree");
    });
}

function doRockLogic() {
    //var oneTree;
    var rockPos = new THREE.Vector3();
    var rocksToRemove = [];
    rocksInPath.forEach(function (element, index) {
        var oneRock = rocksInPath[index];
        rockPos.setFromMatrixPosition(oneRock.matrixWorld);
        if (rockPos.z > 6 && oneRock.visible) {
            //gone out of our view zone
            rocksToRemove.push(oneRock);
        } else {
            //check collision
            if (rockPos.distanceTo(heroSphere.position) <= 0.6) {
                if (oneRock.isCollided == false) {
                    updateHealth(health - 1);
                }
                oneRock.isCollided = true;
                hasCollided = true;
                explode();
            }
        }
    });
    var fromWhere;
    rocksToRemove.forEach(function (element, index) {
        var oneRock = rocksToRemove[index];
        fromWhere = rocksInPath.indexOf(oneRock);
        rocksInPath.splice(fromWhere, 1);
        rocksPool.push(oneRock);
        oneRock.isCollided = false;
        oneRock.visible = false;
        console.log("remove rock");
    });
}

function doExplosionLogic() {
    if (!particles.visible) return;
    for (var i = 0; i < particleCount; i++) {
        particleGeometry.vertices[i].multiplyScalar(explosionPower);
    }
    if (explosionPower > 1.005) {
        explosionPower -= 0.001;
    } else {
        particles.visible = false;
    }
    particleGeometry.verticesNeedUpdate = true;
}

function explode() {
    particles.position.y = 2;
    particles.position.z = 4.8;
    particles.position.x = heroSphere.position.x;
    for (var i = 0; i < particleCount; i++) {
        var vertex = new THREE.Vector3();
        vertex.x = -0.2 + Math.random() * 0.4;
        vertex.y = -0.2 + Math.random() * 0.4;
        vertex.z = -0.2 + Math.random() * 0.4;
        particleGeometry.vertices[i] = vertex;
    }
    explosionPower = 1.07;
    particles.visible = true;
}

function render() {
    renderer.render(scene, camera); //draw
}
function gameOver() {
    //cancelAnimationFrame( globalRenderID );
    //window.clearInterval( powerupSpawnIntervalID );
}
function onWindowResize() {
    //resize & align
    sceneHeight = window.innerHeight;
    sceneWidth = window.innerWidth;
    renderer.setSize(sceneWidth, sceneHeight);
    camera.aspect = sceneWidth / sceneHeight;
    camera.updateProjectionMatrix();
}
