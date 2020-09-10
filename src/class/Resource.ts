import { DropItem } from './DropItem';

type Props = {
  scene: Phaser.Scene;
  resource: Phaser.Types.Tilemaps.TiledObject;
};

export class Resource extends Phaser.Physics.Matter.Sprite {
  // オブジェクトが持つ効果音
  private sound: Phaser.Sound.BaseSound;
  // HP
  private health: number;
  // ドロップアイテム
  public drops: string[];
  static preload(scene) {
    scene.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json');
    scene.load.audio('tree', 'assets/audio/tree.mp3');
    scene.load.audio('rock', 'assets/audio/rock.mp3');
    scene.load.audio('bush', 'assets/audio/bush.mp3');
  }

  constructor(data: Props) {
    const { scene, resource } = data;
    super(scene.matter.world, resource.x, resource.y, 'resources', resource.type);
    this.name = resource.type;
    this.health = 5;
    this.drops = JSON.parse(resource.properties.find((p) => p.name === 'drops')?.value ?? '[]');
    this.sound = this.scene.sound.add(this.name);
    // オブジェクトを画面に表示する
    this.scene.add.existing(this);

    // オブジェクトのColliderを丸くする
    const physics = new Phaser.Physics.Matter.MatterPhysics(this.scene);
    const circleCollider = physics.bodies.circle(resource.x, resource.y, 12, {
      isSensor: false,
      label: 'collider',
    });
    this.setExistingBody(circleCollider);

    this.name = resource.type;
    // オブジェクトのColliderの位置を調整する
    const yOrigin: number = resource.properties.find((p) => p.name === 'yOrigin').value ?? 0.5;
    this.x += this.width / 2;
    this.y -= this.height / 2;
    this.y = this.y + this.height * (yOrigin - 0.5);

    // オブジェクトの位置を固定する
    this.setStatic(true);
    // オブジェクトを描画する座標を調整する
    this.setOrigin(0.5, yOrigin);
  }

  get dead() {
    return this.health <= 0;
  }

  hit() {
    if (this.sound) this.sound.play();
    this.health -= 1;
    console.log('health: ', this.health);
    if (this.dead) {
      this.drops.map((drop) => new DropItem({ scene: this.scene, x: this.x, y: this.y, frame: drop }));
    }
  }
}
