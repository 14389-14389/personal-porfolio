
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
};

interface MessageTableProps {
  messages: ContactMessage[];
  onViewMessage: (message: ContactMessage) => void;
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

const MessageTable = ({ messages, onViewMessage }: MessageTableProps) => {
  if (messages.length === 0) {
    return (
      <div className="bg-tech-lightBlue border border-tech-lightBlue/30 rounded-lg p-8 text-center">
        <p className="text-tech-white">No messages yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-tech-lightBlue border border-tech-lightBlue/30 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-tech-white">Status</TableHead>
            <TableHead className="text-tech-white">From</TableHead>
            <TableHead className="text-tech-white">Subject</TableHead>
            <TableHead className="text-tech-white">Date</TableHead>
            <TableHead className="text-tech-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id}>
              <TableCell>
                {message.read ? (
                  <Badge variant="outline" className="text-tech-slate border-tech-slate">
                    Read
                  </Badge>
                ) : (
                  <Badge className="bg-tech-highlight text-tech-blue">
                    New
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-tech-white">
                {message.name}<br/>
                <span className="text-tech-slate text-sm">{message.email}</span>
              </TableCell>
              <TableCell className="text-tech-white">
                {message.subject}
              </TableCell>
              <TableCell className="text-tech-slate">
                {formatDate(message.created_at)}
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  className="text-tech-highlight hover:text-tech-highlight/80"
                  onClick={() => onViewMessage(message)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MessageTable;
