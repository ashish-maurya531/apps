import React, { ReactElement, useContext } from 'react';

import AuthContext from '../../contexts/AuthContext';
import { useSquadNavigation } from '../../hooks';
import { Origin } from '../../lib/log';
import { DefaultSquadIcon, NewSquadIcon, SourceIcon } from '../icons';
import { SquadImage } from '../squads/SquadImage';
import { ListIcon, SidebarMenuItem } from './common';
import { Section, SectionCommonProps } from './Section';

export function SquadSection(props: SectionCommonProps): ReactElement {
  const { squads } = useContext(AuthContext);
  const { openNewSquad } = useSquadNavigation();

  const squadMenuItems: SidebarMenuItem[] = [
    {
      icon: (active: boolean) => (
        <ListIcon Icon={() => <SourceIcon secondary={active} />} />
      ),
      title: 'Public Squads',
      path: `${process.env.NEXT_PUBLIC_WEBAPP_URL}squads`,
      isForcedLink: true,
    },
  ];

  squads?.forEach((squad) => {
    const { permalink, name, image } = squad;
    squadMenuItems.push({
      icon: () =>
        image ? (
          <SquadImage className="h-5 w-5" {...squad} />
        ) : (
          <DefaultSquadIcon />
        ),
      title: name,
      path: permalink,
    });
  });

  squadMenuItems.push({
    icon: () => <NewSquadIcon />,
    title: 'New Squad',
    action: () => openNewSquad({ origin: Origin.Sidebar }),
  });

  return (
    <Section
      title="Squads"
      items={squadMenuItems}
      {...props}
      isItemsButton={false}
    />
  );
}
