
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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AdminNavbar from "@/components/AdminNavbar";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";

const educationSchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  field_of_study: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  is_current: z.boolean().default(false),
  description: z.string().optional()
});

type EducationFormValues = z.infer<typeof educationSchema>;

interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
  created_at: string;
}

const AdminEducation = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [educations, setEducations] = useState<Education[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEducation, setCurrentEducation] = useState<Education | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [educationToDelete, setEducationToDelete] = useState<Education | null>(null);

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: ""
    }
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchEducation();
    }
  }, [user]);

  useEffect(() => {
    if (currentEducation) {
      form.reset({
        institution: currentEducation.institution,
        degree: currentEducation.degree,
        field_of_study: currentEducation.field_of_study || "",
        start_date: currentEducation.start_date ? formatDateForInput(currentEducation.start_date) : "",
        end_date: currentEducation.end_date ? formatDateForInput(currentEducation.end_date) : "",
        is_current: currentEducation.is_current || false,
        description: currentEducation.description || ""
      });
    } else {
      form.reset({
        institution: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
        is_current: false,
        description: ""
      });
    }
  }, [currentEducation, form]);

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const formatDateForDisplay = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const fetchEducation = async () => {
    try {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("start_date", { ascending: false });
      
      if (error) throw error;
      
      setEducations(data || []);
    } catch (error) {
      console.error("Error fetching education:", error);
      toast({
        title: "Error",
        description: "Could not load education data.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: EducationFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const educationData = {
        ...values,
        user_id: user.id,
        end_date: values.is_current ? null : values.end_date
      };

      let error;

      if (currentEducation) {
        // Update existing education
        const { error: updateError } = await supabase
          .from("education")
          .update(educationData)
          .eq("id", currentEducation.id);
          
        error = updateError;
      } else {
        // Insert new education
        const { error: insertError } = await supabase
          .from("education")
          .insert(educationData);
          
        error = insertError;
      }
      
      if (error) throw error;
      
      toast({
        title: currentEducation ? "Education updated" : "Education added",
        description: currentEducation 
          ? "Your education has been updated successfully." 
          : "Your education has been added successfully.",
      });
      
      await fetchEducation();
      setIsDialogOpen(false);
      setCurrentEducation(null);
    } catch (error) {
      console.error("Error saving education:", error);
      toast({
        title: "Error",
        description: "Failed to save education.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNew = () => {
    setCurrentEducation(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (education: Education) => {
    setCurrentEducation(education);
    setIsDialogOpen(true);
  };

  const handleDelete = (education: Education) => {
    setEducationToDelete(education);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!educationToDelete) return;
    
    try {
      const { error } = await supabase
        .from("education")
        .delete()
        .eq("id", educationToDelete.id);
      
      if (error) throw error;
      
      toast({
        title: "Education deleted",
        description: "The education entry has been deleted successfully.",
      });
      
      await fetchEducation();
      setDeleteDialogOpen(false);
      setEducationToDelete(null);
    } catch (error) {
      console.error("Error deleting education:", error);
      toast({
        title: "Error",
        description: "Failed to delete education.",
        variant: "destructive",
      });
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-tech-white">Education</h1>
          <Button 
            className="bg-tech-highlight text-tech-blue hover:bg-tech-highlight/80"
            onClick={handleAddNew}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Education
          </Button>
        </div>
        
        {educations.length === 0 ? (
          <div className="bg-tech-lightBlue border border-tech-lightBlue/30 rounded-lg p-8 text-center">
            <p className="text-tech-white">No education entries yet. Click "Add Education" to get started.</p>
          </div>
        ) : (
          <div className="bg-tech-lightBlue border border-tech-lightBlue/30 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-tech-white">Institution</TableHead>
                  <TableHead className="text-tech-white">Degree</TableHead>
                  <TableHead className="text-tech-white">Period</TableHead>
                  <TableHead className="text-tech-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {educations.map((education) => (
                  <TableRow key={education.id}>
                    <TableCell className="font-medium text-tech-white">
                      {education.institution}
                    </TableCell>
                    <TableCell className="text-tech-white">
                      {education.degree}
                      {education.field_of_study && (
                        <div className="text-sm text-tech-slate">
                          {education.field_of_study}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-tech-slate">
                      {formatDateForDisplay(education.start_date)} - {' '}
                      {education.is_current ? (
                        <span className="text-tech-highlight">Present</span>
                      ) : education.end_date ? (
                        formatDateForDisplay(education.end_date)
                      ) : ''}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost"
                          size="icon"
                          className="text-tech-slate hover:text-tech-highlight"
                          onClick={() => handleEdit(education)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost"
                          size="icon"
                          className="text-tech-slate hover:text-red-500"
                          onClick={() => handleDelete(education)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-tech-lightBlue text-tech-white border-tech-lightBlue/30 sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-tech-white">
                {currentEducation ? "Edit Education" : "Add Education"}
              </DialogTitle>
              <DialogDescription className="text-tech-slate">
                {currentEducation 
                  ? "Update your education details." 
                  : "Add a new education entry to your profile."}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="institution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-tech-white">Institution</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="University or school name" 
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
                    name="degree"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-tech-white">Degree</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Bachelor of Science" 
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
                    name="field_of_study"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-tech-white">Field of Study</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Computer Science" 
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
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-tech-white">Start Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date"
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
                    name="is_current"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0 pt-6">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-tech-highlight"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-tech-white">
                            Currently studying here
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {!form.watch("is_current") && (
                    <FormField
                      control={form.control}
                      name="end_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-tech-white">End Date</FormLabel>
                          <FormControl>
                            <Input 
                              type="date"
                              className="bg-tech-blue text-tech-white border-tech-lightBlue/50" 
                              {...field} 
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-tech-white">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your studies, achievements, etc." 
                          className="bg-tech-blue text-tech-white border-tech-lightBlue/50 min-h-[150px]" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline"
                    className="border-tech-slate text-tech-slate hover:bg-tech-blue hover:text-tech-white"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-tech-highlight text-tech-blue hover:bg-tech-highlight/80"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="bg-tech-lightBlue text-tech-white border-tech-lightBlue/30">
            <DialogHeader>
              <DialogTitle className="text-tech-white">Confirm Deletion</DialogTitle>
              <DialogDescription className="text-tech-slate">
                Are you sure you want to delete your education at{" "}
                <span className="text-tech-white font-semibold">
                  {educationToDelete?.institution}
                </span>
                ? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline"
                className="border-tech-slate text-tech-slate hover:bg-tech-blue hover:text-tech-white"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="destructive"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminEducation;
