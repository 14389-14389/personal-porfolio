
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const AdminNavbar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account."
    });
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-40 bg-tech-blue border-b border-tech-lightBlue/50 px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/admin" className="text-tech-white font-bold text-xl">
            Portfolio Admin
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/admin" className="text-tech-slate hover:text-tech-highlight transition-colors">
            Dashboard
          </Link>
          <Link to="/admin/projects" className="text-tech-slate hover:text-tech-highlight transition-colors">
            Projects
          </Link>
          <Link to="/admin/experience" className="text-tech-slate hover:text-tech-highlight transition-colors">
            Experience
          </Link>
          <Link to="/admin/profile" className="text-tech-slate hover:text-tech-highlight transition-colors">
            Profile
          </Link>
          <Link to="/admin/messages" className="text-tech-slate hover:text-tech-highlight transition-colors">
            Messages
          </Link>
          <Link to="/" className="text-tech-slate hover:text-tech-highlight transition-colors">
            View Site
          </Link>
        </nav>
        
        <div className="flex items-center">
          <Button 
            variant="ghost"
            className="text-tech-white hover:text-tech-highlight"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
