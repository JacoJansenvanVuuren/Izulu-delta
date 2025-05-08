
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileUp } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  label: string;
  fileUrl?: string;
}

const FileUpload = ({ onFileUpload, label, fileUrl }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
      setIsDialogOpen(false);
      setSelectedFile(null);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <FileUp className="mr-1 h-4 w-4" />
          {fileUrl ? 'View/Replace PDF' : 'Upload PDF'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        
        {fileUrl && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Currently uploaded file:</p>
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline flex items-center"
            >
              <FileUp className="mr-1 h-4 w-4" />
              View PDF
            </a>
          </div>
        )}
        
        <div className="grid gap-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50/5 transition-colors cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
            <input
              id="file-upload"
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
            disabled={!selectedFile}
            onClick={handleUpload}
          >
            {fileUrl ? 'Replace File' : 'Upload File'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUpload;
