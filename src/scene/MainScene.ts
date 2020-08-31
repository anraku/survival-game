import { Player } from '../class/Player';
import { Resource } from '../class/Resource';

export class MainScene extends Phaser.Scene {
  private player: Player;
  private map: Phaser.Tilemaps.Tilemap;
  constructor() {
    super('MainScene');
  }

  preload() {
    // initial player
    Player.preload(this);
    this.load.image('tiles', 'assets/img/RPG Nature Tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/img/map.json');

    // initial resource
    Resource.preload(this);
  }

  create() {
    // タイルマップ追加
    this.map = this.add.tilemap('map');
    // マップイメージを追加
    const tileset = this.map.addTilesetImage('RPG Nature Tileset', 'tiles', 32, 32, 0, 0);
    // タイルマップからレイヤーを取得
    const layer1 = this.map.createStaticLayer('Tile Layer 1', tileset, 0, 0);
    const layer2 = this.map.createStaticLayer('Tile Layer 2', tileset, 0, 0);

    // レイヤーマップにcollisionを追加
    layer1.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer1);

    // マップに障害物を配置
    this.addResources();

    layer2.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer2);

    // プレイヤーを追加
    this.player = new Player({
      scene: this,
      x: 100,
      y: 100,
      texture: 'female',
      frame: 'townsfolk_m_idle_1',
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

  addResources() {
    const resources = this.map.getObjectLayer('Resources');
    resources.objects.forEach((resource) => {
      // 各オブジェクトを取得
      new Resource({ scene: this, resource });
    });
  }

  update() {
    this.player.update();
  }
}
