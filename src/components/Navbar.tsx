
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-tech-blue shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-tech-highlight font-bold text-xl">
          Portfolio
        </Link>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-tech-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-tech-lightBlue border-tech-lightBlue/30 w-[300px]">
              <nav className="flex flex-col gap-6 mt-12">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-tech-slate hover:text-tech-highlight transition-colors text-lg"
                  >
                    {item.name}
                  </a>
                ))}
                <Link
                  to="/auth"
                  className="text-tech-highlight hover:text-tech-highlight/80 transition-colors text-lg"
                >
                  Admin
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item, i) => (
            <a
              key={item.name}
              href={item.href}
              className="text-tech-slate hover:text-tech-highlight transition-colors"
            >
              <span className="text-tech-highlight font-mono text-xs mr-1">{`0${i + 1}.`}</span> {item.name}
            </a>
          ))}
          <Button
            variant="outline"
            className="border-tech-highlight text-tech-highlight hover:bg-tech-highlight/10"
            onClick={() => navigate("/auth")}
          >
            Admin
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
