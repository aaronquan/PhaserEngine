import * as Display from "./../display";
import * as Interface from "./../graphics/interface";
import * as Collision from "./collision";

import * as EntityMixins from "./mixins";


export class EntityBank{
  entities: Map<number, Entity>;
  id:number;
  constructor(){
    this.entities = new Map();
    this.id = 0;
  }
  add_entity(entity: Entity): number{
    const cid = this.id;
    this.entities.set(cid, entity);
    entity.object.setData('entity_bank_id', cid);
    this.id++;
    return cid;
  }
  static get_display_object_id(obj: Entity):number | undefined{
    return obj.object.getData('entity_bank_id');
  }
  get_entity(id: number): Entity | undefined{
    return this.entities.get(id);
  }
  remove_entity(id: number){
    this.entities.delete(id);
  }
}

export interface Entity{
  readonly object: Display.DisplayObject;
  update(): void;
  update_delta(delta: number): void;
  is_static(): boolean;
  is_collision(): boolean;
}

//not used yet
export interface MatterCollisionEntity extends Entity{
  collision_area: MatterJS.BodyType
}

export class BaseEntity implements Entity{
  object: Display.DisplayObject;
  constructor(obj: Display.DisplayObject){
    this.object = obj;
  }
  update(){

  }
  update_delta(delta: number): void {
    
  }
  get_position(): Phaser.Math.Vector2{
    return new Phaser.Math.Vector2(this.object.x, this.object.y);
  }
  get_size(): Phaser.Math.Vector2{
    return new Phaser.Math.Vector2(this.object.width, this.object.height);
  }
  destroy(){
    this.object.destroy();
  }
  is_static(): boolean {
    return true;
  }
  is_collision(): boolean {
    return false;
  }
}

//old style
//export const CollidesEntity = EntityMixins.SingleCollides(MovingEntity);

export class StaticHealthEntity extends EntityMixins.Health(BaseEntity){};

export class MovingEntity extends EntityMixins.Moving(BaseEntity){};

export class HealthEntity extends EntityMixins.Health(MovingEntity){};

export class StaticCollidesEntity extends EntityMixins.StaticSingleCollides(BaseEntity){};

export class StaticHealthCollisionEntity extends EntityMixins.StaticSingleCollides(StaticHealthEntity){};

export class CollidesEntity extends EntityMixins.SingleCollides(MovingEntity){};

export class CollidesHealthEntity extends EntityMixins.SingleCollides(HealthEntity){};

