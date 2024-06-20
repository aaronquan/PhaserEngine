import * as GameTemplate from './../engine/game_template';
import { Game as MainGame } from './scenes/Game';
import { MatterTest } from './scenes/MatterTest';
import {TileTest} from './scenes/TileTest';
import {Game} from 'phaser';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
/*const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        MainGame
    ],
    physics: {
        default: "arcade"
    },
};*/

//const config: Types.Core.GameConfig = GameTemplate.default_config([MainGame]);

//const StartGame = (parent?: string | HTMLElement) => {
//    return new Game({ ...config, parent });
//}

export const demo_game = (parent: string) => new Game({...GameTemplate.default_config([MainGame], parent, true), parent,});

export const matter_game = (parent: string) => new Game({...GameTemplate.matter_config([MatterTest], parent), parent});

export const grid_game = (parent: string) => new Game({...GameTemplate.default_config([TileTest], parent), parent});

//export default StartGame;

