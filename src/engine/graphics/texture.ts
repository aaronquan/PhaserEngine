

export function rescale(scene: Phaser.Scene,
  texture_name: string, new_texture_name: string, 
  new_width: number, new_height: number
): Phaser.Textures.DynamicTexture | null{
  const texture = scene.textures.get(texture_name).getSourceImage();
  const img = new Phaser.GameObjects.Image(scene, 100, 100, texture_name);
  //const texture = scene.textures.get(texture_name).getSourceImage();
  const x_scale = new_width/texture.width;
  const y_scale = new_height/texture.height;
  img.setScale(x_scale, y_scale);

  const new_texture = scene.textures.addDynamicTexture(new_texture_name, new_width, new_height);
  //new_texture?.fill(0xffff00); test background
  new_texture?.draw(img, new_width/2, new_height/2);
  return new_texture;
}