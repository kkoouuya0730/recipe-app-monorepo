import { Meta, StoryObj } from "@storybook/nextjs";
import { InputForm, InputFormProps, inputFormTypePropertyValues } from "./InputForm";
import { iconNameValue } from "@/components/ui/isons/UseIcon";
import { useState } from "react";

const meta = {
  component: InputForm,
  argTypes: {
    type: {
      control: "select",
      options: inputFormTypePropertyValues,
    },
    iconName: {
      control: "select",
      options: iconNameValue,
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
      <InputForm value={value} onChange={(e) => setValue(e.target.value)} iconName="email" label="名前" />
    </div>
  );
};

export const FirstStory: Story = {
  args: {
    label: "テスト",
    value: undefined,
    iconName: "email",
    onChange: (e) => console.log(e.target.value),
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
