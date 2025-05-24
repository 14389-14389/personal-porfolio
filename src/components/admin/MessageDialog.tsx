
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
};

interface MessageDialogProps {
  message: ContactMessage | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const MessageDialog = ({ message, isOpen, onClose, onDelete }: MessageDialogProps) => {
  if (!message) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-tech-lightBlue text-tech-white border-tech-lightBlue/30">
        <DialogHeader>
          <DialogTitle className="text-tech-white">{message.subject}</DialogTitle>
          <DialogDescription className="text-tech-slate">
            From {message.name} ({message.email})
            <br/>
            {formatDate(message.created_at)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 border-t border-tech-lightBlue/30 pt-4">
          <p className="text-tech-white whitespace-pre-wrap">{message.message}</p>
        </div>
        
        <DialogFooter className="mt-6 gap-2">
          <Button
            variant="destructive"
            onClick={onDelete}
          >
            Delete
          </Button>
          <Button
            className="bg-tech-highlight text-tech-blue hover:bg-tech-highlight/80"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;
