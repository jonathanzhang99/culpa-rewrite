import { render } from '@testing-library/react';
import React from 'react';

import { AnnouncementsSection } from 'components/Announcements';

describe('Announcements Component', () => {
  const testCases = [
    {
      name: 'renders empty messages',
      messages: [],
    },
    {
      name: 'renders multiple messages',
      messages: ['temporary1', 'temporary2'],
    },
  ];
  testCases.forEach(({ name, messages }) => {
    test(name, () => {
      const snapshot = render(<AnnouncementsSection messages={messages} />);
      expect(snapshot).toMatchSnapshot();
    });
  });
});
