import { Meta, StoryObj } from "@storybook/nextjs";
import { Input, InputFormProps, inputFormTypePropertyValues } from "./Input";
import { useState } from "react";

const meta = {
  component: Input,
  argTypes: {
    type: {
      control: "select",
      options: inputFormTypePropertyValues,
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

const Example = (props: InputFormProps) => {
  const [value, setValue] = useState(props.value);
  return (
    <div>
      <p>Example</p>
      <Input value={value} onClear={() => setValue("")} label="名前" errorMessage="エラーです" required />
    </div>
  );
};

export const FirstStory: Story = {
  args: {
    label: "テスト",
    value: undefined,
  },
  decorators: () => {
    return (
      <>
        {/* <Story /> */}

        <Example label="test" value="" />
      </>
    );
  },
};
