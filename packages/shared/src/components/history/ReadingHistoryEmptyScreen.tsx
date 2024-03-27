import Link from 'next/link';
import React, { ReactElement } from 'react';
import classNames from 'classnames';
import {
  EmptyScreenButton,
  EmptyScreenDescription,
  EmptyScreenIcon,
  EmptyScreenTitle,
} from '../EmptyScreen';
import { EyeIcon } from '../icons';
import { ButtonSize } from '../buttons/common';
import { useMobileUxExperiment } from '../../hooks/useMobileUxExperiment';

function ReadingHistoryEmptyScreen(): ReactElement {
  const { isNewMobileLayout } = useMobileUxExperiment();

  return (
    <div
      className={classNames(
        'mt-20 flex flex-1 flex-col items-center justify-center px-6',
        isNewMobileLayout && 'tablet:pl-22',
      )}
    >
      <EyeIcon
        className={EmptyScreenIcon.className}
        style={EmptyScreenIcon.style}
      />
      <EmptyScreenTitle>Your reading history is empty.</EmptyScreenTitle>
      <EmptyScreenDescription>
        Go back to your feed and read posts that spark your interest. Each post
        you read will be listed here.
      </EmptyScreenDescription>
      <Link href={process.env.NEXT_PUBLIC_WEBAPP_URL}>
        <EmptyScreenButton size={ButtonSize.Large}>
          Back to feed
        </EmptyScreenButton>
      </Link>
    </div>
  );
}

export default ReadingHistoryEmptyScreen;
