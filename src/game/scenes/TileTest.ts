
import * as Display from './../../engine/display';
import * as Tile from './../../engine/collections/tile';
import * as Texture from './../../engine/graphics/texture';
import * as Grid from './../../engine/collections/grid';
export class TileTest extends Phaser.Scene
{
  img: Display.DisplayImage;
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
    const grid = new Grid.MapGrid(this, 4, 4, 100, 100);
    grid.add_tile_texture(1,1, 'star');
    grid.add_tile_texture(1,2, 'bg');
    grid.add_tile_texture(2,2, 'logo');
    //const new_tex = Texture.rescale(this, 'star', 'stb', 54, 134);
    console.log(grid.tile_factory);
    const img2 = this.add.image(200, 200, 'star');
    //img2.setTintFill(0xff0000);
  }


}

