"use client";

import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-zinc-200 py-6 text-center text-sm text-gray-600 bg-white/50 backdrop-blur-md">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span>Built by</span>
        <span className="font-medium text-indigo-600">Prakhar Mishra</span>
      </div>

      <div className="flex items-center justify-center gap-4">
        <a
          href="https://github.com/mprakhar07"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-indigo-600 transition"
        >
          <Github className="w-4 h-4" /> GitHub
        </a>

        <span className="text-gray-400">|</span>

        <a
          href="https://www.linkedin.com/in/prakhar-mishra-52b71a257/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-indigo-600 transition"
        >
          <Linkedin className="w-4 h-4" /> LinkedIn
        </a>
      </div>
    </footer>
  );
}
