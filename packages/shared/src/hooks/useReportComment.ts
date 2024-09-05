import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';

import { BooleanPromise } from '../components/filters/common';
import AuthContext from '../contexts/AuthContext';
import { REPORT_COMMENT_MUTATION } from '../graphql/comments';
import { AuthTriggers } from '../lib/auth';
import { ReportReason } from '../report';
import { useRequestProtocol } from './useRequestProtocol';

type UseReportCommentRet = {
  reportComment: (variables: {
    commentId: string;
    reason: ReportReason;
    note?: string;
  }) => BooleanPromise;
};

interface ReportCommentProps {
  commentId: string;
  reason: ReportReason;
  note: string;
}

export default function useReportComment(): UseReportCommentRet {
  const { user, showLogin } = useContext(AuthContext);
  const { requestMethod } = useRequestProtocol();
  const { mutateAsync: reportCommentAsync } = useMutation<
    void,
    unknown,
    ReportCommentProps
  >((variables) => requestMethod(REPORT_COMMENT_MUTATION, variables));

  const reportComment = async (params: ReportCommentProps) => {
    if (!user) {
      showLogin({ trigger: AuthTriggers.ReportPost });
      return { successful: false };
    }

    await reportCommentAsync(params);

    return { successful: true };
  };

  return { reportComment };
}
