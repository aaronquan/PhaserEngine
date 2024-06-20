import { InputKeyMap } from "../../engine/input/keys";
import * as Display from "./../../engine/display";
import * as Entity from "./../../engine/entity/entity";

import * as Collision from "./../../engine/entity/collision";

export class Player extends Entity.CollidesEntity{
  move_speed: number;
  //velocity: Phaser.Math.Vector2;
  constructor(scene: Phaser.Scene){
    super(new Display.DisplaySprite(scene, 180, 350, "star"));
    this.move_speed = 10;
    //console.log(this.health_bar);
    //this.set_circle_collision();
    //this.set_axis_rect_collision();
    //this.show_collision_debug();
    //this.set_circle_collision();
    //this.init_general_health_bar();
  }

  move_player(keys:InputKeyMap){
    const move_velocity = new Phaser.Math.Vector2();
    if(keys.is_key_down('A')){
      move_velocity.x = -this.move_speed;
    }else if(keys.is_key_down('D')){
      move_velocity.x = this.move_speed;
    }
    if(keys.is_key_down('W')){
      move_velocity.y = -this.move_speed;
    }else if(keys.is_key_down('S')){
      move_velocity.y = this.move_speed;
    }
    move_velocity.limit(this.move_speed);
    this.velocity.x = move_velocity.x;
    this.velocity.y = move_velocity.y;
    //this.extensions.setXY(this.x+12, this.y+-17); //
  }

  add_triangle_collision(){
    const x1 = this.object.x;
    const y1 = this.object.y;
    const x2 = this.object.x;
    const y2 = this.object.y + 50;
    const x3 = this.object.x + 50;
    const y3 = this.object.y;
    this.collision_object = Collision.CollisionObjectFactory.create_collision_triangle(
      this.object.x, this.object.y, x1, y1, x2, y2, x3, y3, this.object.scene
    );
  }
  //update(){
    //super.update();
    //console.log(this.velocity);
    //console.log(this.velocity);
    //this.object.setX(this.object.x+this.velocity.x);
    //this.object.setY(this.object.y+this.velocity.y);
  //}
}