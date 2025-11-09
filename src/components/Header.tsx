// src/components/Header.tsx
import React from 'react';
import { Navbar } from './ui/organisms/navbar';
import ErrorBoundary from './ui/skeleton/ErrorBoundary';
import { Business } from '@/types/business';

type HeaderProps = {
  setShowSearch?: (value: boolean) => void;
  business: Business;
};

const Header = async function Header({ setShowSearch, business }: HeaderProps) {
  return (
    <header className="sticky top-0 left-0 w-full z-50">
      <ErrorBoundary>
        <Navbar business={business} />
      </ErrorBoundary>
    </header>
  );
};

export default Header;