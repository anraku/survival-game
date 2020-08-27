export class Player extends Phaser.Physics.Matter.Sprite {
  public inputKeys;
  constructor(data) {
    let { scene, x, y, texture, frame } = data;
    super(scene.matter.world, x, y, texture, frame);
    this.scene.add.existing(this);
  }

  get velocity() {
    return this.body.velocity;
  }

  static preload(scene) {
    scene.load.atlas(
      'female',
      'assets/img/female.png',
      'assets/img/female_atlas.json',
    );
    scene.load.animation('female', 'assets/img/female_anim.json');
  }

  update() {
    const speed = 2.5;
    let playerVelocity = new Phaser.Math.Vector2();
    if (this.inputKeys.left.isDown) {
      playerVelocity.x = -1;
    }
    if (this.inputKeys.right.isDown) {
      playerVelocity.x = 1;
    }
    if (this.inputKeys.up.isDown) {
      playerVelocity.y = -1;
    }
    if (this.inputKeys.down.isDown) {
      playerVelocity.y = 1;
    }
    playerVelocity.normalize();
    playerVelocity.scale(speed);
    this.setVelocity(playerVelocity.x, playerVelocity.y);

    // play animation
    if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
      this.anims.play('female_walk', true);
    } else {
      this.anims.play('female_idle', true);
    }
  }
}