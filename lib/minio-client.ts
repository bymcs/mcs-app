import * as Minio from 'minio';

export const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
});

export const bucketName = 'test-bucket';

export const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/bmp',
    'image/tiff',
    'image/jpg',
    'image/webp',
    'image/gif',
    'application/pdf',
    'text/plain'
];


export const maxFileSize = 1000 * 1024 * 1024;

export async function ensureBucket() {
    try {
        const exists = await minioClient.bucketExists(bucketName);
        if (!exists) {
            await minioClient.makeBucket(bucketName, 'us-east-1');
            // Set bucket policy for public read if needed
            // await minioClient.setBucketPolicy(bucketName, publicPolicy);
        }
        return true;
    } catch (error) {
        console.error('Error ensuring bucket exists:', error);
        return false;
    }
}
