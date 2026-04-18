import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();

    let finalImageUrl = body.image;
    let finalResumeUrl = body.resume;

    // Se for base64 (começa com data:image ou data:application), fazer upload
    if (finalImageUrl && finalImageUrl.startsWith("data:")) {
      const uploadRes = await cloudinary.uploader.upload(finalImageUrl, {
        folder: "devjobs/profiles",
      });
      finalImageUrl = uploadRes.secure_url;
    }

    if (finalResumeUrl && finalResumeUrl.startsWith("data:")) {
      const uploadRes = await cloudinary.uploader.upload(finalResumeUrl, {
        folder: "devjobs/resumes",
        resource_type: "auto",
      });
      finalResumeUrl = uploadRes.secure_url;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: body.name,
        title: body.title,
        bio: body.bio,
        linkedin: body.linkedin,
        github: body.github,
        portfolio: body.portfolio,
        skills: body.skills ? JSON.stringify(body.skills) : undefined,
        resume: finalResumeUrl,
        image: finalImageUrl,
        companyName: body.companyName,
        companySite: body.companySite,
        companySize: body.companySize,
        companyAbout: body.companyAbout,
      },
    });

    return NextResponse.json({ message: "Perfil atualizado com sucesso!" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json({ message: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        title: true,
        bio: true,
        linkedin: true,
        github: true,
        portfolio: true,
        skills: true,
        resume: true,
        image: true,
        companyName: true,
        companySite: true,
        companySize: true,
        companyAbout: true,
      }
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return NextResponse.json({ message: "Erro interno no servidor" }, { status: 500 });
  }
}
