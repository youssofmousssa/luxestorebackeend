import fetch from 'node-fetch';

const IMGBB_API_KEY = process.env.IMGBB_API_KEY;
const IMGBB_UPLOAD_URL = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;

export async function uploadImageToImgBB(base64Image) {
  try {
    const formData = new URLSearchParams();
    formData.append('image', base64Image);

    const response = await fetch(IMGBB_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error.message || 'ImgBB upload failed');
    }

    return data.data.url;
  } catch (error) {
    throw new Error('Image upload failed: ' + error.message);
  }
}
