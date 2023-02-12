import { generateRandomString } from '../ApiServices';

async function downloadImage(imageSrc: string) {
  const image = await fetch(imageSrc);
  const imageBlog = await image.blob();
  const imageURL = URL.createObjectURL(imageBlog);
  const link = document.createElement('a');
  link.href = imageURL;
  link.download = generateRandomString(8);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export { downloadImage };
