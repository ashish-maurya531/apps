import React, { ReactElement } from 'react';

import Icon, { IconProps } from '../../Icon';
import FilledIcon from './filled.svg';
import OutlinedIcon from './outlined.svg';

export const EarthIcon = (props: IconProps): ReactElement => (
  <Icon {...props} IconPrimary={OutlinedIcon} IconSecondary={FilledIcon} />
);
