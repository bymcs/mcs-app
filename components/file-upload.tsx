"use client"

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast" // Doğru import yolu
import { toast as toastify } from "react-hot-toast";


export function FileUpload() {
    const [files, setFiles] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const formData = new FormData(e.currentTarget);
            const fileInput = formData.get('file') as File;

            // File selection validation
            if (!fileInput || fileInput.size === 0) {
                toastify.error("Please select a file to upload");
                return;
            }

            // File size validation (example: 5MB limit)
            if (fileInput.size > 5 * 1024 * 1024) {
                toastify.error("File size exceeds the limit of 5MB");
                return;
            }

            setUploading(true);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            
            const data = await response.json();

            // Hata durumlarının kontrolü
            if (!response.ok)
                throw new Error(data.error || response.statusText);

            if (data.fileName) {
                setFiles(prev => [...prev, data.fileName]);
                toastify.success(`File "${data.fileName}" uploaded successfully`);

            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            toastify.error(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>File Upload</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <Input type="file" name="file" disabled={uploading} />
                    <Button type="submit" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                </form>
                {files.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-medium">Uploaded Files:</h3>
                        <ul className="list-disc pl-4">
                            {files.map((file, index) => (
                                <li key={index}>{file}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
        
    )
}
