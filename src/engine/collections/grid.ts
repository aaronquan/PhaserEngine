import * as Tile from './tile';
import * as Texture from './../graphics/texture';

export type GridCoordinate = {
  x: number, y: number
}
export class MapGrid{

  scene: Phaser.Scene;
  tiles: (Tile.MapTile | undefined)[][];
  x: number;
  y: number;
  width: number;
  height: number;

  cell_width: number;
  cell_height: number;
  tile_factory: Tile.SquareTileFactory;

  collision_tiles: GridCoordinate[];

  constructor(
    scene: Phaser.Scene,
    width: number, height: number, 
    x:number=0, y:number=0,
    cell_width:number=32, cell_height:number=32
  ){
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.cell_width = cell_width;
    this.cell_height = cell_height;

    this.tiles = [];
    for(let i = 0; i < height; i++){
      const row = [];
      for(let j = 0; j < height; j++){
        row.push(undefined);
      }
      this.tiles.push(row);
    
    }
    this.tile_factory = new Tile.SquareTileFactory(this.cell_width, this.cell_height);
  }

  add_tile_texture(x: number, y: number, texture: string){
    const coords = this.global_coordinates({x, y});
    const tile = this.tile_factory.create_tile(this.scene, coords.x, coords.y, texture);
    this.add_tile(x, y, tile);
  }

  add_tile(x:number, y: number, tile: Tile.MapTile){
    this.tiles[y][x] = tile;
  }
  is_point_inside_grid(point: Phaser.Math.Vector2):boolean{
    return point.x >= this.x && point.x < this.width*this.cell_width+this.x && point.y >= this.y && point.y < this.height*this.cell_height+this.y;
  }
  is_coord_inside_grid(coord:GridCoordinate):boolean{
    return coord.x >= 0 && coord.x < this.width && coord.y >= 0 && coord.y < this.height;
  }
  grid_coords(point: Phaser.Math.Vector2):GridCoordinate | undefined{
    if(!this.is_point_inside_grid(point)){
      return undefined;
    }
    return {x:Math.floor((point.x-this.x)/this.cell_width), y:Math.floor((point.y-this.y)/this.cell_height)};
  }
  grid_coords_decimal(point: Phaser.Math.Vector2):Phaser.Math.Vector2 | undefined{
    if(!this.is_point_inside_grid(point)){
      return undefined;
    }
    return new Phaser.Math.Vector2((point.x-this.x)/this.cell_width, (point.y-this.y)/this.cell_height);
  }
  global_coordinates(coord:GridCoordinate, center:boolean=false): Phaser.Math.Vector2{
    if(center){
      return new Phaser.Math.Vector2(coord.x*this.cell_width+(this.cell_width/2)+this.x, coord.y*this.cell_height+(this.cell_height/2)+this.y);
    }
    return new Phaser.Math.Vector2(coord.x*this.cell_width+this.x, coord.y*this.cell_height+this.y);
  }

}