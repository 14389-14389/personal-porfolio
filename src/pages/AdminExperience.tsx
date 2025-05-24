
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
  DialogTitle, 
  DialogTrigger
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

const experienceSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  location: z.string().optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  is_current: z.boolean().default(false),
  description: z.string().optional(),
  technologies: z.string().optional()
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
  technologies?: string[];
  created_at: string;
}

const AdminExperience = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<Experience | null>(null);

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: "",
      position: "",
      location: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
      technologies: "",
    }
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchExperiences();
    }
  }, [user]);

  useEffect(() => {
    if (currentExperience) {
      form.reset({
        company: currentExperience.company,
        position: currentExperience.position,
        location: currentExperience.location || "",
        start_date: formatDateForInput(currentExperience.start_date),
        end_date: currentExperience.end_date ? formatDateForInput(currentExperience.end_date) : "",
        is_current: currentExperience.is_current || false,
        description: currentExperience.description || "",
        technologies: currentExperience.technologies ? currentExperience.technologies.join(", ") : "",
      });
    } else {
      form.reset({
        company: "",
        position: "",
        location: "",
        start_date: "",
        end_date: "",
        is_current: false,
        description: "",
        technologies: "",
      });
    }
  }, [currentExperience, form]);

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("start_date", { ascending: false });
      
      if (error) throw error;
      
      setExperiences(data || []);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      toast({
        title: "Error",
        description: "Could not load experiences.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: ExperienceFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const technologiesArray = values.technologies 
        ? values.technologies.split(',').map(tech => tech.trim()) 
        : [];

      const experienceData = {
        company: values.company,
        position: values.position,
        location: values.location || null,
        start_date: values.start_date,
        end_date: values.is_current ? null : (values.end_date || null),
        is_current: values.is_current,
        description: values.description || null,
        technologies: technologiesArray,
        user_id: user.id,
      };

      let error;

      if (currentExperience) {
        // Update existing experience
        const { error: updateError } = await supabase
          .from("experience")
          .update(experienceData)
          .eq("id", currentExperience.id);
          
        error = updateError;
      } else {
        // Insert new experience
        const { error: insertError } = await supabase
          .from("experience")
          .insert(experienceData);
          
        error = insertError;
      }
      
      if (error) throw error;
      
      toast({
        title: currentExperience ? "Experience updated" : "Experience added",
        description: currentExperience 
          ? "Your experience has been updated successfully." 
          : "Your experience has been added successfully.",
      });
      
      await fetchExperiences();
      setIsDialogOpen(false);
      setCurrentExperience(null);
    } catch (error) {
      console.error("Error saving experience:", error);
      toast({
        title: "Error",
        description: "Failed to save experience.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNew = () => {
    setCurrentExperience(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (experience: Experience) => {
    setCurrentExperience(experience);
    setIsDialogOpen(true);
  };

  const handleDelete = (experience: Experience) => {
    setExperienceToDelete(experience);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!experienceToDelete) return;
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from("experience")
        .delete()
        .eq("id", experienceToDelete.id);
      
      if (error) throw error;
      
      toast({
        title: "Experience deleted",
        description: "Your experience has been deleted successfully.",
      });
      
      await fetchExperiences();
      setDeleteDialogOpen(false);
      setExperienceToDelete(null);
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast({
        title: "Error",
        description: "Failed to delete experience.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
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
          <h1 className="text-3xl font-bold text-tech-white">Work Experience</h1>
          <Button 
            className="bg-tech-highlight text-tech-blue hover:bg-tech-highlight/80"
            onClick={handleAddNew}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Experience
          </Button>
        </div>
        
        {experiences.length === 0 ? (
          <div className="bg-tech-lightBlue border border-tech-lightBlue/30 rounded-lg p-8 text-center">
            <p className="text-tech-white">No work experience added yet. Click "Add Experience" to get started.</p>
          </div>
        ) : (
          <div className="bg-tech-lightBlue border border-tech-lightBlue/30 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-tech-white">Company</TableHead>
                  <TableHead className="text-tech-white">Position</TableHead>
                  <TableHead className="text-tech-white">Period</TableHead>
                  <TableHead className="text-tech-white">Technologies</TableHead>
                  <TableHead className="text-tech-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {experiences.map((experience) => (
                  <TableRow key={experience.id}>
                    <TableCell className="font-medium text-tech-white">
                      {experience.company}
                      {experience.location ? (
                        <div className="text-sm text-tech-slate">{experience.location}</div>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-tech-white">{experience.position}</TableCell>
                    <TableCell className="text-tech-slate">
                      {formatDateForDisplay(experience.start_date)} - {' '}
                      {experience.is_current ? (
                        <span className="text-tech-highlight">Present</span>
                      ) : experience.end_date ? (
                        formatDateForDisplay(experience.end_date)
                      ) : ''}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {experience.technologies?.map((tech, index) => (
                          <Badge 
                            key={index} 
                            className="bg-tech-blue text-tech-highlight border border-tech-highlight"
                          >
                            {tech}
                          </Badge>
                        )).slice(0, 3)}
                        {experience.technologies && experience.technologies.length > 3 && (
                          <Badge className="bg-tech-blue text-tech-slate border border-tech-slate">
                            +{experience.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost"
                          size="icon"
                          className="text-tech-slate hover:text-tech-highlight"
                          onClick={() => handleEdit(experience)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost"
                          size="icon"
                          className="text-tech-slate hover:text-red-500"
                          onClick={() => handleDelete(experience)}
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
                {currentExperience ? "Edit Experience" : "Add Experience"}
              </DialogTitle>
              <DialogDescription className="text-tech-slate">
                {currentExperience 
                  ? "Update your work experience details." 
                  : "Add a new work experience to your profile."}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-tech-white">Company</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Company name" 
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
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-tech-white">Position</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Job title" 
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
                            Currently working here
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

                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="technologies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-tech-white">Technologies</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="React, Node.js, TypeScript (comma separated)" 
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
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-tech-white">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your role and responsibilities..." 
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
                Are you sure you want to delete your experience at{" "}
                <span className="text-tech-white font-semibold">
                  {experienceToDelete?.company}
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
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminExperience;
