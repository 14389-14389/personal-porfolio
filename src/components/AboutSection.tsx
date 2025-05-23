
import { cn } from "@/lib/utils";

const skills = [
  "JavaScript (ES6+)",
  "TypeScript",
  "React",
  "Node.js",
  "Next.js",
  "Tailwind CSS",
  "Python",
  "RESTful APIs",
  "GraphQL",
  "SQL / NoSQL",
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="flex items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-tech-white">
            <span className="text-tech-highlight font-mono">01.</span> About Me
          </h2>
          <div className="h-px bg-tech-lightBlue flex-grow ml-4"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 text-tech-slate">
            <p className="mb-4">
              Hello! I'm Kevin, a passionate software developer with a knack for creating intuitive and 
              efficient digital solutions. My journey in tech began during university when I built my first 
              web application, and I've been hooked ever since.
            </p>
            
            <p className="mb-4">
              Throughout my career, I've worked on diverse projects ranging from enterprise-level applications to 
              innovative startups. I thrive in dynamic environments where I can leverage my technical skills to 
              solve complex problems and deliver high-quality software.
            </p>
            
            <p className="mb-8">
              My approach to development is centered around creating clean, maintainable code that provides 
              exceptional user experiences. I'm constantly expanding my knowledge and experimenting with new 
              technologies to stay at the forefront of the industry.
            </p>

            <p className="mb-4">
              Here are a few technologies I've been working with recently:
            </p>

            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {skills.map((skill, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-tech-highlight mr-2">▹</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative group">
            <div className="relative rounded-md overflow-hidden w-full aspect-square bg-tech-highlight/20">
              <div className="absolute inset-0 bg-tech-highlight/20 group-hover:bg-transparent transition-all duration-300"></div>
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
                alt="Kevin Muli" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
            <div className="absolute -inset-3 border-2 border-tech-highlight rounded-md -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-all duration-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
