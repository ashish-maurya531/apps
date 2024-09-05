import React, { ReactElement } from 'react';

import { PostRelationType } from '../../../graphql/posts';
import { FooterLinks } from '../../footer';
import ShareBar from '../../ShareBar';
import { ShareMobile } from '../../ShareMobile';
import { PageWidgets } from '../../utilities';
import { PostWidgetsProps } from '../PostWidgets';
import { RelatedPostsWidget } from '../RelatedPostsWidget';
import { CollectionsIntro } from '../widgets';
import { CollectionPostHeaderActions } from './CollectionPostHeaderActions';

export const CollectionPostWidgets = ({
  onCopyPostLink,
  post,
  origin,
  className,
  onClose,
}: PostWidgetsProps): ReactElement => {
  return (
    <PageWidgets className={className}>
      <CollectionPostHeaderActions
        post={post}
        onClose={onClose}
        className="hidden pt-6 laptop:flex"
        contextMenuId="post-widgets-context"
      />
      <CollectionsIntro className="hidden laptop:flex" />
      <RelatedPostsWidget
        post={post}
        relationType={PostRelationType.Collection}
      />
      <ShareBar post={post} />
      <ShareMobile
        post={post}
        origin={origin}
        onCopyPostLink={onCopyPostLink}
        link={post.commentsPermalink}
      />
      <FooterLinks />
    </PageWidgets>
  );
};
