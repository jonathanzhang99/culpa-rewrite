import { render } from '@testing-library/react';
import React from 'react';

import Announcements from 'components/Announcements';

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
      const snapshot = render(<Announcements messages={messages} />);
      expect(snapshot).toMatchSnapshot();
    });
  });
});
