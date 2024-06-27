
import * as Display from './../../engine/display';
import * as Tile from './../../engine/collections/tile';
import * as Texture from './../../engine/graphics/texture';
import * as Grid from './../../engine/collections/grid';
import { Player } from '../player/player';
import * as Keys from './../../engine/input/keys';
export class TileTest extends Phaser.Scene
{
  img: Display.DisplayImage;
  player: Player;
  keys: Keys.InputKeyMap;
  grid: Grid.MapGrid;
  constructor ()
  {
    super('TileTest');
  }

  preload ()
  {
    this.load.setPath('assets');
    
    this.load.image('star', 'star.png');
    this.load.image('logo', 'logo.png');
    this.load.image('bg', 'bg.png');
  }

  create(){

    this.keys = new Keys.InputKeyMap();
    this.keys.add_keys(this.input, ['W', 'A', 'S', 'D']);

    this.grid = new Grid.MapGrid(this, 20, 20, 100, 100, 40, 40);
    this.grid.fill_grid('star');
    this.grid.add_tile_texture(1,1, 'star');
    this.grid.add_tile_texture(1,2, 'bg');
    this.grid.add_tile_texture(2,2, 'logo', true);
    
    this.player = new Player(this);
    this.player.set_circle_collision();


  }

  update(){
    this.player.move_player(this.keys);
    //const collisions = this.grid.collide_entity(this.player);
    this.player.update();
    const collisions = this.grid.collide_entity(this.player);
    
    //const collisions = this.grid.collide_entity(this.player);
    //for(const coll of collisions){
      //if(coll.tile_entity.object.x < ){
      //  coll.tile_entity.object
      //}
    //}
  }


}

