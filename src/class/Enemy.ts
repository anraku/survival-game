import MatterEntity from './MatterEntity';
import { Player } from './Player';

type Props = {
  scene: Phaser.Scene;
  enemy: Phaser.Types.Tilemaps.TiledObject;
};

export class Enemy extends MatterEntity {
  private attacking: Player;
  private attacktimer: NodeJS.Timeout;

  static preload(scene: Phaser.Scene) {
    scene.load.atlas('enemies', 'assets/images/enemies.png', 'assets/images/enemies_atlas.json');
    scene.load.animation('enemies_anim', 'assets/images/enemies_anim.json');
    scene.load.audio('bear', 'assets/audio/bear.mp3');
    scene.load.audio('ent', 'assets/audio/ent.mp3');
    scene.load.audio('wolf', 'assets/audio/wolf.mp3');
  }

  constructor(data: Props) {
    super({
      scene: data.scene,
      x: data.enemy.x,
      y: data.enemy.y,
      texture: 'enemies',
      frame: `${data.enemy.name}_idle_1`,
      name: data.enemy.name,
      health: 0,
    });
    const health = data.enemy.properties.find((p) => p.name === 'health')?.value;
    this.health = health;
    this.drops = JSON.parse(data.enemy.properties.find((p) => p.name === 'drops')?.value ?? []);

    // 当たり判定のある円を登録
    const physics = new Phaser.Physics.Matter.MatterPhysics(data.scene);
    const enemyCollider = physics.bodies.circle(this.x, this.y, 12, {
      isSensor: false,
      label: 'enemyCollider',
    });
    // 当たり判定のない円を登録
    const enemySensor = physics.bodies.circle(this.x, this.y, 60, {
      isSensor: true,
      label: 'enemySensor',
    });
    const compoundBody = physics.body.create({
      parts: [enemyCollider, enemySensor],
      frictionAir: 0.35,
    });

    // 当たり判定やセンサーをプレイヤーに登録
    this.setExistingBody(compoundBody);
    this.setFixedRotation();
    (this.scene as any).matterColision.addOnCollideStart({
      objectA: [enemySensor],
      callback: (other) => {
        if (other.gameObjectB && other.gameObjectB.name === 'player') this.attacking = other.gameObjectB;
      },
      context: this.scene,
    });
    (this.scene as any).matterColision.addOnCollideEnd({
      objectA: [enemySensor],
      callback: (other) => {
        if (other.gameObjectB && other.gameObjectB.name === 'player') this.attacking = null;
      },
      context: this.scene,
    });
  }

  attack = (target: Player) => {
    if (target.dead || this.dead) {
      clearInterval(this.attacktimer);
      return;
    }
    target.hit();
  };

  update() {
    if (this.dead) return;
    if (this.attacking) {
      const position = this.attacking.position;
      const direction = position.subtract(this.position);
      if (direction.length() > 24) {
        const v = direction.normalize();
        this.setVelocityX(direction.x);
        this.setVelocityY(direction.y);
        if (this.attacktimer) {
          clearInterval(this.attacktimer);
          this.attacktimer = null;
        }
      } else {
        if (this.attacktimer == null) {
          this.attacktimer = setInterval(this.attack, 500, this.attacking);
        }
      }
    }
    this.setFlipX(this.velocity.x < 0);
    // play animation
    if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
      this.anims.play(`${this.name}_walk`, true);
    } else {
      this.anims.play(`${this.name}_idle`, true);
    }
  }
}
