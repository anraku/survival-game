import { Player } from '../class/Player';

export class MainScene extends Phaser.Scene {
  private player: Player;
  private testPlayer: Player;
  constructor() {
    super('MainScene');
  }

  preload() {
    Player.preload(this);
  }

  create() {
    this.player = new Player({
      scene: this,
      x: 100,
      y: 100,
      texture: 'female',
      frame: 'townsfolk_f_idle_1',
    });
    this.player = new Player({
      scene: this,
      x: 0,
      y: 0,
      texture: 'female',
      frame: 'townsfolk_f_idle_1',
    });
    // キーイベントを登録する
    const keyMap = {
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    };
    this.player.inputKeys = this.input.keyboard.addKeys(keyMap);
  }

  update() {
    this.player.update();
  }
}
