import * as Entity from './../entity/entity';
import * as Display from './../display';
import * as Texture from './../graphics/texture';

export interface MapTile {
  tile_entity: Entity.BaseEntity;
  is_collision_wall(): boolean;
  is_collision_entity(entity: Entity.CollidesEntity): boolean;
  is_collision_point(x: number, y: number): boolean;
  get_collision_points(entity: Entity.CollidesEntity): Phaser.Geom.Point[];

  get_left_side(): number;
  get_right_side(): number;
  get_top_side(): number;
  get_bottom_side(): number;
  tint(): void;
  untint(): void;
}

export class WallMapTile implements MapTile{
  tile_entity: Entity.StaticCollidesEntity;
  constructor(image: Display.DisplayImage){
    this.tile_entity = new Entity.StaticCollidesEntity(image);
    this.tile_entity.set_axis_rect_collision()
  }
  get_left_side(): number{
    return this.tile_entity.object.x-this.tile_entity.object.width/2;
  }
  get_right_side(): number{
    return this.tile_entity.object.x+this.tile_entity.object.width/2;
  }
  get_top_side(): number{
    return this.tile_entity.object.y-this.tile_entity.object.height/2;
  }
  get_bottom_side(): number {
    return this.tile_entity.object.y+this.tile_entity.object.height/2;
  }
  is_collision_wall(): boolean {
    return true;
  }
  is_collision_entity(entity: Entity.CollidesEntity): boolean{
    return this.tile_entity.is_entity_collision(entity);
  }
  get_collision_points(entity: Entity.CollidesEntity): Phaser.Geom.Point[]{
    return this.tile_entity.get_entity_collision_points(entity);
  }
  tint(){
    this.tile_entity.object.setTintFill(0xffffff);
  }
  untint(){
    this.tile_entity.object.clearTint();
  }
}

export class FloorMapTile implements MapTile{
  tile_entity: Entity.BaseEntity; 
  constructor(image: Display.DisplayImage){
    this.tile_entity = new Entity.BaseEntity(image);
  }
  get_left_side(): number{
    return this.tile_entity.object.x-this.tile_entity.object.width/2;
  }
  get_right_side(): number{
    return this.tile_entity.object.x+this.tile_entity.object.width/2;
  }
  get_top_side(): number{
    return this.tile_entity.object.y-this.tile_entity.object.height/2;
  }
  get_bottom_side(): number {
    return this.tile_entity.object.y+this.tile_entity.object.height/2;
  }
  is_collision_point(x: number, y: number): boolean {
    //todo
    //this.tile_entity.
  }
  is_collision_wall(): boolean {
    return false;
  }
  is_collision_entity(entity: Entity.CollidesEntity): boolean{
    return false;
  }
  get_collision_points(entity: Entity.CollidesEntity): Phaser.Geom.Point[]{
    return [];
  }

  tint(){
    this.tile_entity.object.setTintFill(0xffffff);
  }

  untint(){
    this.tile_entity.object.clearTint();
  }
}

/*
export class MapTile extends Entity.StaticCollidesEntity{
  constructor(tile_object: Display.DisplayImage){
    super(tile_object);
  }
}*/

type ScaledTextureKey = {
  key: string;
  texture: Phaser.Textures.DynamicTexture | null;
}


export class SquareTileFactory{
  width: number; //width of tile
  height: number; //height of tile
  scaled_textures: Map<string, ScaledTextureKey>;
  constructor(width: number, height: number){
    this.width = width;
    this.height = height;
    this.scaled_textures = new Map();
  }
  create_tile(scene: Phaser.Scene, x: number, y: number, texture: string, is_wall: boolean=false): MapTile{
    if(!this.scaled_textures.has(texture)){
      this.create_scaled_texture(scene, texture);
    }
    const obj = new Display.DisplayImage(scene, x, y, this.scaled_textures.get(texture)!.key);
    return is_wall ? new WallMapTile(obj) : new FloorMapTile(obj);
  }

  create_scaled_texture(scene: Phaser.Scene, texture_name: string): ScaledTextureKey{
    const rescaled_name = texture_name+'_rescaled';
    const new_texture = Texture.rescale(scene, texture_name, rescaled_name, this.width, this.height);
    const new_texture_key = {key: rescaled_name, texture: new_texture};
    this.scaled_textures.set(texture_name, new_texture_key);
    return new_texture_key;

  }
}