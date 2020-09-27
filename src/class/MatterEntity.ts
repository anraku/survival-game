import { DropItem } from './DropItem';

type Props = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
  frame: string;
  name: string;
  health: number;
  drops?: string[];
  depth?: number;
};

export default class MatterEntity extends Phaser.Physics.Matter.Sprite {
  protected health: number;
  protected drops: string[];
  protected sound: Phaser.Sound.BaseSound;

  private _position: Phaser.Math.Vector2;

  constructor(data: Props) {
    super(data.scene.matter.world, data.x, data.y, data.texture, data.frame);
    this.name = data.name;
    this.x += this.width / 2;
    this.y -= this.height / 2;
    this.health = data.health;
    this.drops = data.drops;
    this._position = new Phaser.Math.Vector2(this.x, this.y);
    if (this.name) this.sound = this.scene.sound.add(this.name);
    // オブジェクトの位置を固定する
    this.setStatic(true);
    this.scene.add.existing(this);
  }

  get position() {
    this._position.set(this.x, this.y);
    return this._position;
  }

  get velocity() {
    return this.body.velocity;
  }

  get dead() {
    return this.health <= 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onDeath = () => {};

  /**
   * プレイヤーのツルハシがヒットした時に実行するイベント
   */
  hit = () => {
    console.log(this);
    if (this.sound) this.sound.play();
    this.health -= 1;
    console.log('health: ', this.health);
    if (this.dead) {
      this.onDeath();
      this.drops.map((drop) => new DropItem({ scene: this.scene, x: this.x, y: this.y, frame: drop }));
    }
  };
}
