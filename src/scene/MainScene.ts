import { Player } from '../class/Player';

export class MainScene extends Phaser.Scene {
  private player: Player;
  constructor() {
    super('MainScene');
  }

  preload() {
    Player.preload(this);
    this.load.image('tiles', 'assets/img/RPG Nature Tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/img/map.json');
    this.load.atlas(
      'resources',
      'assets/img/resources.png',
      'assets/img/resources_atlas.json',
    );
  }

  create() {
    // タイルマップ追加
    const map = this.add.tilemap('map');
    // マップイメージを追加
    const tileset = map.addTilesetImage(
      'RPG Nature Tileset',
      'tiles',
      32,
      32,
      0,
      0,
    );
    // タイルマップからレイヤーを取得
    const layer1 = map.createStaticLayer('Tile Layer 1', tileset, 0, 0);
    const layer2 = map.createStaticLayer('Tile Layer 2', tileset, 0, 0);

    // レイヤーマップにcollisionを追加
    layer1.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer1);
    // マップに障害物を配置
    const tree = new Phaser.Physics.Matter.Sprite(
      this.matter.world,
      150,
      50,
      'resources',
      'tree',
    );
    const rock = new Phaser.Physics.Matter.Sprite(
      this.matter.world,
      150,
      150,
      'resources',
      'rock',
    );
    tree.setStatic(true);
    rock.setStatic(true);
    this.add.existing(tree);
    this.add.existing(rock);

    layer2.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer2);

    // プレイヤーを追加
    this.player = new Player({
      scene: this,
      x: 100,
      y: 100,
      texture: 'female',
      frame: 'townsfolk_f_idle_1',
    });
    // キーイベントを登録
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
