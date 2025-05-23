
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import AdminNavbar from "@/components/AdminNavbar";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
};

const AdminMessages = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Could not load messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
    
    if (!message.read) {
      try {
        const { error } = await supabase
          .from("contact_messages")
          .update({ read: true })
          .eq("id", message.id);
        
        if (error) throw error;
        
        // Update local state
        setMessages(prevMessages => 
          prevMessages.map(m => 
            m.id === message.id ? { ...m, read: true } : m
          )
        );
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }
  };

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

  const deleteMessage = async () => {
    if (!selectedMessage) return;
    
    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", selectedMessage.id);
      
      if (error) throw error;
      
      setMessages(prevMessages => 
        prevMessages.filter(m => m.id !== selectedMessage.id)
      );
      
      setIsDialogOpen(false);
      setSelectedMessage(null);
      
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Error",
        description: "Could not delete message",
        variant: "destructive",
      });
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tech-blue">
        <p className="text-tech-white">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-tech-blue min-h-screen">
      <AdminNavbar />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-tech-white mb-8">Contact Messages</h1>
        
        {messages.length === 0 ? (
          <div className="bg-tech-lightBlue border border-tech-lightBlue/30 rounded-lg p-8 text-center">
            <p className="text-tech-white">No messages yet.</p>
          </div>
        ) : (
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
                        onClick={() => openMessage(message)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {selectedMessage && (
            <DialogContent className="bg-tech-lightBlue text-tech-white border-tech-lightBlue/30">
              <DialogHeader>
                <DialogTitle className="text-tech-white">{selectedMessage.subject}</DialogTitle>
                <DialogDescription className="text-tech-slate">
                  From {selectedMessage.name} ({selectedMessage.email})
                  <br/>
                  {formatDate(selectedMessage.created_at)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 border-t border-tech-lightBlue/30 pt-4">
                <p className="text-tech-white whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              
              <DialogFooter className="mt-6 gap-2">
                <Button
                  variant="destructive"
                  onClick={deleteMessage}
                >
                  Delete
                </Button>
                <Button
                  className="bg-tech-highlight text-tech-blue hover:bg-tech-highlight/80"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </main>
    </div>
  );
};

export default AdminMessages;
