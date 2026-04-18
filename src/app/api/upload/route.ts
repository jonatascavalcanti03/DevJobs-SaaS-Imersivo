import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { base64Image, folder } = await req.json();

    if (!base64Image) {
      return NextResponse.json({ message: "Imagem não fornecida" }, { status: 400 });
    }

    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: folder || "devjobs",
      resource_type: "auto", // Aceita imagens e PDFs (raw)
    });

    return NextResponse.json({ url: uploadResponse.secure_url }, { status: 200 });
  } catch (error: any) {
    console.error("Erro no upload para o Cloudinary:", error);
    return NextResponse.json({ message: error.message || "Erro interno no upload" }, { status: 500 });
  }
}
