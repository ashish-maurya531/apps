import React, { ReactElement, useMemo } from 'react';
import classNames from 'classnames';
import { Post } from '../../graphql/posts';
import classed from '../../lib/classed';
import { LazyImage } from '../LazyImage';
import { WidgetContainer } from './common';
import { FeatherIcon, ScoutIcon } from '../icons';
import { LinkWithTooltip } from '../tooltips/LinkWithTooltip';
import { ProfileLink } from '../profile/ProfileLink';
import { Author as CommentAuthor } from '../../graphql/comments';
import { ProfileTooltip } from '../profile/ProfileTooltip';
import ConditionalWrapper from '../ConditionalWrapper';
import { ReputationUserBadge } from '../ReputationUserBadge';
import { ButtonVariant } from '../buttons/common';
import useFeedSettings from '../../hooks/useFeedSettings';
import EnableNotification from '../notifications/EnableNotification';
import { NotificationPromptSource } from '../../lib/log';
import { useSourceActionsNotify } from '../../hooks';
import { SourceActions } from '../sources/SourceActions';
import { Source } from '../../graphql/sources';

interface PostAuthorProps {
  post: Post;
}

enum UserType {
  Source = 'source',
  Author = 'author',
  Featured = 'featured',
  Scout = 'scout',
}

const StyledImage = classed(LazyImage, 'w-10 h-10');

type SourceAuthorProps =
  | ({ userType: UserType.Author } & CommentAuthor)
  | ({
      userType: UserType.Source;
    } & Source)
  | ({ userType: UserType.Scout } & CommentAuthor);

type UserHighlightProps = SourceAuthorProps & {
  allowSubscribe?: boolean;
  showReputation?: boolean;
  className?: {
    wrapper?: string;
    image?: string;
    textWrapper?: string;
    name?: string;
    reputation?: string;
    handle?: string;
  };
};

type ImageProps = SourceAuthorProps & {
  className?: string;
};

const getUserIcon = (userType: UserType) => {
  if (userType === UserType.Source) {
    return null;
  }

  return userType === UserType.Author ? FeatherIcon : ScoutIcon;
};

const Image = (props: ImageProps) => {
  const { userType, name, permalink, image, className } = props;

  if (userType === UserType.Source) {
    return (
      <LinkWithTooltip
        href={permalink}
        passHref
        prefetch={false}
        tooltip={{
          placement: 'bottom',
          content: name,
        }}
      >
        <StyledImage
          className={classNames('cursor-pointer rounded-full', className)}
          imgSrc={image}
          imgAlt={name}
          background="var(--theme-background-subtle)"
        />
      </LinkWithTooltip>
    );
  }

  const user = props as CommentAuthor;

  return (
    <ProfileLink href={user.permalink} data-testid="authorLink">
      <StyledImage
        className="rounded-12"
        imgSrc={image}
        imgAlt={name}
        background="var(--theme-background-subtle)"
      />
    </ProfileLink>
  );
};

export const UserHighlight = (props: UserHighlightProps): ReactElement => {
  const { userType, ...source } = props;
  const {
    id,
    name,
    permalink,
    allowSubscribe = true,
    className,
    showReputation = false,
  } = source;

  const typeHandle = 'handle' in source ? source.handle : source.username;
  const reputation = 'reputation' in source ? source.reputation : NaN;

  const Icon = getUserIcon(userType);
  const isUserTypeSource = userType === UserType.Source;
  const { feedSettings } = useFeedSettings();

  const isSourceBlocked = useMemo(() => {
    if (!isUserTypeSource) {
      return false;
    }

    return !!feedSettings?.excludeSources?.some(
      (excludedSource) => excludedSource.id === id,
    );
  }, [isUserTypeSource, feedSettings?.excludeSources, id]);

  return (
    <div
      className={classNames(
        'relative flex flex-row items-center p-3',
        className?.wrapper,
      )}
    >
      <ConditionalWrapper
        condition={!isUserTypeSource}
        wrapper={(children) => (
          <ProfileTooltip user={{ id }}>
            {children as ReactElement}
          </ProfileTooltip>
        )}
      >
        <ProfileLink href={permalink}>
          <Image {...props} className={className?.image} />
        </ProfileLink>
      </ConditionalWrapper>
      {Icon && (
        <Icon
          secondary
          className={classNames(
            'absolute left-10 top-10 h-5 w-5',
            userType === UserType.Author
              ? 'text-accent-cheese-default'
              : 'text-accent-bun-default',
          )}
        />
      )}
      <ConditionalWrapper
        condition={!isUserTypeSource}
        wrapper={(children) => (
          <ProfileTooltip user={{ id }}>
            {children as ReactElement}
          </ProfileTooltip>
        )}
      >
        <div
          className={classNames(
            'ml-4 flex min-w-0 flex-1 flex-col',
            className?.textWrapper,
          )}
        >
          <div className="flex">
            <ProfileLink
              className={classNames(
                'truncate font-bold typo-callout',
                className?.name,
              )}
              href={permalink}
            >
              {name}
            </ProfileLink>

            {(showReputation || !isUserTypeSource) && (
              <ReputationUserBadge
                className={className?.reputation}
                user={{ reputation }}
              />
            )}
          </div>
          {(typeHandle || id) && (
            <ProfileLink
              className={classNames(
                'mt-0.5 !block truncate text-text-tertiary typo-footnote',
                className?.handle,
              )}
              href={permalink}
            >
              @{typeHandle || id}
            </ProfileLink>
          )}
        </div>
      </ConditionalWrapper>
      {!isSourceBlocked &&
        isUserTypeSource &&
        allowSubscribe &&
        'handle' in source && (
          <SourceActions
            hideBlock
            source={source}
            block={{ className: 'ml-2', variant: ButtonVariant.Secondary }}
          />
        )}
    </div>
  );
};

const EnableNotificationSourceSubscribe = ({
  source,
}: Pick<Post, 'source'>) => {
  const { haveNotifications } = useSourceActionsNotify({
    source,
  });

  if (!haveNotifications) {
    return null;
  }

  return (
    <EnableNotification
      source={NotificationPromptSource.SourceSubscribe}
      contentName={source.name}
    />
  );
};

export function PostUsersHighlights({ post }: PostAuthorProps): ReactElement {
  const { author, scout, source } = post;

  return (
    <WidgetContainer className="flex flex-col">
      <UserHighlight {...source} userType={UserType.Source} />
      <EnableNotificationSourceSubscribe source={source} />
      {author && <UserHighlight {...author} userType={UserType.Author} />}
      {scout && <UserHighlight {...scout} userType={UserType.Scout} />}
    </WidgetContainer>
  );
}
