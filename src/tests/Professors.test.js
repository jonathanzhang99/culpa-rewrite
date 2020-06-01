import { render } from '@testing-library/react';
import React from 'react';

import Professors from 'components/Professors';

describe('Professors Component', () => {
  const testCases = [
    {
      name: 'renders no professors',
      professors: [{}],
    },
    {
      name: 'renders multiple professors',
      messages: [
        {
          first_name: 'Jonathan',
          last_name: 'Zhang',
        },
        {
          first_name: 'Lee',
          last_name: 'Bollinger',
        },
      ],
    },
  ];
  testCases.forEach(({ name, professors }) => {
    test(name, () => {
      const snapshot = render(<Professors professors={professors} />);
      expect(snapshot).toMatchSnapshot();
    });
  });
});
