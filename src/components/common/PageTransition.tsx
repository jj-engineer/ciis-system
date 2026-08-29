import React from 'react';

interface PageTransitionProps {
  activeTab: string;
  children: React.ReactNode;
}

/**
 * Wraps page content with a smooth fade-up entrance animation.
 * Re-triggers the animation whenever `activeTab` changes via the React key.
 * Uses the `.page-enter` CSS class defined in index.css.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ activeTab, children }) => {
  return (
    <div key={activeTab} className="max-w-7xl mx-auto page-enter">
      {children}
    </div>
  );
};
