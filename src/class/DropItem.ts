type Props = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  frame: string;
};

export class DropItem extends Phaser.Physics.Matter.Sprite {
  private sound: Phaser.Sound.BaseSound;

  constructor(data: Props) {
    super(data.scene.matter.world, data.x, data.y, 'items', data.frame);
    const { scene, x, y, frame } = data;
    this.scene.add.existing(this);
    const physics = new Phaser.Physics.Matter.MatterPhysics(this.scene);
    const circleCollier = physics.bodies.circle(this.x, this.y, 10, { isSensor: false, label: 'collider' });
    this.setExistingBody(circleCollier);
    this.setFrictionAir(1);
    this.setScale(0.5);

    this.sound = this.scene.sound.add('pickup');
  }

  pickup = () => {
    this.destroy();
    this.sound.play();
  };
}
