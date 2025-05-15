
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center pt-20 px-4 md:px-8">
      <div className="container mx-auto">
        <div 
          className="animate-fade-in [animation-delay:200ms] opacity-0"
          style={{ animationFillMode: 'forwards' }}
        >
          <p className="text-tech-highlight font-mono mb-5">Hi, my name is</p>
        </div>
        
        <div 
          className="animate-fade-in [animation-delay:400ms] opacity-0" 
          style={{ animationFillMode: 'forwards' }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-tech-white mb-4">
            John Doe.
          </h1>
        </div>
        
        <div 
          className="animate-fade-in [animation-delay:600ms] opacity-0"
          style={{ animationFillMode: 'forwards' }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-tech-slate mb-8">
            I build things for the web.
          </h2>
        </div>
        
        <div 
          className="animate-fade-in [animation-delay:800ms] opacity-0 max-w-xl"
          style={{ animationFillMode: 'forwards' }}
        >
          <p className="text-tech-slate text-lg mb-12">
            I'm a software engineer specializing in building exceptional digital experiences. 
            Currently, I'm focused on building accessible, human-centered products.
          </p>
        </div>
        
        <div 
          className="animate-fade-in [animation-delay:1000ms] opacity-0"
          style={{ animationFillMode: 'forwards' }}
        >
          <Button 
            className="bg-transparent hover:bg-tech-highlight/10 text-tech-highlight border border-tech-highlight px-7 py-5 text-lg"
          >
            Check out my work
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
