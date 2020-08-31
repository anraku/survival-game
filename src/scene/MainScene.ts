import { Player } from '../class/Player';

export class MainScene extends Phaser.Scene {
  private player: Player;
  private map: Phaser.Tilemaps.Tilemap;
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
    this.map = this.add.tilemap('map');
    // マップイメージを追加
    const tileset = this.map.addTilesetImage(
      'RPG Nature Tileset',
      'tiles',
      32,
      32,
      0,
      0,
    );
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
      const item = new Phaser.Physics.Matter.Sprite(
        this.matter.world,
        resource.x,
        resource.y,
        'resources',
        resource.type,
      );

      // オブジェクトのColliderを丸くする
      const physics = new Phaser.Physics.Matter.MatterPhysics(this);
      const circleCollider = physics.bodies.circle(resource.x, resource.y, 12, {
        isSensor: false,
        label: 'collider',
      });
      item.setExistingBody(circleCollider);

      // オブジェクトのColliderの位置を調整する
      const yOrigin: number =
        resource.properties.find((p) => p.name === 'yOrigin').value ?? 0.5;
      item.x += item.width / 2;
      item.y -= item.height / 2;
      item.y = item.y + item.height * (yOrigin - 0.5);
      // オブジェクトの位置を固定する
      item.setStatic(true);
      // オブジェクトを描画する座標を調整する
      item.setOrigin(0.5, yOrigin);
      // オブジェクトを画面に表示する
      this.add.existing(item);
    });
  }

  update() {
    this.player.update();
  }
}
