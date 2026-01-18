import React from 'react';
import { render } from '@testing-library/react';

import Loader from '../../../src/components/Loader/Loader';

test('renders loader container and SVG with three dots', () => {
  const { container } = render(<Loader />);

  const outer = container.querySelector('.chatbot-loader-container');
  expect(outer).toBeTruthy();

  const svg = container.querySelector('svg#dots');
  expect(svg).toBeTruthy();

  const dot1 = container.querySelector('#chatbot-loader-dot1');
  const dot2 = container.querySelector('#chatbot-loader-dot2');
  const dot3 = container.querySelector('#chatbot-loader-dot3');

  expect(dot1).toBeTruthy();
  expect(dot2).toBeTruthy();
  expect(dot3).toBeTruthy();

  // spot-check attributes
  expect(dot1?.getAttribute('cx')).toBe('25');
  expect(dot2?.getAttribute('cx')).toBe('65');
  expect(dot3?.getAttribute('cx')).toBe('105');
  expect(dot1?.getAttribute('r')).toBe('13');
});
