import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const contentTypes: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;

  if (filename !== path.basename(filename)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = path.join(process.cwd(), "public", "uploads", "banner", filename);

  try {
    const file = await readFile(filePath);
    const contentType = contentTypes[path.extname(filename).toLowerCase()] ?? "application/octet-stream";
    return new NextResponse(file, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": contentType,
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
