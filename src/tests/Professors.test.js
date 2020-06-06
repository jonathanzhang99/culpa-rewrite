import { render } from '@testing-library/react';
import React from 'react';

import { ProfessorsSection } from 'components/Professors';

describe('ProfessorsSection Component', () => {
  const testCases = [
    {
      name: 'renders no professors',
      professors: [{}],
    },
    {
      name: 'renders multiple professors',
      professors: [
        {
          firstName: 'Nakul',
          lastName: 'Verma',
        },
        {
          firstName: 'Lee',
          lastName: 'Bollinger',
        },
      ],
    },
  ];
  testCases.forEach(({ name, professors }) => {
    test(name, () => {
      const snapshot = render(<ProfessorsSection professors={professors} />);
      expect(snapshot).toMatchSnapshot();
    });
  });
});
