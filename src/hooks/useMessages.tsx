
import { useState, useEffect } from "react";
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

export const useMessages = (user: any) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ read: true })
        .eq("id", messageId);
      
      if (error) throw error;
      
      setMessages(prevMessages => 
        prevMessages.map(m => 
          m.id === messageId ? { ...m, read: true } : m
        )
      );
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", messageId);
      
      if (error) throw error;
      
      setMessages(prevMessages => 
        prevMessages.filter(m => m.id !== messageId)
      );
      
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

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  return {
    messages,
    isLoading,
    markAsRead,
    deleteMessage,
    refetch: fetchMessages
  };
};
