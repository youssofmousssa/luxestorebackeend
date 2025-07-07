import { uploadImageToImgBB } from '../services/imgbbService.js';

// POST /api/upload/imgbb
export async function uploadImage(req, res, next) {
  try {
    const { base64Image } = req.body;

    if (!base64Image) return res.status(400).json({ error: 'base64Image required' });

    const imageUrl = await uploadImageToImgBB(base64Image);

    res.json({ imageUrl });
  } catch (err) {
    next(err);
  }
}
