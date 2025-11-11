export default function collisonZone(scene, layers = {}, player, options = {}) {
  if (!scene) return;

  // destructure layers
  const {
    outsideWallsLayer,
    wallsLayer,
    interiorObjectsLayer,
    objectsTopLayer
  } = layers;

  // set collision on layers
  if (wallsLayer) {
    wallsLayer.setCollision([1,16,18,19,36,48,145,149,162,65,46]);
  }
  if (interiorObjectsLayer) {
    interiorObjectsLayer.setCollision([323,324,325,326,339,340,341,342,355,356,357,358,387,388,403,404,551,552,553,567,568,569,880,881,896,897,1072,1088,1104,1108,1109,1124,1125,1222,1227,1228,1238,1243,1244,1259,1260,1350]);
  }
  if (objectsTopLayer) {
    objectsTopLayer.setCollision([1112,1113,1128,1129,1231,1247,995]);
  }
  if (outsideWallsLayer) {
    outsideWallsLayer.setCollision([6,19,70,72,86,87]);
  }

  // add colliders between player and layers
  if (!player) {
    console.warn('collisonZone: player is not provided. Call collisonZone after creating the player.');
    return;
  }

  if (outsideWallsLayer) scene.physics.add.collider(player, outsideWallsLayer);
  if (wallsLayer) scene.physics.add.collider(player, wallsLayer);
  if (interiorObjectsLayer) scene.physics.add.collider(player, interiorObjectsLayer);
  if (objectsTopLayer) scene.physics.add.collider(player, objectsTopLayer);

  // return applied status
  return { applied: true };
}