import { Meta, StoryObj } from "@storybook/nextjs";
import { ErrorDialog } from "./ErrorDialog";

const meta = {
  title: "Components/Dialog/ErrorDialog",
  component: ErrorDialog,
  argTypes: {
    // onClose: { action: "clicked" },
  },
} satisfies Meta<typeof ErrorDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: "データ取得に失敗しました",
    // onClose: () => {},
    children: "閉じる",
  },
};
