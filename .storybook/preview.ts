import { initialize } from '@storybook/angular';

// You can add global parameters/theme/decorators here.
export const parameters = {
  actions: { argTypesRegex: '^on.*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

initialize();
