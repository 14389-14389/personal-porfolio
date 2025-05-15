
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 px-4 md:px-8",
        scrolled ? "bg-tech-blue/90 backdrop-blur shadow-md py-2" : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <a href="#" className="text-tech-highlight font-bold text-2xl">John.Dev</a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex">
          <ul className="flex space-x-8">
            {navLinks.map((link, index) => (
              <li key={link.name}>
                <a 
                  href={link.href}
                  className="text-tech-slate hover:text-tech-highlight transition-colors duration-300 relative group"
                >
                  <span className="text-tech-highlight mr-1">0{index + 1}.</span>
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tech-highlight group-hover:w-full transition-all duration-300"></span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        <Button 
          variant="outline"
          className="hidden md:block border border-tech-highlight text-tech-highlight hover:bg-tech-highlight/10"
        >
          Resume
        </Button>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-tech-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-tech-lightBlue mt-2 rounded-md">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-tech-slate hover:text-tech-highlight block px-3 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <Button 
            variant="outline"
            className="w-full border border-tech-highlight text-tech-highlight hover:bg-tech-highlight/10 mt-4"
          >
            Resume
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
