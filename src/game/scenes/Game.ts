import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

import * as Player from './../player/player';
import * as Display from './../../engine/display';
import * as Collision from './../../engine/entity/collision';
import * as Entity from './../../engine/entity/entity';

import * as Keys from './../../engine/input/keys';

export class Game extends Scene
{
  player: Player.Player;
  test_object: Entity.CollidesEntity;
  path: Phaser.Math.Vector2[];

  keys: Keys.InputKeyMap;
  debugText1: Phaser.GameObjects.Text;
  constructor ()
  {
    super('Game');
  }

  preload ()
  {
    this.load.setPath('assets');
    
    this.load.image('star', 'star.png');
    this.load.image('background', 'bg.png');
    this.load.image('logo', 'logo.png');
  }

  create ()
  {
    this.keys = new Keys.InputKeyMap();
    this.keys.add_keys(this.input, ['W', 'A', 'S', 'D', 'E']);
    this.keys.add_keys(this.input, [ Phaser.Input.Keyboard.KeyCodes.SHIFT, Phaser.Input.Keyboard.KeyCodes.CTRL]);
    this.path = [new Phaser.Math.Vector2(100, 100), new Phaser.Math.Vector2(600, 100)];
    //Phaser.Math.Interpolation.Linear()

    this.input.keyboard?.on('keydown', (e:KeyboardEvent) => {
      if(e.key == 'h'){
        //this.player.show_health_bar();
      }
    });

    this.debugText1 = this.add.text(300, 50, 'IN');
    this.player = new Player.Player(this);
    this.player.set_rect_collision();
    //this.player.add_triangle_collision();
    //this.player.object.setRotation(0.85);

    this.test_object = new Entity.CollidesEntity(new Display.DisplaySprite(this, 300, 100, "star"));
    this.test_object.set_axis_rect_collision()
    this.test_object.velocity.x += 1; 

    this.input.on('pointermove', (pointer:Phaser.Input.Pointer) => {

    });

    this.input.on('pointerdown', (pointer:Phaser.Input.Pointer) => {
      if(this.keys.is_key_down(Phaser.Input.Keyboard.KeyCodes.SHIFT)){
        this.player.move_to(pointer.x, pointer.y);
      }else{
        this.test_object.move_to(pointer.x, pointer.y);
      }

    });
    //console.log(this.player.update);
    
    EventBus.emit('current-scene-ready', this);

  }

  update(){
    const pointer = this.input.activePointer;

    this.player.move_player(this.keys);
    this.player.update();
    this.test_object.update();
    if(this.test_object.object.x > 600){
      this.test_object.velocity.x = -1;
    }else if(this.test_object.object.x < 100){
      this.test_object.velocity.x = 1;
    }

    
    const coll = this.player.is_point_collision(pointer.x, pointer.y);
    if(coll){
      this.debugText1.setText('IN');
      this.player.collision_object?.set_debug_state(Collision.DebugState.Collision);
    }else{
      this.debugText1.setText('OUT');
      this.player.collision_object?.set_debug_state(Collision.DebugState.Default);
    }
    
    const coll1 = this.player.is_entity_collision(this.test_object);
    if(coll1){
      this.player.collision_object?.set_debug_state(Collision.DebugState.Collision);
      this.test_object.collision_object?.set_debug_state(Collision.DebugState.Collision);
    }else{
      this.player.collision_object?.set_debug_state(Collision.DebugState.Default);
      this.test_object.collision_object?.set_debug_state(Collision.DebugState.Default);
    }
    
    this.player.object.setRotation(this.player.object.rotation+0.01);
    //this.test_object.object.setRotation(this.test_object.object.rotation-0.01);
  }
}
