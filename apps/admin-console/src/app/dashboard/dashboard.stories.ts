import { Meta, Story } from '@storybook/angular';
import { DashboardComponent } from './dashboard.component';

export default {
  title: 'Dashboard/HeroCard',
  component: DashboardComponent,
  argTypes: {},
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
