import { Meta, StoryObj } from "@storybook/nextjs";
import { Input, inputFormTypePropertyValues } from "./Input";
import { useState } from "react";

const meta = {
  title: "Components/Input",
  component: Input,
  argTypes: {
    type: {
      control: "select",
      options: inputFormTypePropertyValues,
    },
    iconName: {
      control: "select",
      options: [undefined, "email", "lock", "x"],
    },
    errorMessage: { control: "text" },
    required: { control: "boolean" },
    value: { control: "text" },
    onClear: { action: "clear" },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value ?? "");
    return <Input {...args} value={value} onClear={() => setValue("")} />;
  },
  args: {
    label: "お名前",
    value: "",
    required: false,
  },
};

export const WithError: Story = {
  args: {
    label: "お名前",
    value: "",
    errorMessage: "入力値が不正です",
    required: true,
  },
};

export const WithIcon: Story = {
  args: {
    label: "メール",
    value: "",
    iconName: "email",
    type: "email",
  },
};
