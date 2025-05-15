
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminNavbar from "@/components/AdminNavbar";
import useAuth from "@/hooks/useAuth";

const Admin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

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
        <h1 className="text-3xl font-bold text-tech-white mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-tech-lightBlue border-tech-lightBlue/30 text-tech-white">
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription className="text-tech-slate">
                Manage your portfolio projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button 
                onClick={() => navigate("/admin/projects")}
                className="text-tech-highlight hover:underline"
              >
                Edit Projects →
              </button>
            </CardContent>
          </Card>
          
          <Card className="bg-tech-lightBlue border-tech-lightBlue/30 text-tech-white">
            <CardHeader>
              <CardTitle>Experience</CardTitle>
              <CardDescription className="text-tech-slate">
                Manage your work experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button 
                onClick={() => navigate("/admin/experience")}
                className="text-tech-highlight hover:underline"
              >
                Edit Experience →
              </button>
            </CardContent>
          </Card>
          
          <Card className="bg-tech-lightBlue border-tech-lightBlue/30 text-tech-white">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription className="text-tech-slate">
                Edit your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button 
                onClick={() => navigate("/admin/profile")}
                className="text-tech-highlight hover:underline"
              >
                Edit Profile →
              </button>
            </CardContent>
          </Card>

          <Card className="bg-tech-lightBlue border-tech-lightBlue/30 text-tech-white">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription className="text-tech-slate">
                View contact form submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button 
                onClick={() => navigate("/admin/messages")}
                className="text-tech-highlight hover:underline"
              >
                View Messages →
              </button>
            </CardContent>
          </Card>

          <Card className="bg-tech-lightBlue border-tech-lightBlue/30 text-tech-white">
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription className="text-tech-slate">
                Manage your skills and categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button 
                onClick={() => navigate("/admin/skills")}
                className="text-tech-highlight hover:underline"
              >
                Edit Skills →
              </button>
            </CardContent>
          </Card>

          <Card className="bg-tech-lightBlue border-tech-lightBlue/30 text-tech-white">
            <CardHeader>
              <CardTitle>Education</CardTitle>
              <CardDescription className="text-tech-slate">
                Manage your education history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button 
                onClick={() => navigate("/admin/education")}
                className="text-tech-highlight hover:underline"
              >
                Edit Education →
              </button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;
