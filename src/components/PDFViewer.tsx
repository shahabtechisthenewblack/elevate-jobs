import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ZoomIn, ZoomOut, Download } from 'lucide-react';

interface PDFViewerProps {
  file: File;
  onClose?: () => void;
}

const PDFViewer = ({ file, onClose }: PDFViewerProps) => {
  const [pdfUrl, setPdfUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPdfUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {file.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={downloadFile}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            {onClose && (
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden bg-background">
          <iframe
            src={pdfUrl}
            width="100%"
            height="600"
            className="border-0"
            title={file.name}
          />
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>File size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
          <p>Type: {file.type}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFViewer;