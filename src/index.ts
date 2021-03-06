import * as Phaser from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import { Scenes } from './scene';
import { GameConfig } from './config';

const config: Phaser.Types.Core.GameConfig = {
  width: GameConfig.width,
  height: GameConfig.height,
  backgroundColor: '#333333',
  type: Phaser.AUTO,
  parent: 'game',
  scene: Scenes,
  scale: {
    zoom: 2,
  },
  physics: {
    default: 'matter',
    matter: {
      debug: false,
      gravity: {
        y: 0,
      },
    },
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin,
        key: 'matterCollision',
        mapping: 'matterColision',
      },
    ],
  },
};

//HTMLがロードされた後にインスタンスを生成する
window.addEventListener('load', () => {
  new Phaser.Game(config);
});
