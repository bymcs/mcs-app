import { NextResponse } from 'next/server';
import { minioClient, bucketName, allowedMimeTypes, maxFileSize, ensureBucket } from '@/lib/minio-client';

export async function POST(req: Request) {
    try {
        // Ensure bucket exists
        const bucketExists = await ensureBucket();
        if (!bucketExists) {
            return NextResponse.json(
                { error: 'Storage system not available' }, 
                { status: 503 }
            );
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;
        
        // Validation checks
        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' }, 
                { status: 400 }
            );
        }

        if (!allowedMimeTypes.includes(file.type)) {
            return NextResponse.json(
                { error: `File type not allowed.` },
                { status: 400 }
            );
        }

        if (file.size > maxFileSize) {
            return NextResponse.json(
                { error: 'File size exceeds limit' }, 
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${file.name}`;

        await minioClient.putObject(bucketName, fileName, buffer, buffer.length, {
            'Content-Type': file.type,
            'Content-Length': file.size,
        });

        return NextResponse.json({ 
            success: true, 
            fileName,
            size: file.size,
            type: file.type
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' }, 
            { status: 500 }
        );
    }
}
