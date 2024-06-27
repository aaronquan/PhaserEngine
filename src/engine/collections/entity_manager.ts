import * as Entity from './../entity/entity';



export class EntityManager{
  bank: Entity.EntityBank;
  moving_entity_ids: Set<number>;
  collision_entity_ids: Set<number>;
  //health_entity: Set<number>;
  //display_entity: Set<number>;

  collision_system: CollisionManager;

  constructor(){
    this.bank = new Entity.EntityBank();
    this.moving_entity_ids = new Set();
    this.collision_entity_ids = new Set();
    //this.health_entity: Set>
    this.collision_system = new CollisionManager();
  }
  add_entity(entity: Entity.BaseEntity): number{
    const id = this.bank.add_entity(entity);
    if(entity.is_collision()){
      this.collision_entity_ids.add(id);
    }
    if(!entity.is_static()){
      this.moving_entity_ids.add(id);
    }
    return id;
  }
  remove_entity_id(id: number){
    const entity = this.bank.get_entity(id);
    if(entity?.is_collision()){
      this.collision_entity_ids.delete(id);
    }
    if(entity?.is_static){
      this.moving_entity_ids.delete(id);
    }
    this.bank.remove_entity(id);
  }
  //update_display_entities(camera: Phaser.Cameras.Scene2D.Camera){
    //const bounds = camera.worldView;
    
  //}
  /*
  add_moving_entity(entity: Entity.MovingEntity): number{
    const id = this.bank.add_entity(entity);
    this.moving_entity_ids.add(id);
    return id;
  }
  add_collision_entity(entity: Entity.CollidesEntity | Entity.StaticCollidesEntity): number{
    const id = this.bank.add_entity(entity);
    this.moving_entity_ids.add(id);
    return id;
  }*/
  point_collision_entity(x: number, y: number): number[]{
    const entity_ids = [];
    for(const id of this.collision_entity_ids){
      const entity = this.bank.get_entity(id) as Entity.StaticCollidesEntity;
      if(entity.is_point_collision(x, y)){
        entity_ids.push(id);
      }
    }
    return entity_ids;
  }
  resolve_overlap_collisions(){
    this.collision_system.overlap_collisions_boolean(this.bank);
  }
  move_entities_delta(delta: number){
    for(const id of this.moving_entity_ids){
      const entity = this.bank.get_entity(id) as Entity.MovingEntity;
      entity.update_delta(delta);
    }
  }
  
}

type CollisionSet = {
  set1: Set<number>;
  set2: Set<number>;
  collision_function: (e1: Entity.BaseEntity, e2: Entity.BaseEntity) => any;
}

export class CollisionManager{
  overlap_collision_sets: Map<string, CollisionSet>;
  shift_collision_sets: Map<string, CollisionSet>;

  constructor(){
    this.overlap_collision_sets = new Map();
    this.shift_collision_sets = new Map();
  }
  add_overlap_collision_set(name:string, collision_function: (e1: Entity.BaseEntity, e2: Entity.BaseEntity) => any){
    this.overlap_collision_sets.set(name, {set1: new Set(), set2: new Set(), collision_function});
  }
  add_shift_collision_set(name:string, collision_function: (e1: Entity.BaseEntity, e2: Entity.BaseEntity) => any){
    this.shift_collision_sets.set(name, {set1: new Set(), set2: new Set(), collision_function});
  }
  add_to_set(name:string, ids: number[], is_set1: boolean){
    const collision_set = this.overlap_collision_sets.get(name);
    if(is_set1){
      for(const id of ids){
        collision_set?.set1.add(id);
      }
    }else{
      for(const id of ids){
        collision_set?.set2.add(id);
      }
    }
  }

  overlap_collisions_boolean(bank:Entity.EntityBank){
    for(const [name, _] of this.overlap_collision_sets){
      this.process_overlap_collision_set(name, bank);
    }
  }
  process_overlap_collision_set(name: string, bank:Entity.EntityBank){
    const collision_set = this.overlap_collision_sets.get(name);
    if(collision_set){
      for(const id1 of collision_set.set1){
        const entity1 = bank.get_entity(id1) as Entity.StaticCollidesEntity;
        if(!entity1) continue;
        for(const id2 of collision_set.set2){
          const entity2 = bank.get_entity(id2) as Entity.StaticCollidesEntity;
          if(!entity2) continue;
          if(entity1.is_entity_collision(entity2)){
            collision_set.collision_function(entity1, entity2);
          }
        }
      }
    }
  }
}