import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-white shadow-sm p-6 flex justify-between items-center">
      <h1 className="text-2xl font-display font-semibold text-dark-brown">{title}</h1>
      {/* User Avatar and Dropdown Placeholder */}
      <div className="w-10 h-10 rounded-full bg-gray-300"></div>
    </header>
  );
};

export default Header;
