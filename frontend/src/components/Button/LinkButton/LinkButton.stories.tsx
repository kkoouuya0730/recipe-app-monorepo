import { Meta, StoryObj } from "@storybook/nextjs";
import { LinkButton, buttonColorPropertyValues } from "./LinkButton";

const meta = {
  title: "Components/Button",
  component: LinkButton,
  argTypes: {
    color: {
      control: { type: "select" },
      options: buttonColorPropertyValues,
    },
  },
} satisfies Meta<typeof LinkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Primary Button",
    color: "primary",
    href: "/",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    color: "secondary",
    href: "/",
  },
};

export const Tertiary: Story = {
  args: {
    children: "Tertiary Button",
    color: "tertiary",
    href: "/",
  },
};
