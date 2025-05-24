
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "@/components/AdminNavbar";
import MessageTable from "@/components/admin/MessageTable";
import MessageDialog from "@/components/admin/MessageDialog";
import useAuth from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";

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
  const { messages, isLoading, markAsRead, deleteMessage } = useMessages(user);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const openMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
    
    if (!message.read) {
      await markAsRead(message.id);
    }
  };

  const handleDeleteMessage = async () => {
    if (!selectedMessage) return;
    
    await deleteMessage(selectedMessage.id);
    setIsDialogOpen(false);
    setSelectedMessage(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMessage(null);
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
        
        <MessageTable 
          messages={messages}
          onViewMessage={openMessage}
        />
        
        <MessageDialog
          message={selectedMessage}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onDelete={handleDeleteMessage}
        />
      </main>
    </div>
  );
};

export default AdminMessages;
