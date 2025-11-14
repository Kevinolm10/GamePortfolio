import Player from '../../components/player.js';

export default function debug(scene, layers = {}, enabled = false, options = {}) {
  if (!enabled || !scene) return;

 // Extract layers
  const {
    outsideWallsLayer,
    wallsLayer,
    interiorObjectsLayer,
    objectsTopLayer,
    collisionLayer
  } = layers;

    // Set collision on all tiles if specified in options
  if (options.setAllCollisions) {
    [outsideWallsLayer, wallsLayer, interiorObjectsLayer, objectsTopLayer, collisionLayer].forEach(l => {
      if (l && l.setCollisionByExclusion) l.setCollisionByExclusion([0]);
    });
  }

  // Create debug graphics
  const debugGraphics = scene.add.graphics().setAlpha(0.75);

    // Render debug info for each layer
  const renderIf = (layer, color = new Phaser.Display.Color(243, 134, 48, 180)) => {
    if (!layer) return;
    layer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: color,
      faceColor: new Phaser.Display.Color(40, 39, 37, 200)
    });
  };

  renderIf(outsideWallsLayer);
  renderIf(wallsLayer);
  renderIf(interiorObjectsLayer);
  renderIf(objectsTopLayer, new Phaser.Display.Color(100, 100, 255, 180));
  renderIf(collisionLayer, new Phaser.Display.Color(200, 50, 50, 200));

    // Debug-only tile info logging
  const listIndexes = layer => {
    if (!layer) return [];
    const s = new Set();
    layer.forEachTile(t => { if (t && Number.isFinite(t.index)) s.add(t.index); });
    return [...s].sort((a,b)=>a-b);
  };

  const countColliding = layer => {
    if (!layer) return 0;
    let c = 0;
    layer.forEachTile(t => { if (t && t.collides) c++; });
    return c;
  };

  // Console output (only when enabled)
  console.log('DEBUG: outsideWallsLayer indexes:', listIndexes(outsideWallsLayer));
  console.log('DEBUG: wallsLayer indexes:', listIndexes(wallsLayer));
  console.log('DEBUG: interiorObjectsLayer indexes:', listIndexes(interiorObjectsLayer));
  console.log('DEBUG: collisionLayer indexes:', listIndexes(collisionLayer));

  console.log('DEBUG: outsideWallsLayer colliding count:', countColliding(outsideWallsLayer));
  console.log('DEBUG: wallsLayer colliding count:', countColliding(wallsLayer));
  console.log('DEBUG: objectsTopLayer colliding count:', countColliding(objectsTopLayer));
  console.log('DEBUG: collisionLayer colliding count:', countColliding(collisionLayer));

    // Player collision logging
  const player = scene.player || options.player;
  const map = options.map;

  if (!player) {
    console.warn('DEBUG: player not present; debug collision logging skipped');
    return;
  }

  const mkLog = (layerName, layer) => () => {
    if (!layer) {
      console.log(`DEBUG: collision with ${layerName} (missing) at`, player.x, player.y);
      return;
    }
    if (map && typeof map.getTileAtWorldXY === 'function') {
      const tile = map.getTileAtWorldXY(player.x, player.y, true, scene.cameras.main, layer);
      console.log(`DEBUG: PLAYER COLLIDED with ${layerName} at`, player.x, player.y, tile ? `tile:${tile.x},${tile.y},index:${tile.index}` : '');
    } else {
      console.log(`DEBUG: PLAYER COLLIDED with ${layerName} at`, player.x, player.y);
    }
  };

  if (collisionLayer) scene.physics.add.collider(player, collisionLayer, mkLog('collisionLayer', collisionLayer));
  if (outsideWallsLayer) scene.physics.add.collider(player, outsideWallsLayer, mkLog('outsideWallsLayer', outsideWallsLayer));
  if (wallsLayer) scene.physics.add.collider(player, wallsLayer, mkLog('wallsLayer', wallsLayer));
  if (interiorObjectsLayer) scene.physics.add.collider(player, interiorObjectsLayer, mkLog('interiorObjectsLayer', interiorObjectsLayer));
  if (objectsTopLayer) scene.physics.add.collider(player, objectsTopLayer, mkLog('objectsTopLayer', objectsTopLayer));

}