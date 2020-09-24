import MatterEntity from './MatterEntity';

type Props = {
  scene: Phaser.Scene;
  resource: Phaser.Types.Tilemaps.TiledObject;
};

export class Resource extends MatterEntity {
  static preload(scene: Phaser.Scene) {
    scene.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json');
    scene.load.audio('tree', 'assets/audio/tree.mp3');
    scene.load.audio('rock', 'assets/audio/rock.mp3');
    scene.load.audio('bush', 'assets/audio/bush.mp3');
    scene.load.audio('pickup', 'assets/audio/pickup.mp3');
  }

  constructor(data: Props) {
    super({
      scene: data.scene,
      x: data.resource.x,
      y: data.resource.y,
      texture: 'resources',
      frame: data.resource.type,
      health: 5,
      name: data.resource.type,
    });
    this.drops = JSON.parse(data.resource.properties.find((p) => p.name === 'drops')?.value ?? '[]');
    this.depth = JSON.parse(data.resource.properties.find((p) => p.name === 'depth')?.value ?? 1);

    // オブジェクトのColliderを丸くする
    const physics = new Phaser.Physics.Matter.MatterPhysics(this.scene);
    const circleCollider = physics.bodies.circle(data.resource.x, data.resource.y, 12, {
      isSensor: false,
      label: 'collider',
    });
    this.setExistingBody(circleCollider);

    this.name = data.resource.type;
    // オブジェクトのColliderの位置を調整する
    const yOrigin: number = data.resource.properties.find((p) => p.name === 'yOrigin').value ?? 0.5;
    this.y = this.y + this.height * (yOrigin - 0.5);

    // オブジェクトの位置を固定する
    this.setStatic(true);
    // オブジェクトを描画する座標を調整する
    this.setOrigin(0.5, yOrigin);
  }
}
