import * as Tile from './tile';
import * as Texture from './../graphics/texture';
import * as Entity from './../entity/entity';
import * as Point from './../geometry/point';

import * as Collision from './../entity/collision';

export type GridCoordinate = {
  x: number, y: number
}

export type GridCoordinateDecimal = GridCoordinate;

export enum Direction{
  North, East, West, South
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

  //collision_tiles: GridCoordinate[];

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
    //this.collision_tiles = [];
  }

  collide_entity(entity: Entity.CollidesEntity): Tile.MapTile[]{
    const tiles:Tile.MapTile[] = [];
    
    /*for(let i = 0; i < this.width; i++){
      for(let j = 0; j < this.height; j++){
        this.tiles[j][i]?.untint();
      }
    }*/
    const last = entity.last_position;
    const current = entity.get_position();
    const dx = current.x - last.x; // positive move right, 
    const dy = current.y - last.y; // positive move down, 
    const velocity = entity.velocity;

    let nx = 0;
    let ny = 0;
    console.log(dx);
    const possible = this.entity_on_tiles_rectangle(entity);
    for(const tile of possible){
      const tile_position = tile.tile_entity.get_position();

      if(entity.collision_object?.type == Collision.CollisionType.Circle){
        if(velocity.x > 0){
          const lc = entity.object.getLeftCenter();
          //tile.
        }else if(velocity.x < 0){
          const rc = entity.object.getRightCenter();
        }
        if(velocity.y > 0){
          const bc = entity.object.getBottomCenter();
        }else if(velocity.y < 0){
          const tc = entity.object.getTopCenter();
        }
      }
      const collision_points = tile.get_collision_points(entity);
      if(collision_points.length == 0) continue;
      //circle and rectangle clipping
      if(dx > 0){
        const rightest = Point.furthest_right(collision_points);
        nx = tile.get_left_side() - rightest;
      }else if(dx < 0){
        const leftest = Point.furthest_left(collision_points);
        nx = tile.get_right_side() - leftest;
      }
      if(dy > 0){
        const downest = Point.furthest_down(collision_points);
        ny = tile.get_top_side() - downest;
        const upest = Point.furthest_up(collision_points);
        ny = tile.get_bottom_side() - upest;
      }
      else if(dy < 0){
        const upest = Point.furthest_up(collision_points);
        ny = tile.get_bottom_side() - upest;
      }
      /*
      for(const point of collision_points){
        const temp = this.scene.add.graphics();
        temp.fillStyle(0xffffff);
        temp.fillCircle(point.x, point.y, 2);
      }*/
      //if(tile.collides(entity)){
      //  if(dx > 0){
          
      //  }else if(dx < 0){

      //  }
      //  entity.move_to(nx, ny);
      //  tiles.push(tile);
      //  tile.tile_entity.object.setTintFill(0xff0000);
      //}
    }
    if(nx !== 0){
      console.log(nx);
      entity.move(nx, 0);
    }if(ny !== 0){
      console.log(ny);
      entity.move(0, ny);
    }
    return tiles;
  }

  entity_on_tiles_rectangle(entity: Entity.CollidesEntity): Tile.MapTile[]{
    for(let i = 0; i < this.width; i++){
      for(let j = 0; j < this.height; j++){
        this.tiles[j][i]?.untint();
      }
    }
    const entity_dimensions = entity.get_size();
    const entity_tile_width = Math.ceil(entity_dimensions.x/this.cell_width)+1;
    const entity_tile_height = Math.ceil(entity_dimensions.y/this.cell_height)+1;
    const entity_position = entity.get_position();
    const grid_coords_decimal = this.grid_coords_decimal(entity_position);

    const grid_coords = {x: Math.floor(grid_coords_decimal.x), y: Math.floor(grid_coords_decimal.y)};

    const half_width = Math.ceil(entity_tile_width/2);
    const half_height = Math.ceil(entity_tile_height/2);

    const tiles:Tile.MapTile[] = [];
    for(let y = grid_coords.y-half_height+1; y < grid_coords.y+half_height+1; y++){
      for(let x = grid_coords.x-half_width+1; x < grid_coords.x+half_width+1; x++){
        if(this.is_coord_inside_grid({x, y})){
          this.tiles[y][x]?.tint();
          if(this.tiles[y][x]) tiles.push(this.tiles[y][x]!);
        }
      }
    }
    return tiles;
  }

  add_tile_texture(x: number, y: number, texture: string, is_wall:boolean=false){
    const coords = this.global_coordinates({x, y});
    const tile = this.tile_factory.create_tile(this.scene, coords.x, coords.y, texture, is_wall);

    this.add_tile(x, y, tile);
  }

  add_tile(x:number, y: number, tile: Tile.MapTile){
    this.tiles[y][x]?.tile_entity.destroy();
    this.tiles[y][x] = tile;
  }
  
  fill_grid(texture: string){
    for(let i = 0; i < this.width; i++){
      for(let j = 0; j < this.height; j++){
        const is_border = i == 0 || j == 0 || i == this.width - 1 || j == this.height - 1;
        this.add_tile_texture(i, j, texture, is_border);
      }
    }
  }
  is_point_inside_grid(point: Phaser.Math.Vector2):boolean{
    return point.x >= this.x && point.x < this.width*this.cell_width+this.x && point.y >= this.y && point.y < this.height*this.cell_height+this.y;
  }
  is_coord_inside_grid(coord:GridCoordinate):boolean{
    return coord.x >= 0 && coord.x < this.width && coord.y >= 0 && coord.y < this.height;
  }
  grid_coords(point: Phaser.Math.Vector2):GridCoordinate{
    return {x:Math.floor((point.x-this.x)/this.cell_width), y:Math.floor((point.y-this.y)/this.cell_height)};
  }
  grid_coords_decimal(point: Phaser.Math.Vector2):GridCoordinateDecimal{
    return new Phaser.Math.Vector2((point.x-this.x)/this.cell_width, (point.y-this.y)/this.cell_height);
  }
  global_coordinates(coord:GridCoordinate, center:boolean=false): Phaser.Math.Vector2{
    if(center){
      return new Phaser.Math.Vector2(coord.x*this.cell_width+(this.cell_width/2)+this.x, coord.y*this.cell_height+(this.cell_height/2)+this.y);
    }
    return new Phaser.Math.Vector2(coord.x*this.cell_width+this.x, coord.y*this.cell_height+this.y);
  }

  debug_toggle(coord:GridCoordinate){
    if(this.is_coord_inside_grid(coord)){
      this.tiles[coord.y][coord.x]?.tint();
    }
  }

}

enum GridSection{
  TopLeft, TopRight, BottomLeft, BottomRight
}

function get_grid_section(coord: GridCoordinateDecimal): GridSection{
  const x = coord.x % 1;
  const y = coord.y % 1;
  if(x < 0.5){
    if(y < 0.5){
      return GridSection.TopLeft;
    }else{
      return GridSection.BottomLeft;
    }
  }
  if(y < 0.5){
    return GridSection.TopRight;
  }
  return GridSection.BottomRight;
}


function move_coord_direction(coordinate: GridCoordinate, dir: Direction, steps:number=1): GridCoordinate{
  switch(dir){
    case Direction.North:
      return move_coord_north(coordinate, steps);
    case Direction.East:
      return move_coord_east(coordinate, steps);
    case Direction.South:
      return move_coord_south(coordinate, steps);
    case Direction.West:
      return move_coord_west(coordinate, steps);
  }
}

function move_coord_x_y(coordinate: GridCoordinate, x: number, y: number): GridCoordinate{
  return {x: coordinate.x+x, y: coordinate.y+y};
}

function move_coord_north(coordinate: GridCoordinate, steps:number=1): GridCoordinate{
  return {x: coordinate.x, y: coordinate.y-steps};
}

function move_coord_east(coordinate: GridCoordinate, steps:number=1): GridCoordinate{
  return {x: coordinate.x+steps, y: coordinate.y};
}

function move_coord_south(coordinate: GridCoordinate, steps:number=1): GridCoordinate{
  return {x: coordinate.x, y: coordinate.y+steps};
}

function move_coord_west(coordinate: GridCoordinate, steps:number=1): GridCoordinate{
  return {x: coordinate.x-steps, y: coordinate.y};
}

function get_surrounding_coordinates(coordinate: GridCoordinate): GridCoordinate[]{
  const coords = [
    coordinate,
    move_coord_north(coordinate, 1), move_coord_x_y(coordinate, 1, 1),
    move_coord_south(coordinate, 1), move_coord_x_y(coordinate, -1, 1),
    move_coord_east(coordinate, 1), move_coord_x_y(coordinate, -1, -1),
    move_coord_west(coordinate, 1), move_coord_x_y(coordinate, 1, -1),
  ];
  return coords;
}