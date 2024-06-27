import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

import * as Player from './../player/player';
import * as Display from './../../engine/display';
import * as Collision from './../../engine/entity/collision';
import * as Entity from './../../engine/entity/entity';

import * as Keys from './../../engine/input/keys';

import * as Collections from './../../engine/collections/entity_manager';

import * as TestPipelines from './../shaders/test';

export class Game extends Scene
{
  player: Player.Player;
  test_object: Entity.CollidesEntity;
  path: Phaser.Math.Vector2[];

  keys: Keys.InputKeyMap;
  debugText1: Phaser.GameObjects.Text;

  point_collision: Phaser.GameObjects.Graphics[];
  circles: Circles;

  entities: Collections.EntityManager;
  
  
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
    const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    renderer.pipelines.addPostPipeline('test', TestPipelines.RefFxPipeline);

    renderer.pipelines.addPostPipeline('hue', TestPipelines.HueFragShader);
    
    const circle100 = this.add.graphics();
    circle100.fillStyle(0xff0000);
    circle100.fillCircle(100, 100, 100);
    circle100.generateTexture("circle100", 200, 200);
    circle100.destroy();

    this.entities = new Collections.EntityManager();
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
    const player = new Player.Player(this);
    this.entities.add_entity(player);

    this.debugText1 = this.add.text(300, 50, 'IN');
    this.player = player;//new Player.Player(this);
    this.player.set_axis_rect_collision();
    this.player.object.setPostPipeline('test');
    //this.player.add_triangle_collision();
    //this.player.object.setRotation(0.85);

    

    this.tweens.add({
      targets: this.player.object.getPostPipeline('test'),
      p: 1,
      duration: 2000,
      delay: 1000,
      repeat: -1,
      yoyo: true
    });

    this.test_object = new Entity.CollidesEntity(new Display.DisplaySprite(this, 300, 100, "star"));
    this.test_object.set_circle_collision();
    this.test_object.velocity.x += 100; 

    this.entities.add_entity(this.test_object);


    this.circles = new Circles();
    for(let i = 0; i < 5; i++){
      const circle = this.circles.add_random(this);
      this.entities.add_entity(circle);
    }

    this.input.on('pointermove', (pointer:Phaser.Input.Pointer) => {

    });

    this.input.on('pointerdown', (pointer:Phaser.Input.Pointer) => {
      if(this.keys.is_key_down(Phaser.Input.Keyboard.KeyCodes.SHIFT)){
        this.player.move_to(pointer.x, pointer.y);
      }else{
        this.test_object.move_to(pointer.x, pointer.y);
      }

    });
    this.point_collision = [];
    
    EventBus.emit('current-scene-ready', this);
    console.log(this.entities);

    //this.cameras.main.setPostPipeline('test');
    console.log(this.cameras.main);
  }

  update(time:number, dt: number){
    const delta = dt/1000;
    //console.log(delta);
    const pointer = this.input.activePointer;
    this.player.move_player(this.keys);
    this.entities.move_entities_delta(delta);
    this.entities.resolve_overlap_collisions();



    //this.test_object.update();
    if(this.test_object.object.x > 600){
      this.test_object.velocity.x = -100;
    }else if(this.test_object.object.x < 100){
      this.test_object.velocity.x = 100;
    }

    const collision_points = this.player.get_entity_collision_points(this.test_object);
    for(const c of this.point_collision){
      c.destroy();
    }
    this.point_collision = [];
    for(const point of collision_points){
      const circ = this.add.graphics();
      circ.fillStyle(0xffffff);
      circ.fillCircle(point.x, point.y, 5);
      this.point_collision.push(circ);
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

class Circles{
  circles: Circle[];

  constructor(){
    this.circles = [];
  }

  add_random(scene: Phaser.Scene): Circle{
    const circle = new Circle(scene, Math.random()*600, Math.random()*600);
    
    return circle;
  }
}

class Circle extends Entity.CollidesEntity{
  constructor(scene: Phaser.Scene, x: number, y: number){
    const obj = new Display.DisplayImage(scene, x, y, "circle100");
    obj.setPostPipeline('hue');
    obj.setPostPipelineData('hueSpeed', Math.random()*0.1);
    //obj.setTint(0xfff30f*Math.random());
    const scale = Math.random()*0.4+0.2;
    obj.setScale(scale);
    super(obj);
  }
}
