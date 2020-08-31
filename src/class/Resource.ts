type Props = {
  scene: Phaser.Scene;
  resource: Phaser.Types.Tilemaps.TiledObject;
};

export class Resource extends Phaser.Physics.Matter.Sprite {
  static preload(scene) {
    scene.load.atlas('resources', 'assets/img/resources.png', 'assets/img/resources_atlas.json');
  }

  constructor(data: Props) {
    const { scene, resource } = data;
    super(scene.matter.world, resource.x, resource.y, 'resources', resource.type);

    // オブジェクトのColliderを丸くする
    const physics = new Phaser.Physics.Matter.MatterPhysics(this.scene);
    const circleCollider = physics.bodies.circle(resource.x, resource.y, 12, {
      isSensor: false,
      label: 'collider',
    });
    this.setExistingBody(circleCollider);

    // オブジェクトのColliderの位置を調整する
    const yOrigin: number = resource.properties.find((p) => p.name === 'yOrigin').value ?? 0.5;
    this.x += this.width / 2;
    this.y -= this.height / 2;
    this.y = this.y + this.height * (yOrigin - 0.5);
    // オブジェクトの位置を固定する
    this.setStatic(true);
    // オブジェクトを描画する座標を調整する
    this.setOrigin(0.5, yOrigin);
    // オブジェクトを画面に表示する
    this.scene.add.existing(this);
  }
}
