import { Resource } from './Resource';
import { DropItem } from './DropItem';

export class Player extends Phaser.Physics.Matter.Sprite {
  // キーイベント
  public inputKeys;

  // 武器
  private spriteWeapon: Phaser.GameObjects.Sprite;
  private weaponRotation: number;

  // 触れているオブジェクト
  private touching: Resource[];

  constructor(data) {
    // プレイヤーを初期化
    super(data.scene.matter.world, data.x, data.y, data.texture, data.frame);
    // プレイヤーをシーンに追加
    this.scene.add.existing(this);

    // 武器を追加
    this.spriteWeapon = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'items', 162);
    this.spriteWeapon.setScale(0.8);
    this.spriteWeapon.setOrigin(0.25, 0.75);
    this.scene.add.existing(this.spriteWeapon);

    // 当たり判定のある円を登録
    const physics = new Phaser.Physics.Matter.MatterPhysics(data.scene);
    const playerCollider = physics.bodies.circle(this.x, this.y, 12, {
      isSensor: false,
      label: 'playerCollider',
    });
    // 当たり判定のない円を登録
    const playerSensor = physics.bodies.circle(this.x, this.y, 24, {
      isSensor: true,
      label: 'playerSensor',
    });
    const compoundBody = physics.body.create({
      parts: [playerCollider, playerSensor],
      frictionAir: 0.35,
    });

    // 当たり判定やセンサーをプレイヤーに登録
    this.setExistingBody(compoundBody);
    this.setFixedRotation();
    this.touching = [];
    this.createMiningCollisions(playerSensor);
    this.createPickupCollision(playerCollider);

    this.scene.input.on('pointermove', (pointer) => this.setFlipX(pointer.worldX < this.x));
  }

  get velocity() {
    return this.body.velocity;
  }

  static preload(scene: Phaser.Scene) {
    scene.load.atlas('female', 'assets/images/female.png', 'assets/images/female_atlas.json');
    scene.load.animation('female', 'assets/images/female_anim.json');
    scene.load.spritesheet('items', 'assets/images/items.png', { frameWidth: 32, frameHeight: 32 });
  }

  update() {
    const speed = 2.5;
    const playerVelocity = new Phaser.Math.Vector2();
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
    // 長さが全方向に1になるようにする
    playerVelocity.normalize();
    // ベクトルの長さをspeed
    playerVelocity.scale(speed);

    this.setVelocity(playerVelocity.x, playerVelocity.y);

    // play animation
    if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
      this.anims.play('female_walk', true);
    } else {
      this.anims.play('female_idle', true);
    }
    this.spriteWeapon.setPosition(this.x, this.y);
    this.weaponRotate();
  }

  weaponRotate = () => {
    const pointer = this.scene.input.activePointer;
    if (pointer.isDown) {
      this.weaponRotation += 6;
    } else {
      this.weaponRotation = 0;
    }
    if (this.weaponRotation > 100) {
      this.whackStuff();
      this.weaponRotation = 0;
    }

    if (this.flipX) {
      this.spriteWeapon.setAngle(-this.weaponRotation - 90);
    } else {
      this.spriteWeapon.setAngle(this.weaponRotation);
    }
  };

  whackStuff = () => {
    this.touching = this.touching.filter((obj) => obj.hit && !obj.dead);
    this.touching.forEach((obj) => {
      if (!obj.active) return;
      obj.hit();
      if (obj.dead) {
        obj.destroy();
      }
    });
  };

  createPickupCollision = (playerCollier: MatterJS.BodyType) => {
    (this as any).scene.matterColision.addOnCollideStart({
      objectA: [playerCollier],
      callback: (other) => {
        if (other.gameObjectB?.pickup) other.gameObjectB.pickup();
      },
      context: this.scene,
    });

    (this as any).scene.matterColision.addOnCollideActive({
      objectA: [playerCollier],
      callback: (other) => {
        if (other.gameObjectB?.pickup) other.gameObjectB.pickup();
      },
      context: this.scene,
    });
  };

  createMiningCollisions = (playerSensor: MatterJS.BodyType) => {
    (this as any).scene.matterColision.addOnCollideStart({
      objectA: [playerSensor],
      callback: (other) => {
        console.log(other);
        if (other.bodyB.isSensor) return;
        if (!(other.gameObjectB instanceof Resource)) return;
        this.touching.push(other.gameObjectB);
        console.log(this.touching.length, other.gameObjectB.name);
      },
      context: this.scene,
    });

    (this as any).scene.matterColision.addOnCollideEnd({
      objectA: [playerSensor],
      callback: (other) => {
        this.touching = this.touching.filter((gameObject) => gameObject != other.gameObjectB);
        console.log(this.touching.length);
      },
      context: this.scene,
    });
  };
}
