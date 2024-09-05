import { useRouter } from 'next/router';
import React, { ReactElement, useCallback } from 'react';

import { ActionType } from '../../graphql/actions';
import {
  useActions,
  useFeedLayout,
  usePublicSquadRequests,
  useSquad,
} from '../../hooks';
import { Button } from '../buttons/Button';
import { ButtonSize, ButtonVariant } from '../buttons/common';
import { EarthIcon, MiniCloseIcon } from '../icons';
import PublicSquadSubmissionActions from '../squads/PublicSquadSubmissionActions';
import { SquadPublicProgressBars } from '../squads/SquadPublicProgressBars';
import { Card } from './Card';
import { ListCard } from './list/ListCard';
import { PlaceholderCard } from './PlaceholderCard';

export function PublicSquadEligibilityCard(): ReactElement {
  const router = useRouter();
  const { squad } = useSquad({ handle: router.query.handle as string });
  const { isFetched } = usePublicSquadRequests({
    sourceId: squad?.id,
  });
  const postsCount = squad?.flags?.totalPosts;
  const { shouldUseListFeedLayout } = useFeedLayout();
  const { completeAction } = useActions();

  const onDismiss = useCallback(() => {
    completeAction(ActionType.HidePublicSquadEligibilityCard);
  }, [completeAction]);

  if (!isFetched) {
    return <PlaceholderCard />;
  }

  const CardComponent = shouldUseListFeedLayout ? ListCard : Card;

  return (
    <CardComponent
      data-testid="publicSquadEligibilityCard"
      className="min-h-[21.75rem] justify-between !bg-transparent p-4"
    >
      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex h-6 items-center gap-1 rounded-8 bg-surface-float pl-1 pr-2 text-text-tertiary typo-callout">
            <EarthIcon />
            Public Squad
          </div>
          <Button
            size={ButtonSize.Small}
            variant={ButtonVariant.Tertiary}
            icon={<MiniCloseIcon />}
            onClick={onDismiss}
            aria-label="Close squad eligibility"
          />
        </div>

        <h3 className="mb-2 font-bold typo-title3">
          Get more traffic by making your Squad public
        </h3>
        <p className="text-text-tertiary typo-callout">
          With Public Squads your posts will organically appear on the daily.dev
          feed giving your content a lot more exposure
        </p>
      </div>
      <SquadPublicProgressBars postsCount={postsCount} />
      <PublicSquadSubmissionActions squad={squad} />
    </CardComponent>
  );
}
