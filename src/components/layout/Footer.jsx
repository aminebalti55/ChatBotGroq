import React from 'react';
import { Github, Twitter, ExternalLink } from 'lucide-react';

const Footer = () => {
    return (
      <footer className="bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl 
        border-t border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                AI Chat © {new Date().getFullYear()}
              </span>
              <div className="h-4 w-px bg-gray-200 dark:bg-white/5"></div>
              <div className="flex items-center gap-4">
                {['Privacy', 'Terms', 'Help'].map((text) => (
                  <FooterLink key={text} text={text} />
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <SocialIcon href="https://github.com" icon={<Github className="w-4 h-4" />} />
              <SocialIcon href="https://twitter.com" icon={<Twitter className="w-4 h-4" />} />
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  const FooterLink = ({ text }) => (
    <a
      href="#"
      className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 
        dark:hover:text-white transition-colors"
    >
      {text}
    </a>
  );
  
  const SocialIcon = ({ href, icon }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 
        dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
    >
      {icon}
    </a>
  );
  
  export default Footer;