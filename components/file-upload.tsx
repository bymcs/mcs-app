"use client"

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, Upload, FileIcon } from "lucide-react"
import toast from 'react-hot-toast'
import { cn } from "@/lib/utils"

interface UploadedFile {
    name: string;
    size: number;
    type: string;
    progress: number;
}

export function FileUpload() {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        
        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            handleFiles(selectedFiles);
        }
    };

    const handleFiles = async (selectedFiles: File[]) => {
        for (const file of selectedFiles) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} exceeds the 5MB limit`);
                continue;
            }

            setUploading(true);
            const newFile: UploadedFile = {
                name: file.name,
                size: file.size,
                type: file.type,
                progress: 0,
            };

            setFiles(prev => [...prev, newFile]);

            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || response.statusText);
                }

                setFiles(prev => 
                    prev.map(f => 
                        f.name === file.name 
                            ? { ...f, progress: 100 } 
                            : f
                    )
                );

                toast.success(`${file.name} uploaded successfully`);

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Upload failed';
                toast.error(errorMessage);

                setFiles(prev => prev.filter(f => f.name !== file.name));
            }
        }
        setUploading(false);
    };

    const removeFile = (fileName: string) => {
        setFiles(prev => prev.filter(file => file.name !== fileName));
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>File Upload</CardTitle>
            </CardHeader>
            <CardContent>
                <div
                    className={cn(
                        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer",
                        isDragging ? "border-primary bg-primary/10" : "border-muted",
                        uploading && "pointer-events-none opacity-60"
                    )}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                >
                    <Input
                        type="file"
                        className="hidden"
                        onChange={handleFileInput}
                        disabled={uploading}
                        multiple
                    />
                    <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            Drag & drop files here, or click to select files
                        </p>
                    </div>
                </div>

                {files.length > 0 && (
                    <div className="mt-6 space-y-4">
                        {files.map((file) => (
                            <div
                                key={file.name}
                                className="flex items-center gap-4 rounded-lg border p-4"
                            >
                                <FileIcon className="h-8 w-8 text-muted-foreground" />
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                    <Progress value={file.progress} className="h-1" />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFile(file.name)}
                                    disabled={uploading}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}