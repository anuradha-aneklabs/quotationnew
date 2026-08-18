import { useState, useEffect } from 'react';

/**
 * Dynamically calculates how many table rows fit on the screen.
 * Accounts for: header (65px) + searchbar (52px) + pagination (65px) + gaps + padding
 * Total reserved ≈ 280px
 */
export default function useItemsPerPage(rowHeight = 53, reservedHeight = 340) {
  const calculate = () => {
    const availableHeight = window.innerHeight - reservedHeight;
    const rows = Math.max(5, Math.floor(availableHeight / rowHeight));
    return rows;
  };

  const [itemsPerPage, setItemsPerPage] = useState(calculate);

  useEffect(() => {
    const handleResize = () => setItemsPerPage(calculate());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return itemsPerPage;
}
