export default function collisonZone(scene, layers = {}, player, options = {}) {
  if (!scene) return;

  // Extract collision layer from layers
  const { collisionLayer } = layers;

  if (!collisionLayer) {
    console.warn('collisonZone: no collisionLayer provided.');
    return { applied: false };
  }

  // Set tiles with property 'collides' to be collidable
  collisionLayer.setCollisionByProperty({ collides: true });

  let collidingCount = 0;
  collisionLayer.forEachTile(t => { if (t && t.collides) collidingCount++; });
  if (collidingCount === 0) {
    collisionLayer.setCollision([1587]);
    collidingCount = 0;
    collisionLayer.forEachTile(t => { if (t && t.collides) collidingCount++; });
  }

  console.log(`collisonZone: collisionLayer colliding tiles: ${collidingCount}`);

  // Optionally hide the collision layer
  if (options.hideLayer !== false) collisionLayer.setVisible(false);

  // Ensure player is provided
  if (!player) {
    console.warn('collisonZone: player is not provided. Call collisonZone after creating the player.');
    return { applied: false, collidingCount };
  }

  // Add collider between player and collision layer
  scene.physics.add.collider(player, collisionLayer);

  return { applied: true, collidingCount };
}