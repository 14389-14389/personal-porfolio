
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Slider } from "@/components/ui/slider";
import AdminNavbar from "@/components/AdminNavbar";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";

const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.string().min(1, "Category is required"),
  proficiency_level: z.number().min(1).max(5)
});

type SkillFormValues = z.infer<typeof skillSchema>;

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency_level: number;
  created_at: string;
}

const AdminSkills = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      category: "",
      proficiency_level: 3
    }
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchSkills();
    }
  }, [user]);

  useEffect(() => {
    if (currentSkill) {
      form.reset({
        name: currentSkill.name,
        category: currentSkill.category,
        proficiency_level: currentSkill.proficiency_level
      });
    } else {
      form.reset({
        name: "",
        category: categories.length > 0 ? categories[0] : "",
        proficiency_level: 3
      });
    }
  }, [currentSkill, categories, form]);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("category");
      
      if (error) throw error;
      
      setSkills(data || []);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data?.map(skill => skill.category) || []));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast({
        title: "Error",
        description: "Could not load skills data.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: SkillFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const skillData = {
        name: values.name,
        category: values.category,
        proficiency_level: values.proficiency_level,
        user_id: user.id,
      };

      let error;

      if (currentSkill) {
        // Update existing skill
        const { error: updateError } = await supabase
          .from("skills")
          .update(skillData)
          .eq("id", currentSkill.id);
          
        error = updateError;
      } else {
        // Insert new skill
        const { error: insertError } = await supabase
          .from("skills")
          .insert(skillData);
          
        error = insertError;
      }
      
      if (error) throw error;
      
      toast({
        title: currentSkill ? "Skill updated" : "Skill added",
        description: currentSkill 
          ? "Your skill has been updated successfully." 
          : "Your skill has been added successfully.",
      });
      
      await fetchSkills();
      setIsDialogOpen(false);
      setCurrentSkill(null);
    } catch (error) {
      console.error("Error saving skill:", error);
      toast({
        title: "Error",
        description: "Failed to save skill.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNew = () => {
    setCurrentSkill(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (skill: Skill) => {
    setCurrentSkill(skill);
    setIsDialogOpen(true);
  };

  const handleDelete = (skill: Skill) => {
    setSkillToDelete(skill);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!skillToDelete) return;
    
    try {
      const { error } = await supabase
        .from("skills")
        .delete()
        .eq("id", skillToDelete.id);
      
      if (error) throw error;
      
      toast({
        title: "Skill deleted",
        description: "The skill has been deleted successfully.",
      });
      
      await fetchSkills();
      setDeleteDialogOpen(false);
      setSkillToDelete(null);
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast({
        title: "Error",
        description: "Failed to delete skill.",
        variant: "destructive",
      });
    }
  };

  const getProficiencyLabel = (level: number) => {
    switch (level) {
      case 1: return "Beginner";
      case 2: return "Elementary";
      case 3: return "Intermediate";
      case 4: return "Advanced";
      case 5: return "Expert";
      default: return "Intermediate";
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

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
          <h1 className="text-3xl font-bold text-tech-white">Skills</h1>
          <Button 
            className="bg-tech-highlight text-tech-blue hover:bg-tech-highlight/80"
            onClick={handleAddNew}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Skill
          </Button>
        </div>
        
        {Object.keys(groupedSkills).length === 0 ? (
          <div className="bg-tech-lightBlue border border-tech-lightBlue/30 rounded-lg p-8 text-center">
            <p className="text-tech-white">No skills added yet. Click "Add Skill" to get started.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category} className="bg-tech-lightBlue border border-tech-lightBlue/30 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-tech-lightBlue/30">
                  <h2 className="text-xl font-semibold text-tech-white">{category}</h2>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-tech-white">Skill</TableHead>
                      <TableHead className="text-tech-white w-1/3">Proficiency</TableHead>
                      <TableHead className="text-tech-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categorySkills.map((skill) => (
                      <TableRow key={skill.id}>
                        <TableCell className="font-medium text-tech-white">
                          {skill.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="w-full bg-tech-blue/50 rounded-full h-2.5">
                              <div 
                                className="bg-tech-highlight h-2.5 rounded-full" 
                                style={{ width: `${(skill.proficiency_level / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-tech-slate whitespace-nowrap text-sm">
                              {getProficiencyLabel(skill.proficiency_level)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost"
                              size="icon"
                              className="text-tech-slate hover:text-tech-highlight"
                              onClick={() => handleEdit(skill)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost"
                              size="icon"
                              className="text-tech-slate hover:text-red-500"
                              onClick={() => handleDelete(skill)}
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
            ))}
          </div>
        )}
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-tech-lightBlue text-tech-white border-tech-lightBlue/30 sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-tech-white">
                {currentSkill ? "Edit Skill" : "Add Skill"}
              </DialogTitle>
              <DialogDescription className="text-tech-slate">
                {currentSkill 
                  ? "Update your skill information." 
                  : "Add a new skill to your profile."}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-tech-white">Skill Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. React, Python, UI Design" 
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-tech-white">Category</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-tech-blue text-tech-white border-tech-lightBlue/50">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-tech-blue text-tech-white border-tech-lightBlue/50">
                          {/* Show existing categories */}
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                          {/* New category input option */}
                          <div className="p-2 border-t border-tech-lightBlue/20 mt-2">
                            <Input
                              placeholder="Or type new category..."
                              className="bg-tech-blue text-tech-white border-tech-lightBlue/50"
                              onChange={(e) => field.onChange(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="proficiency_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-tech-white">
                        Proficiency Level: {getProficiencyLabel(field.value)}
                      </FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          defaultValue={[field.value]}
                          onValueChange={(values) => field.onChange(values[0])}
                          className="[&_[role=slider]]:bg-tech-highlight"
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-tech-slate mt-1">
                        <span>Beginner</span>
                        <span>Intermediate</span>
                        <span>Expert</span>
                      </div>
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
                Are you sure you want to delete the skill{" "}
                <span className="text-tech-white font-semibold">
                  {skillToDelete?.name}
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

export default AdminSkills;
