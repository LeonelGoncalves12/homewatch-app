import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


export class CameraHelper {

  static async getCameraPic(){
    let camera = new Camera();

    const options: CameraOptions = {
      quality: 70,
      destinationType: camera.DestinationType.DATA_URL,
      encodingType: camera.EncodingType.PNG,
      mediaType: camera.MediaType.PICTURE
    };

    return this.getPicture(camera, options)
  }

  static async getPicFromGallery(){

    let camera = new Camera();

    const options: CameraOptions = {
      quality: 70,
      destinationType: camera.DestinationType.DATA_URL,
      encodingType: camera.EncodingType.PNG,
      mediaType: camera.MediaType.PICTURE,
      sourceType: camera.PictureSourceType.PHOTOLIBRARY
    };

    return this.getPicture(camera, options)
  }

  static async getPicture(camera, options){

    let imageData = await camera.getPicture(options);

    if (imageData == null)
    {
      return;
    }
    return 'data:image/png;base64,' + imageData;
  }
}


