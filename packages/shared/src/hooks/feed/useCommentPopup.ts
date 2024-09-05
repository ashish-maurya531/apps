import { useMutation } from '@tanstack/react-query';
import { useContext, useState } from 'react';

import LogContext from '../../contexts/LogContext';
import {
  COMMENT_ON_POST_MUTATION,
  CommentOnData,
} from '../../graphql/comments';
import { gqlClient } from '../../graphql/common';
import { Post } from '../../graphql/posts';
import { feedLogExtra, postLogEvent } from '../../lib/feed';

export default function useCommentPopup(
  feedName: string,
  ranking?: string,
): {
  setShowCommentPopupId: (value: string | undefined) => void;
  isSendingComment: boolean;
  comment: (variables: {
    post: Post;
    content: string;
    row: number;
    column: number;
    columns: number;
  }) => Promise<CommentOnData>;
  showCommentPopupId: string;
} {
  const [showCommentPopupId, setShowCommentPopupId] = useState<string>();
  const { logEvent } = useContext(LogContext);

  const { mutateAsync: comment, isLoading: isSendingComment } = useMutation<
    CommentOnData,
    unknown,
    {
      post: Post;
      content: string;
      row: number;
      column: number;
      columns: number;
    }
  >(
    ({ post, content }) =>
      gqlClient.request(COMMENT_ON_POST_MUTATION, {
        id: post.id,
        content,
      }),
    {
      onSuccess: async (data, { post, row, column, columns }) => {
        logEvent(
          postLogEvent('comment post', post, {
            columns,
            column,
            row,
            ...feedLogExtra(feedName, ranking),
          }),
        );
        const link = `${data.comment.permalink}?new=true`;
        setShowCommentPopupId(null);
        window.open(link, '_blank');
      },
    },
  );

  return {
    showCommentPopupId,
    setShowCommentPopupId,
    comment,
    isSendingComment,
  };
}
