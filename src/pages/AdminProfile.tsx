
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import AdminNavbar from "@/components/AdminNavbar";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  title: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
  github_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  linkedin_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  website_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const AdminProfile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      title: "",
      bio: "",
      location: "",
      email: "",
      phone: "",
      github_url: "",
      linkedin_url: "",
      website_url: "",
    }
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Remove null values so they don't override form defaults
        Object.keys(data).forEach(key => {
          if (data[key] === null) {
            delete data[key];
          }
        });
        
        form.reset(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          user_id: user.id,
          ...values,
          updated_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
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
        <h1 className="text-3xl font-bold text-tech-white mb-8">Edit Profile</h1>
        
        <Card className="bg-tech-lightBlue border-tech-lightBlue/30">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-tech-white">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Kevin Muli" 
                            className="bg-tech-blue text-tech-white border-tech-lightBlue/50" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-tech-white">Professional Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Software Engineer" 
                            className="bg-tech-blue text-tech-white border-tech-lightBlue/50" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-tech-white">Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write a brief bio about yourself..." 
                          className="bg-tech-blue text-tech-white border-tech-lightBlue/50 min-h-[150px]" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-tech-white">Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="youremail@example.com" 
                            className="bg-tech-blue text-tech-white border-tech-lightBlue/50" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-tech-white">Phone</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+1 234 567 8900" 
                            className="bg-tech-blue text-tech-white border-tech-lightBlue/50" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-tech-white">Location</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="City, Country" 
                            className="bg-tech-blue text-tech-white border-tech-lightBlue/50" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="github_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-tech-white">GitHub URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://github.com/yourusername" 
                            className="bg-tech-blue text-tech-white border-tech-lightBlue/50" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="linkedin_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-tech-white">LinkedIn URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://linkedin.com/in/yourusername" 
                            className="bg-tech-blue text-tech-white border-tech-lightBlue/50" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="website_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-tech-white">Personal Website URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://yourwebsite.com" 
                            className="bg-tech-blue text-tech-white border-tech-lightBlue/50" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-tech-highlight text-tech-blue hover:bg-tech-highlight/80"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminProfile;
