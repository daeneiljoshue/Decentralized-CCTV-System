import React, { useState } from 'react';
import MenuItem from './MenuItem'; // Assuming it exists or you create it

const Menu = ({ items, onItemSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemSelect = (item) => {
    onItemSelect(item);
    setIsOpen(false); // Close menu after selection
  };

  const menuItems = items.map((item) => (
    <MenuItem key={item.id} item={item} onClick={() => handleMenuItemSelect(item)} />
  ));

  return (
    <div className="menu-container">
      <button onClick={handleToggleMenu} className="menu-toggle">
        {isOpen ? 'Close Menu' : 'Open Menu'}
      </button>
      {isOpen && (
        <ul className="menu-items">{menuItems}</ul>
      )}
    </div>
  );
};

export default Menu;
