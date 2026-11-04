import { generateObject } from "ai";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import pdf from "pdf-parse";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const resumeSchema = z.object({
  name: z.string().default(""),
  title: z.string().default(""),
  bio: z.string().default(""),
  linkedin: z.string().default(""),
  github: z.string().default(""),
  portfolio: z.string().default(""),
  skills: z.array(z.string()).default([]),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.type !== "application/pdf") {
      return NextResponse.json({ message: "Envie um arquivo PDF válido." }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: "O currículo deve ter no máximo 5MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parsedPdf = await pdf(buffer);
    const text = parsedPdf.text.replace(/\s+/g, " ").trim();

    if (text.length < 40) {
      return NextResponse.json(
        { message: "Não foi possível encontrar texto suficiente nesse PDF. Envie um currículo pesquisável." },
        { status: 422 },
      );
    }

    const extracted = await generateObject({
      model: "anthropic/claude-haiku-4.5",
      schema: resumeSchema,
      prompt: `Extraia os dados profissionais do currículo abaixo. Não invente informações. Use strings vazias quando um campo não estiver presente. Retorne no máximo 12 habilidades técnicas relevantes.\n\nCURRÍCULO:\n${text.slice(0, 30000)}`,
    });

    const upload = await cloudinary.uploader.upload(
      `data:application/pdf;base64,${buffer.toString("base64")}`,
      { folder: "techlink/resumes", resource_type: "raw" },
    );

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: extracted.object.name || undefined,
        title: extracted.object.title || undefined,
        bio: extracted.object.bio || undefined,
        linkedin: extracted.object.linkedin || undefined,
        github: extracted.object.github || undefined,
        portfolio: extracted.object.portfolio || undefined,
        skills: JSON.stringify(extracted.object.skills),
        resume: upload.secure_url,
      },
    });

    return NextResponse.json({
      message: "Currículo analisado com sucesso.",
      resumeFileName: file.name,
      profile: extracted.object,
    });
  } catch (error) {
    console.error("Erro ao analisar currículo:", error);
    return NextResponse.json({ message: "Não foi possível analisar o currículo agora." }, { status: 500 });
  }
}
