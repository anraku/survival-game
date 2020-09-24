import MatterEntity from './MatterEntity';

type Props = {
  scene: Phaser.Scene;
  enemy: Phaser.Types.Tilemaps.TiledObject;
};

export class Enemy extends MatterEntity {
  static preload(scene: Phaser.Scene) {
    scene.load.atlas('enemies', 'assets/images/enemies.png', 'assets/images/enemies_atlas.json');
    scene.load.animation('enemies_anim', 'assets/images/enemies_anim.json');
    scene.load.audio('bear', 'assets/audio/bear.mp3');
    scene.load.audio('ent', 'assets/audio/ent.mp3');
    scene.load.audio('wolf', 'assets/audio/wolf.mp3');
  }

  constructor(data: Props) {
    const health = data.enemy.properties.find((p) => p.name === 'health')?.value;
    super({
      scene: data.scene,
      x: data.enemy.x,
      y: data.enemy.y,
      texture: 'enemies',
      frame: 'bear_idle_1',
      name: data.enemy.name,
      health,
    });
    this.drops = JSON.parse(data.enemy.properties.find((p) => p.name === 'drops')?.value ?? []);
  }

  update() {
    console.log('enemy update');
  }
}
