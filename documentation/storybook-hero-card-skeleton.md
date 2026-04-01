# Storybook Hero Card Skeleton

This repository does not yet include Storybook dependencies in `package.json`. The following is a quick Storybook skeleton for hero cards that can be enabled once Storybook is installed and configured.

```ts
import { Meta, Story } from '@storybook/angular';
import { DashboardComponent } from '../apps/admin-console/src/app/dashboard/dashboard.component';

export default {
  title: 'Dashboard/HeroCard',
  component: DashboardComponent,
} as Meta<DashboardComponent>;

const Template: Story<DashboardComponent> = (args: DashboardComponent) => ({
  component: DashboardComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  darkMode: false,
};

export const DarkMode = Template.bind({});
DarkMode.args = {
  darkMode: true,
};
```

To enable and run:

- install Storybook packages (e.g., `pnpm add -D @storybook/angular`
- add Storybook config under `.storybook`
- configure `main.js` to include `apps/admin-console/src/app/**/*.stories.ts`
- run `pnpm storybook`
