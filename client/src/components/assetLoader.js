export default class AssetLoader {
  static async loadAssets(scene) {
    const response = await fetch('src/assets/assets.json');
    const assets = await response.json();

    assets.images?.forEach(img => {
      scene.load.image(img.key, `src/assets/${img.path}`);
    });

    assets.audio?.forEach(sound => {
      scene.load.audio(sound.key, `src/assets/${sound.path}`);
    });

    return new Promise(resolve => scene.load.once('complete', resolve));
  }

  static async getObjects() {
    const response = await fetch('src/assets/assets.json');
    const assets = await response.json();
    return assets.objects || [];
  }
}
