import imagelogin from "./imageLogin.jpg";
import { StaticImageData } from 'next/image';
import videoAndImage from "./photos-video.png"
import attachment from "./attachment.png"
import logo from "./logo.png";
import coverPhoto from "./coverPhoto1jpg.jpg"

interface IImage {
  [key: string]: string | StaticImageData;
}
const image: IImage = {
  imagelogin,
  logo,
  videoAndImage,
  attachment,
  coverPhoto
};
export default image;
