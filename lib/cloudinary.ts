import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadFotoAlebrije(
  file: Buffer,
  alebrijeSlug: string
): Promise<{ url: string; urlThumb: string }> {
  const result = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `alebrijes/${alebrijeSlug}`,
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(file);
  });

  // Generar thumbnail 400px
  const urlThumb = cloudinary.url(result.public_id, {
    width: 400,
    height: 533,
    crop: "fill",
    quality: "auto",
    fetch_format: "auto",
  });

  return { url: result.secure_url, urlThumb };
}

export { cloudinary };
