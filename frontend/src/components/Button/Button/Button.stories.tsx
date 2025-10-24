import { Meta, StoryObj } from "@storybook/nextjs";
import { Button, buttonColorPropertyValues } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    onClick: { action: "clicked" },
    color: {
      control: { type: "select" },
      options: buttonColorPropertyValues,
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Primary Button",
    color: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    color: "secondary",
  },
};

export const Tertiary: Story = {
  args: {
    children: "Tertiary Button",
    color: "tertiary",
  },
};

export const Danger: Story = {
  args: {
    children: "Danger Button",
    color: "danger",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    color: "primary",
    disabled: true,
  },
};
