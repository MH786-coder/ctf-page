import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const file = formData.get('file') as File;

        if (title && file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const zipName = `${title.toLowerCase().replace(/ /g, '-')}.zip`;
            const uploadDir = path.join(process.cwd(), 'public', 'challenges');
            const filePath = path.join(uploadDir, zipName);

            await fs.mkdir(uploadDir, { recursive: true });
            await fs.writeFile(filePath, buffer);

            return NextResponse.json({ success: true, zipPath: `/challenges/${zipName}` });
        }

        return NextResponse.json({ success: false, message: 'Missing title or file' }, { status: 400 });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
