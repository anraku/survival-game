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
    const { scene, x, y, texture, frame } = data;
    // プレイヤーをシーンに追加
    this.scene.add.existing(this);

    // 武器を追加
    this.spriteWeapon = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'items', 162);
    this.spriteWeapon.setScale(0.8);
    this.spriteWeapon.setOrigin(0.25, 0.75);
    this.scene.add.existing(this.spriteWeapon);

    // 当たり判定のある円を登録
    const physics = new Phaser.Physics.Matter.MatterPhysics(scene);
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
    this.createMiningCollisions(this);
    this.createPickupCollision(this);

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

  private weaponRotate() {
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
  }

  private whackStuff() {
    this.touching = this.touching.filter((obj) => obj.hit && !obj.dead);
    this.touching.forEach((obj) => {
      if (!obj.active) return;
      obj.hit();
      if (obj.dead) {
        obj.destroy();
      }
    });
  }

  private createMiningCollisions(player: Player) {
    // 衝突するインスタンスを知った上でロジックを組んでいるので、他のリソースが絡んだりした場合は修正が大変になる
    //FIXME: 衝突したのがResourceのインスタンス出なかった場合、他にResourceと接していたとしてもtouchingに追加されない
    this.world.on(
      'collisionstart',
      (event, bodyA, bodyB) => {
        const [playerCollider, resource] =
          player === bodyB.gameObject ? [bodyB, bodyA.gameObject] : [bodyA, bodyB.gameObject];
        if (!(resource instanceof Resource)) return;
        if (!playerCollider.isSensor) return;
        this.touching.push(resource);
      },
      this.scene,
    );

    this.world.on(
      'collisionend',
      (event, bodyA, bodyB) => {
        const [_, resource] = player === bodyB.gameObject ? [bodyB, bodyA.gameObject] : [bodyA, bodyB.gameObject];
        this.touching = this.touching.filter((obj) => obj != resource);
        console.log(this.touching.length);
      },
      this.scene,
    );
  }

  private createPickupCollision = (player: Player) => {
    this.world.on(
      'collisionstart',
      (event, bodyA, bodyB) => {
        const item = player === bodyB.gameObject ? bodyA.gameObject : bodyB.gameObject;
        if (!(item instanceof DropItem)) return;
        console.log('item', item);
        if (item.pickup) {
          item.pickup();
        }
      },
      this.scene,
    );
  };
}
