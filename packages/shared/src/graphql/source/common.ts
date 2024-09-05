import { QueryClient } from '@tanstack/react-query';

import { generateQueryKey, RequestKey } from '../../lib/query';
import { LoggedUser } from '../../lib/user';
import { SourceMemberFlag, Squad } from '../sources';

export const updateFlagsCache = (
  client: QueryClient,
  squad: Squad,
  user: LoggedUser,
  update: SourceMemberFlag,
): void => {
  const queryKey = generateQueryKey(RequestKey.Squad, user, squad?.handle);
  const data = client.getQueryData(queryKey);

  if (!data) {
    return;
  }

  client.setQueryData<Squad>(queryKey, (oldData) => ({
    ...oldData,
    currentMember: {
      ...oldData.currentMember,
      flags: {
        ...(oldData.currentMember.flags ?? {}),
        ...update,
      },
    },
  }));
};
