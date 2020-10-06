import { Player } from '../class/Player';
import { Resource } from '../class/Resource';
import { Enemy } from '../class/Enemy';
import { GameConfig } from '../config';

export class MainScene extends Phaser.Scene {
  private player: Player;
  private map: Phaser.Tilemaps.Tilemap;
  private enemies: Enemy[];
  constructor() {
    super('MainScene');
    this.enemies = [];
  }

  preload() {
    // initial player
    Player.preload(this);
    Enemy.preload(this);
    this.load.image('tiles', 'assets/images/RPG Nature Tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/images/map.json');

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
    this.addEnemies();

    layer2.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer2);

    // プレイヤーを追加
    this.player = new Player({
      scene: this,
      x: 200,
      y: 220,
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
    const camera = this.cameras.main;
    camera.zoom = 2;
    camera.startFollow(this.player);
    camera.setLerp(0.1, 0.1);
    camera.setBounds(0, 0, GameConfig.width, GameConfig.height);
  }

  addResources = () => {
    const resources = this.map.getObjectLayer('Resources');
    resources.objects.forEach((resource) => {
      // 各オブジェクトを取得
      new Resource({ scene: this, resource });
    });
  };

  addEnemies = () => {
    const enemies = this.map.getObjectLayer('Enemies');
    enemies.objects.forEach((enemy) => {
      // 各オブジェクトを取得
      this.enemies.push(new Enemy({ scene: this, enemy }));
    });
  };

  update() {
    this.player.update();
    this.enemies.forEach((enemy) => {
      enemy.update();
    });
  }
}
