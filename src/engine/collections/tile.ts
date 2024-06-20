import * as Entity from './../entity/entity';
import * as Display from './../display';
import * as Texture from './../graphics/texture';

export interface MapTile {
  tile_entity: Entity.BaseEntity;
  
}

export class WallMapTile implements MapTile{
  tile_entity: Entity.BaseEntity; 
  constructor(image: Display.DisplayImage){
    this.tile_entity = new Entity.BaseEntity(image);
  }
}

export class FloorMapTile implements MapTile{
  tile_entity: Entity.StaticCollidesEntity;
  constructor(image: Display.DisplayImage){
    this.tile_entity = new Entity.StaticCollidesEntity(image);
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
  create_tile(scene: Phaser.Scene, x: number, y: number, texture: string): MapTile{
    if(!this.scaled_textures.has(texture)){
      this.create_scaled_texture(scene, texture);
    }

    const obj = new Display.DisplayImage(scene, x, y, this.scaled_textures.get(texture)!.key);
    return new WallMapTile(obj);
  }

  create_scaled_texture(scene: Phaser.Scene, texture_name: string): ScaledTextureKey{
    const rescaled_name = texture_name+'_rescaled';
    const new_texture = Texture.rescale(scene, texture_name, rescaled_name, this.width, this.height);
    const new_texture_key = {key: rescaled_name, texture: new_texture};
    this.scaled_textures.set(texture_name, new_texture_key);
    return new_texture_key;

  }
}