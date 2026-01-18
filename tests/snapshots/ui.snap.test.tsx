import React from 'react';
import { render } from '@testing-library/react';

import Loader from '../../src/components/Loader/Loader';
import ChatbotError from '../../src/components/ChatbotError/ChatbotError';

describe('UI snapshots', () => {
  test('Loader matches snapshot', () => {
    const { asFragment } = render(<Loader />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('ChatbotError matches snapshot', () => {
    const { asFragment, getByText } = render(<ChatbotError message="test error" />);
    // header is static and ensures component rendered
    expect(getByText(/Ooops. Something is missing/)).toBeTruthy();
    expect(asFragment()).toMatchSnapshot();
  });
});
