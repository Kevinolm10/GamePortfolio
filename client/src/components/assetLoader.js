export default class AssetLoader {
  static loadAssets(scene) {
    const basePath = '/assets/';

    scene.load.json('assets', basePath + 'assets.json');

    scene.load.once('complete', () => {
      const assets = scene.cache.json.get('assets');
      if (!assets) {
        console.error('No assets.json found or invalid JSON');
        return;
      }

      // Directly load all assets synchronously
      if (assets.spritesheets) {
        assets.spritesheets.forEach(sheet => {
          const url = sheet.path.startsWith('http') ? sheet.path : basePath + sheet.path;
          scene.load.spritesheet(sheet.key, url, {
            frameWidth: sheet.frameWidth,
            frameHeight: sheet.frameHeight
          });
        });
      }

      if (assets.objects) {
        assets.objects.forEach(obj => {
          const url = obj.path.startsWith('http') ? obj.path : basePath + obj.path;
          scene.load.spritesheet(obj.key, url, {
            frameWidth: obj.frameWidth,
            frameHeight: obj.frameHeight
          });
        });
      }

      if (assets.images) {
        assets.images.forEach(img => {
          const url = img.path.startsWith('http') ? img.path : basePath + img.path;
          scene.load.image(img.key, url);
        });
      }

      if (assets.audio) {
        assets.audio.forEach(sound => {
          const url = sound.path.startsWith('http') ? sound.path : basePath + sound.path;
          scene.load.audio(sound.key, url);
        });
      }

      // Start the second load
      scene.load.start();
    });

    scene.load.start(); // Load assets.json first
  }
}
