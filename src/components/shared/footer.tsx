import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-200 p-4 text-center">
      © {new Date().getFullYear()} Công ty TNHH Một Mình Tao Click FLow. All
      rights reserved.
    </footer>
  );
};

export default Footer;
