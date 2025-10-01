import { ClockIcon } from "./ClockIcon";
import { CommentIcon } from "./CommentIcon";
import { EmailIcon } from "./EmailIcon";
import { EyeIcon } from "./EyeIcon";
import { EyeSlashIcon } from "./EyeSlashIcon";
import { HeartIcon } from "./HeartIcon";
import { LockIcon } from "./LockIcon";
import { PhotoIcon } from "./PhotoIcon";
import { PlusIcon } from "./PlusIcon";
import { SettingIcon } from "./SettingIcon";
import { UploadIcon } from "./UploadIcon";
import { UserIcon } from "./UserIcon";
import { UsersIcon } from "./UsersIcon";
import { XIcon } from "./XIcon";

const ICONNAME_MAPPING = {
  email: EmailIcon,
  lock: LockIcon,
  eye: EyeIcon,
  eyeSlash: EyeSlashIcon,
  photo: PhotoIcon,
  upload: UploadIcon,
  plus: PlusIcon,
  x: XIcon,
  setting: SettingIcon,
  comment: CommentIcon,
  heart: HeartIcon,
  user: UserIcon,
  users: UsersIcon,
  clock: ClockIcon,
};

export const iconNameValue = Object.keys(ICONNAME_MAPPING) as Array<keyof typeof ICONNAME_MAPPING>;

export type IconName = (typeof iconNameValue)[number];

type Props = {
  iconName: IconName;
};
export default function UseIcon({ iconName }: Props) {
  const SelectedIcon = ICONNAME_MAPPING[iconName];

  if (!SelectedIcon) return null;

  return <SelectedIcon />;
}
