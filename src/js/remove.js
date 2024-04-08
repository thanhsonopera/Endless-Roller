function createTree(){
	var sides=8;
	var tiers=6;
	var scalarMultiplier=(Math.random()*(0.25-0.1))+0.05;
	var midPointVector= new THREE.Vector3();
	var vertexVector= new THREE.Vector3();
	var treeGeometry = new THREE.ConeGeometry( 0.5, 1, sides, tiers);
	var treeMaterial = new THREE.MeshStandardMaterial( { color: 0x33ff33,shading:THREE.FlatShading  } );
	var offset;
	midPointVector=treeGeometry.vertices[0].clone();
	var currentTier=0;
	var vertexIndex;
	blowUpTree(treeGeometry.vertices,sides,0,scalarMultiplier);
	tightenTree(treeGeometry.vertices,sides,1);
	blowUpTree(treeGeometry.vertices,sides,2,scalarMultiplier*1.1,true);
	tightenTree(treeGeometry.vertices,sides,3);
	blowUpTree(treeGeometry.vertices,sides,4,scalarMultiplier*1.2);
	tightenTree(treeGeometry.vertices,sides,5);
	var treeTop = new THREE.Mesh( treeGeometry, treeMaterial );
	treeTop.castShadow=true;
	treeTop.receiveShadow=false;
	treeTop.position.y=0.9;
	treeTop.rotation.y=(Math.random()*(Math.PI));
	var treeTrunkGeometry = new THREE.CylinderGeometry( 0.1, 0.1,0.5);
	var trunkMaterial = new THREE.MeshStandardMaterial( { color: 0x886633,shading:THREE.FlatShading  } );
	var treeTrunk = new THREE.Mesh( treeTrunkGeometry, trunkMaterial );
	treeTrunk.position.y=0.25;
	var tree =new THREE.Object3D();
	tree.add(treeTrunk);
	tree.add(treeTop);
	return tree;
}
function blowUpTree(vertices,sides,currentTier,scalarMultiplier,odd){
	var vertexIndex;
	var vertexVector= new THREE.Vector3();
	var midPointVector=vertices[0].clone();
	var offset;
	for(var i=0;i<sides;i++){
		vertexIndex=(currentTier*sides)+1;
		vertexVector=vertices[i+vertexIndex].clone();
		midPointVector.y=vertexVector.y;
		offset=vertexVector.sub(midPointVector);
		if(odd){
			if(i%2===0){
				offset.normalize().multiplyScalar(scalarMultiplier/6);
				vertices[i+vertexIndex].add(offset);
			}else{
				offset.normalize().multiplyScalar(scalarMultiplier);
				vertices[i+vertexIndex].add(offset);
				vertices[i+vertexIndex].y=vertices[i+vertexIndex+sides].y+0.05;
			}
		}else{
			if(i%2!==0){
				offset.normalize().multiplyScalar(scalarMultiplier/6);
				vertices[i+vertexIndex].add(offset);
			}else{
				offset.normalize().multiplyScalar(scalarMultiplier);
				vertices[i+vertexIndex].add(offset);
				vertices[i+vertexIndex].y=vertices[i+vertexIndex+sides].y+0.05;
			}
		}
	}
}
function tightenTree(vertices,sides,currentTier){
	var vertexIndex;
	var vertexVector= new THREE.Vector3();
	var midPointVector=vertices[0].clone();
	var offset;
	for(var i=0;i<sides;i++){
		vertexIndex=(currentTier*sides)+1;
		vertexVector=vertices[i+vertexIndex].clone();
		midPointVector.y=vertexVector.y;
		offset=vertexVector.sub(midPointVector);
		offset.normalize().multiplyScalar(0.06);
		vertices[i+vertexIndex].sub(offset);
	}
}
function addWorld(){

	var sides=40;
	var tiers=40;
	var sphereGeometry = new THREE.SphereGeometry( worldRadius, sides,tiers);
	var sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xfffafa ,shading:THREE.FlatShading} )
	
	var vertexIndex;
	var vertexVector= new THREE.Vector3();
	var nextVertexVector= new THREE.Vector3();
	var firstVertexVector= new THREE.Vector3();
	var offset= new THREE.Vector3();
	var currentTier=1;
	var lerpValue=0.5;
	var heightValue;
	var maxHeight=0.07;
	for(var j=1;j<tiers-2;j++){
		currentTier=j;
		for(var i=0;i<sides;i++){
			vertexIndex=(currentTier*sides)+1;
			vertexVector=sphereGeometry.vertices[i+vertexIndex].clone();
			if(j%2!==0){
				if(i==0){
					firstVertexVector=vertexVector.clone();
				}
				nextVertexVector=sphereGeometry.vertices[i+vertexIndex+1].clone();
				if(i==sides-1){
					nextVertexVector=firstVertexVector;
				}
				lerpValue=(Math.random()*(0.75-0.25))+0.25;
				vertexVector.lerp(nextVertexVector,lerpValue);
			}
			heightValue=(Math.random()*maxHeight)-(maxHeight/2);
			offset=vertexVector.clone().normalize().multiplyScalar(heightValue);
			sphereGeometry.vertices[i+vertexIndex]=(vertexVector.add(offset));
		}
	}
	rollingGroundSphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
	rollingGroundSphere.receiveShadow = true;
	rollingGroundSphere.castShadow=false;
	rollingGroundSphere.rotation.z=-Math.PI/2;
	
	scene.add( rollingGroundSphere );
	rollingGroundSphere.position.y=-24;
	rollingGroundSphere.position.z=2;
	addWorldTrees();
}

function addExplosion(){
	particleGeometry = new THREE.Geometry();
	for (var i = 0; i < particleCount; i ++ ) {
		var vertex = new THREE.Vector3();
		particleGeometry.vertices.push( vertex );
	}
	var pMaterial = new THREE.ParticleBasicMaterial({
	  color: 0xfffafa,
	  size: 0.2
	});
	particles = new THREE.Points( particleGeometry, pMaterial );
	scene.add( particles );
	particles.visible=false;
}