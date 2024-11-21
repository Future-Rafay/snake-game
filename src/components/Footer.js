import React from 'react';
import Link from 'next/link'; 

const Footer = () => {
  return (
    <footer className="fixed bottom-0 w-full bg-transparent text-white py-4">
      <div className="max-w-screen-lg mx-auto px-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <span>Built with 💚 by</span>
          <Link
            href="https://my-portfolio-animated-4vr1yacy5-abdul-rafays-projects-87eac4f7.vercel.app/"
            className="underline underline-offset-3 hover:text-green-400 transition-colors duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Abdul Rafay
          </Link>
        </div>

        <span className="text-sm text-center sm:text-right">
          &copy; {new Date().getFullYear()} Abdul Rafay. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;