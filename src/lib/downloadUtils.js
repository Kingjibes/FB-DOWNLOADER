import { toast } from '@/components/ui/use-toast';

export const isValidHttpUrl = (string) => {
  if (!string) return false;
  let urlCheck;
  try {
    urlCheck = new URL(string);
  } catch (_) {
    return false;  
  }
  return urlCheck.protocol === "http:" || urlCheck.protocol === "https:";
};

export const triggerFileDownload = (fileUrl, fileName) => {
  if (!fileUrl || !isValidHttpUrl(fileUrl)) {
    toast({ title: "Download Error", description: "No valid URL found for this quality.", variant: "destructive" });
    return;
  }
  try {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({title: "🚀 Download Started", description: `Downloading ${fileName}`});
  } catch (e) {
     toast({ title: "Download Error", description: "Could not initiate download.", variant: "destructive" });
     console.error("File download initiation error:", e);
  }
};