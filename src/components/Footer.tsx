
const Footer = () => {
  return (
    <footer className="py-8 px-4 text-center text-tech-slate">
      <div className="container mx-auto">
        <p className="mb-4">Designed & Built by John Doe</p>
        <p className="text-sm">&copy; {new Date().getFullYear()} All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
