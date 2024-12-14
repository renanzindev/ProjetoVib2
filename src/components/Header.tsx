import React from 'react';
import { Menu, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-cyber-dark border-b border-neon-blue/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Menu className="w-8 h-8 text-neon-blue group-hover:shadow-neon transition-all duration-300" />
            <span className="text-xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
              Vibbraneo ToDo
            </span>
          </Link>
          <nav>
            <Link
              to="/about"
              className="flex items-center space-x-1 text-neon-blue hover:text-white hover:shadow-neon transition-all duration-300"
            >
              <Info className="w-5 h-5" />
              <span>About</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}