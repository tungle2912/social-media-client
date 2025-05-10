import attachment from './attachment.png';
import coverPhoto from './coverPhoto1jpg.jpg';
import iconTick from './iconTick.png';
import imageDefault from './imageDefault.png';
import imagelogin from './imageLogin.jpg';
import logo from '../../logo.png';
import videoAndImage from './photos-video.png';

interface IImage {
  [key: string]: any;
}
const image: IImage = {
  imagelogin,
  logo,
  videoAndImage,
  attachment,
  coverPhoto,
  iconTick,
  imageDefault,
};
export default image;
