import updateInteractionRay from '../../components/player';

export default function interactWithObjects(player, tilesetA, tilesetB, options = {}) {
  tilesetA.forEach(tileset => {
  const rect = tileset.body ? tileset.body.getBounds() : tileset.getBounds();
  if (Phaser.Geom.Intersects.LineToRectangle(ray, rect)) {
    onHit(tileset);
  }
});
}

function onHit(tileset) {
  if (!tileset) return;
  console.log('Interaction hit with object:', tileset);
}