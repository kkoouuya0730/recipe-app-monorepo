import { Meta, StoryObj } from "@storybook/nextjs";
import UseIcon, { iconNameValue } from "./UseIcon";

const meta = {
  component: UseIcon,
  argTypes: {
    iconName: {
      control: "select",
      options: iconNameValue,
    },
  },
} satisfies Meta<typeof UseIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstStory: Story = {
  args: {
    iconName: "email",
  },
  render: (props) => {
    return (
      <div>
        <UseIcon {...props} />
        <ul className="flex gap-4 items-center justify-center">
          {iconNameValue.map((iconName) => {
            return (
              <li key={iconName}>
                <UseIcon iconName={iconName} />
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
};
