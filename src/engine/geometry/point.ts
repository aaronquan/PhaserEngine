

export function furthest_left(points: Phaser.Geom.Point[]): number{
  if(points.length == 0) return 0;
  let min = points[0].x;
  for(let i = 1; i < points.length; i++){
    if(points[i].x < min){
      min = points[i].x;
    }
  }
  return min;
}

export function furthest_up(points: Phaser.Geom.Point[]): number{
  if(points.length == 0) return 0;
  let min = points[0].y;
  for(let i = 1; i < points.length; i++){
    if(points[i].y < min){
      min = points[i].y;
    }
  }
  return min;
}

export function furthest_right(points: Phaser.Geom.Point[]): number{
  if(points.length == 0) return 0;
  let max = points[0].x;
  for(let i = 1; i < points.length; i++){
    if(points[i].x > max){
      max = points[i].x;
    }
  }
  return max;
}

export function furthest_down(points: Phaser.Geom.Point[]): number{
  if(points.length == 0) return 0;
  let max = points[0].y;
  for(let i = 1; i < points.length; i++){
    if(points[i].y > max){
      max = points[i].y;
    }
  }
  return max;
}
