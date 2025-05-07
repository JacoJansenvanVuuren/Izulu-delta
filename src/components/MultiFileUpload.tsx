
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileUp, X } from 'lucide-react';
import { uploadFile } from '@/services/clientService';
import { useToast } from '@/hooks/use-toast';

interface MultiFileUploadProps {
  onFileUpload: (file: File) => void;
  files: string[];
  onRemove: (index: number) => void;
  label: string;
}

const MultiFileUpload = ({ onFileUpload, files, onRemove, label }: MultiFileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        toast({
          title: 'Invalid File',
          description: 'Please upload a PDF file',
          variant: 'destructive'
        });
      }
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        setIsUploading(true);
        
        // Let the parent know about the file
        onFileUpload(selectedFile);
        
        setIsDialogOpen(false);
        setSelectedFile(null);
        
        toast({
          title: 'Success',
          description: 'File uploaded successfully',
        });
      } catch (error) {
        console.error('Error uploading file:', error);
        toast({
          title: 'Error',
          description: 'Failed to upload file',
          variant: 'destructive'
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {files.map((file, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-secondary/30">
            <a 
              href={file} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              PDF {index + 1}
            </a>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="ml-1 text-muted-foreground hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full">
            <FileUp className="mr-1 h-4 w-4" />
            {files.length > 0 ? 'Add Another PDF' : 'Upload PDF'}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50/5 transition-colors cursor-pointer" onClick={() => document.getElementById('multi-file-upload')?.click()}>
              <input
                id="multi-file-upload"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <FileUp size={24} />
                <p className="text-sm font-medium">
                  {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-muted-foreground">PDF (max. 10MB)</p>
              </div>
            </div>
            
            <Button
              type="button"
              disabled={!selectedFile || isUploading}
              onClick={handleUpload}
            >
              {isUploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MultiFileUpload;
