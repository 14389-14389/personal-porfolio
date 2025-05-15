
import { useState } from "react";
import { cn } from "@/lib/utils";

const experiences = [
  {
    company: "Tech Innovations Inc",
    position: "Senior Software Engineer",
    duration: "Jan 2022 - Present",
    description: [
      "Lead development of a microservices architecture that improved system scalability by 200%.",
      "Implemented CI/CD pipeline reducing deployment time by 70%.",
      "Mentored junior developers and conducted code reviews to ensure code quality.",
      "Architected and implemented RESTful APIs used by mobile and web clients."
    ]
  },
  {
    company: "DataSphere Solutions",
    position: "Full Stack Developer",
    duration: "Mar 2018 - Dec 2021",
    description: [
      "Built responsive front-end interfaces using React and Redux.",
      "Developed backend services using Node.js and Express.",
      "Optimized database queries resulting in 40% performance improvement.",
      "Collaborated with UX designers to create intuitive user interfaces."
    ]
  },
  {
    company: "CloudNexus",
    position: "Software Developer",
    duration: "Jun 2016 - Feb 2018",
    description: [
      "Developed and maintained cloud-based applications using AWS.",
      "Created automated testing scripts that reduced QA time by 35%.",
      "Participated in agile development cycles and sprint planning.",
      "Improved application security practices and implemented vulnerability scanning."
    ]
  },
  {
    company: "StartUp Labs",
    position: "Junior Developer",
    duration: "Sep 2014 - May 2016",
    description: [
      "Assisted in development of web applications using JavaScript and PHP.",
      "Designed and implemented database schemas for various projects.",
      "Collaborated with senior developers to troubleshoot complex issues.",
      "Contributed to open-source projects to improve coding skills."
    ]
  }
];

const ExperienceSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="experience" className="py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-tech-white">
            <span className="text-tech-highlight font-mono">03.</span> Where I've Worked
          </h2>
          <div className="h-px bg-tech-lightBlue flex-grow ml-4"></div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Tab Buttons */}
          <div className="flex md:flex-col overflow-x-auto md:overflow-visible mb-6 md:mb-0 md:mr-8 border-b md:border-b-0 md:border-l border-tech-lightBlue/50">
            {experiences.map((exp, index) => (
              <button
                key={index}
                className={cn(
                  "px-4 py-3 text-left whitespace-nowrap font-mono transition-all duration-300",
                  activeTab === index 
                    ? "text-tech-highlight bg-tech-lightBlue/20 md:border-l-2 md:border-tech-highlight" 
                    : "text-tech-slate hover:text-tech-highlight hover:bg-tech-lightBlue/10"
                )}
                onClick={() => setActiveTab(index)}
              >
                {exp.company}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="py-2 md:py-0 flex-grow">
            {experiences.map((exp, index) => (
              <div 
                key={index} 
                className={`${activeTab === index ? 'block' : 'hidden'}`}
              >
                <h3 className="text-xl text-tech-white mb-1">
                  <span className="font-bold">{exp.position}</span> <span className="text-tech-highlight">@ {exp.company}</span>
                </h3>
                <p className="text-tech-slate font-mono mb-4">{exp.duration}</p>
                <ul className="space-y-4">
                  {exp.description.map((item, i) => (
                    <li key={i} className="flex text-tech-slate">
                      <span className="text-tech-highlight mr-2 mt-1.5">▹</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
