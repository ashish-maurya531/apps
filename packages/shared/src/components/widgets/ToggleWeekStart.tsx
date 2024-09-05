import React, { ReactElement } from 'react';

import { useReadingStreak } from '../../hooks/streaks';
import { DayOfWeek, getDefaultStartOfWeek } from '../../lib/date';
import { ClassName as RadioClassName, Radio } from '../fields/Radio';

export const ToggleWeekStart = ({
  className,
}: {
  className?: RadioClassName;
}): ReactElement => {
  const { streak, isLoading, updateStreakConfig } = useReadingStreak();

  const toggleWeekStart = (weekStart: string) => {
    updateStreakConfig({ weekStart: parseInt(weekStart, 10) });
  };

  if (isLoading) {
    return null;
  }

  return (
    <Radio
      name="freeze-days"
      value={getDefaultStartOfWeek(streak.weekStart)}
      options={[
        {
          label: 'Friday to Saturday',
          value: DayOfWeek.Sunday.toString(),
        },
        {
          label: 'Saturday to Sunday',
          value: DayOfWeek.Monday.toString(),
        },
      ]}
      onChange={toggleWeekStart}
      className={className}
    />
  );
};
