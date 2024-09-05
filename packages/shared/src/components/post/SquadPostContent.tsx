import classNames from 'classnames';
import React, { ReactElement, useEffect } from 'react';

import { useAuthContext } from '../../contexts/AuthContext';
import { isVideoPost, PostType } from '../../graphql/posts';
import { useViewPost } from '../../hooks/post';
import { useMemberRoleForSource } from '../../hooks/useMemberRoleForSource';
import usePostContent from '../../hooks/usePostContent';
import { BasePostContent } from './BasePostContent';
import { PostContentProps, PostNavigationProps } from './common';
import MarkdownPostContent from './MarkdownPostContent';
import PostContentContainer from './PostContentContainer';
import PostSourceInfo from './PostSourceInfo';
import SharePostContent from './SharePostContent';
import ShareYouTubeContent from './ShareYouTubeContent';
import SquadPostAuthor from './SquadPostAuthor';
import { SquadPostWidgets } from './SquadPostWidgets';

const ContentMap = {
  [PostType.Freeform]: MarkdownPostContent,
  [PostType.Welcome]: MarkdownPostContent,
  [PostType.Share]: SharePostContent,
  [PostType.VideoYouTube]: ShareYouTubeContent,
};

function SquadPostContent({
  post,
  isFallback,
  shouldOnboardAuthor,
  origin,
  position,
  postPosition,
  inlineActions,
  className,
  customNavigation,
  onPreviousPost,
  onNextPost,
  onClose,
  onRemovePost,
  isBannerVisible,
  isPostPage,
}: PostContentProps): ReactElement {
  const { user } = useAuthContext();
  const onSendViewPost = useViewPost(post);
  const hasNavigation = !!onPreviousPost || !!onNextPost;
  const engagementActions = usePostContent({ origin, post });
  const { onReadArticle, onCopyPostLink } = engagementActions;
  const { role } = useMemberRoleForSource({
    source: post?.source,
    user: post?.author,
  });

  const navigationProps: PostNavigationProps = {
    post,
    onPreviousPost,
    onNextPost,
    postPosition,
    onClose,
    inlineActions,
    onRemovePost,
  };

  useEffect(() => {
    if (!post?.id || !user?.id) {
      return;
    }

    onSendViewPost(post.id);
  }, [post.id, onSendViewPost, user?.id]);

  const finalType = isVideoPost(post) ? PostType.VideoYouTube : post?.type;
  const Content = ContentMap[finalType];

  return (
    <PostContentContainer
      className={classNames(
        'relative flex-1 flex-col laptop:flex-row laptop:pb-0',
        className?.container,
      )}
      hasNavigation={hasNavigation}
      isNavigationOutside
      navigationProps={
        position === 'fixed'
          ? {
              ...navigationProps,
              isBannerVisible,
              onReadArticle,
              className: className?.fixedNavigation,
            }
          : null
      }
    >
      <div
        className={classNames(
          'relative flex min-w-0 flex-1 flex-col px-4 laptop:px-8',
          className?.content,
        )}
      >
        <BasePostContent
          className={{
            ...className,
            onboarding: classNames('mb-6', className?.onboarding),
            header: 'mb-6',
            navigation: {
              actions: 'ml-auto laptop:hidden',
              container: 'mb-6 pt-6',
            },
          }}
          isPostPage={isPostPage}
          isFallback={isFallback}
          customNavigation={customNavigation}
          shouldOnboardAuthor={shouldOnboardAuthor}
          navigationProps={navigationProps}
          engagementProps={engagementActions}
          origin={origin}
          post={post}
        >
          <PostSourceInfo
            source={post.source}
            className={classNames('!typo-body', customNavigation && 'mt-6')}
          />
          <SquadPostAuthor
            author={post?.author}
            role={role}
            date={post.createdAt}
            className={{ container: 'mt-3' }}
          />
          <Content post={post} onReadArticle={onReadArticle} />
        </BasePostContent>
      </div>
      <SquadPostWidgets
        onCopyPostLink={onCopyPostLink}
        onReadArticle={onReadArticle}
        post={post}
        className="mb-6 border-l border-border-subtlest-tertiary laptop:mb-0"
        onClose={onClose}
        origin={origin}
      />
    </PostContentContainer>
  );
}

export default SquadPostContent;
