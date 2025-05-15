
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "Enterprise Resource Planning System",
    description: "A comprehensive ERP solution designed to streamline business operations. Features include inventory management, HR tools, and financial reporting dashboards.",
    technologies: ["React", "Node.js", "PostgreSQL", "Docker"],
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    links: {
      github: "#",
      live: "#"
    }
  },
  {
    title: "AI-Powered Analytics Platform",
    description: "A machine learning platform that analyzes business data to provide actionable insights. Built with scalability in mind to handle large datasets efficiently.",
    technologies: ["Python", "TensorFlow", "AWS", "React"],
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    links: {
      github: "#",
      live: "#"
    }
  },
  {
    title: "Secure Authentication Microservice",
    description: "A robust authentication service implementing OAuth 2.0 and JWT for secure user management across multiple applications.",
    technologies: ["Express.js", "MongoDB", "JWT", "Redis"],
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    links: {
      github: "#",
      live: "#"
    }
  }
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-20 px-4 md:px-8 bg-tech-lightBlue/30">
      <div className="container mx-auto">
        <div className="flex items-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-tech-white">
            <span className="text-tech-highlight font-mono">02.</span> My Projects
          </h2>
          <div className="h-px bg-tech-lightBlue flex-grow ml-4"></div>
        </div>

        <div className="space-y-20">
          {projects.map((project, index) => (
            <div 
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8`}
            >
              <div className="md:w-1/2 group">
                <div className="rounded-md overflow-hidden relative h-64 md:h-80">
                  <div className="absolute inset-0 bg-tech-highlight/20 group-hover:bg-transparent transition-all duration-300 z-10"></div>
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="md:w-1/2 flex flex-col justify-center">
                <p className="text-tech-highlight font-mono mb-2">Featured Project</p>
                <h3 className="text-2xl font-bold text-tech-white mb-4">{project.title}</h3>
                
                <div className="p-6 bg-tech-lightBlue rounded-md shadow-lg mb-4">
                  <p className="text-tech-slate">{project.description}</p>
                </div>
                
                <ul className="flex flex-wrap mb-4 text-tech-slate font-mono text-sm">
                  {project.technologies.map((tech, i) => (
                    <li key={i} className="mr-4 mb-2">{tech}</li>
                  ))}
                </ul>
                
                <div className="flex space-x-4">
                  <a 
                    href={project.links.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-tech-white hover:text-tech-highlight transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </a>
                  <a 
                    href={project.links.live} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-tech-white hover:text-tech-highlight transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button 
            className="bg-transparent hover:bg-tech-highlight/10 text-tech-highlight border border-tech-highlight"
          >
            View More Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
