import cn from 'classnames';
import { DotsHorizontalIcon } from '@heroicons/react/solid';

import { Menu, MenuButton, MenuList, MenuItem } from './menu-button';
import { tokens } from './tokens';

export const DatabaseContextMenu = () => {
  return (
    <Menu>
      <MenuButton>
        <DotsHorizontalIcon className={cn(tokens.type.normal, 'w-4')} />
      </MenuButton>
      <MenuList>
        <div className="px-4 py-2">
          <p className={tokens.type['small semibold darker']}>Menu</p>
          <p className={tokens.type['small lighter']}>healthco-production</p>
        </div>

        <MenuItem onSelect={console.log}>Copy git remote</MenuItem>
        <MenuItem onSelect={console.log}>Copy git SHA</MenuItem>
        <MenuItem onSelect={console.log}>Pause all services</MenuItem>
        <MenuItem onSelect={console.log}>Restart all services</MenuItem>
        <MenuItem onSelect={console.log}>Settings</MenuItem>
      </MenuList>
    </Menu>
  );
};
