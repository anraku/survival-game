type keyType = {
  up: number;
  down: number;
  left: number;
  right: number;
};

export class MainScene extends Phaser.Scene {
  private player: Phaser.Physics.Matter.Sprite;
  private inputKeys;
  constructor() {
    super('MainScene');
  }

  preload() {}

  create(): void {
    this.player = new Phaser.Physics.Matter.Sprite(
      this.matter.world,
      300,
      300,
      '',
    );
    // キーイベントを登録する
    const keyMap: keyType = {
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    };
    this.inputKeys = this.input.keyboard.addKeys(keyMap);
    console.log('create end');
  }

  // 移動キーを押した時のイベントに応じてplayerの位置を変更する
  update(): void {
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
    this.player.setVelocity(playerVelocity.x, playerVelocity.y);
  }
}
