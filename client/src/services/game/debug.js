export default function debug(scene, layers = {}, enabled = false, options = {}) {
  if (!enabled || !scene) return;

   // Destructure layers for easier access
  const {
    outsideWallsLayer,
    wallsLayer,
    interiorObjectsLayer,
    objectsTopLayer
  } = layers;

    // Set all tiles to collide for easier debugging
  if (options.setAllCollisions) {
    [outsideWallsLayer, wallsLayer, interiorObjectsLayer, objectsTopLayer].forEach(l => {
      if (l && l.setCollisionByExclusion) l.setCollisionByExclusion([0]);
    });
  }

  // Create debug graphics
  const debugGraphics = scene.add.graphics().setAlpha(0.75);

  // Render debug information for each layer
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

  // Log debug information to console
  const listIndexes = layer => {
    if (!layer) return [];
    const s = new Set();
    layer.forEachTile(t => { if (t && Number.isFinite(t.index)) s.add(t.index); });
    return [...s].sort((a,b)=>a-b);
  };

  console.log('outsideWallsLayer indexes:', listIndexes(outsideWallsLayer));
  console.log('wallsLayer indexes:', listIndexes(wallsLayer));
  console.log('interiorObjectsLayer indexes:', listIndexes(interiorObjectsLayer));

  const countColliding = layer => {
    if (!layer) return 0;
    let c = 0;
    layer.forEachTile(t => { if (t && t.collides) c++; });
    return c;
  };

  console.log('outsideWallsLayer colliding count:', countColliding(outsideWallsLayer));
  console.log('wallsLayer colliding count:', countColliding(wallsLayer));
  console.log('objectsTopLayer colliding count:', countColliding(objectsTopLayer));
}