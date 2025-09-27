import { Meta, StoryObj } from "@storybook/nextjs";
import { InputForm, InputFormProps, inputFormTypePropertyValues } from "./InputForm";
import { useState } from "react";

const meta = {
  component: InputForm,
  argTypes: {
    type: {
      control: "select",
      options: inputFormTypePropertyValues,
    },
  },
} satisfies Meta<typeof InputForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const Example = (props: InputFormProps) => {
  const [value, setValue] = useState(props.value);
  return (
    <div>
      <p>Example</p>
      <InputForm value={value} onClear={() => setValue("")} label="名前" errorMessage="エラーです" required />
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
