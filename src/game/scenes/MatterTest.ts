
import * as Collision from "./../../engine/entity/collision";

//const fact: MatterJS.DetectorFactory = new MatterJS.DetectorFactory();

export class MatterTest extends Phaser.Scene{
  c: MatterJS.BodyType;
  r: MatterJS.BodyType;
  constructor(){
    super('MatterTest');
  }
  preload(){
    this.load.setPath('assets');
    this.load.image('star', 'star.png');
    //this.matter.world.drawDebug = true;
  }
  create(){
    //this.matter.world.drawDebug = true;
    //const r = this.
    this.matter.world.debugConfig.renderFill = true;
    console.log(this.matter.world.debugConfig);

    const c = this.matter.add.circle(100, 100, 40, {isSensor: true, 
      isStatic: true, render: { 
      //visible: true, opacity: 1, 
      fillColor: 0x00ffff, fillOpacity: 1,
      lineColor: 0x369a99, lineOpacity: 1, lineThickness: 5
    }});
    console.log(c);
    //c.gameObject = new Collision.CollisionRectangle(this, 100, 100, 40, 40);
    //this.matter
    this.c = c;

    //this.r = this.matter.add.rectangle(50, 50, 50, 50);
    this.r = this.matter.add.rectangle(50, 50, 40, 40);
    //this.r.

    //const i = this.matter.add.image(200, 200, 'star', 0, {isStatic: true});
    //i.setRotation(1);

    this.input.on('pointermove', (pointer:Phaser.Input.Pointer) => {
      if(this.matter.containsPoint(c, pointer.x, pointer.y)){
        console.log("on c");
      }
      //console.log(pointer);
    });
    //this.matter.pair.create()
    const rec = this.matter.detector.create({bodies: [this.c, this.r]});
    console.log(rec);
    console.log(this.matter.detector.collisions(rec, this.matter.world.engine));
    //rec.

    //this.matter.pair
    //this.matter.query.point
    //this.matter.detector

    this.matter.world.on('collisionactive', (event:Phaser.Physics.Matter.Events.CollisionActiveEvent) =>
    {
      //console.log(event.pairs);
      //event.delta;

      //  Loop through all of the collision pairs
      //const pairs = event.pairs;
      //console.log(event);

    });
  }
  update(){
    const rec = this.matter.intersectBody(this.c, [this.r]);
    if(rec.length >= 1){
      //console.log(true);
    }else{
      //console.log(false);
    }
    //console.log(rec);
    //this.r.angle = this.r.anglePrev+0.1;
    //this.matter.world.renderBodyBounds();
  }
}
