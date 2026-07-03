import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#2D1A2E] px-5 py-16 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 md:flex-row">
        <div>
          <Link to="/" className="text-xl font-extrabold tracking-tight text-white">
            find<span className="text-[#E1251B]">mates</span>
          </Link>
          <p className="mt-2 text-sm text-gray-400">AI-powered team formation platform.</p>
        </div>

        <div className="flex gap-8 text-sm font-medium text-gray-400">
          <a href="https://github.com" className="transition-colors hover:text-white">GitHub</a>
          <a href="https://linkedin.com" className="transition-colors hover:text-white">LinkedIn</a>
          <a href="#features" className="transition-colors hover:text-white">Features</a>
          <a href="#contact" className="transition-colors hover:text-white">Contact</a>
        </div>

        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} FindMate. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
