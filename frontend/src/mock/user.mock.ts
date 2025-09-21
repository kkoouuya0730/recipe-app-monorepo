import type { User } from "shared/validation/modelSchema/UserSchema";

export const UserMock: User = {
  id: 1,
  name: "kkoouuya",
  biography: "家庭料理研究家 | 毎日の食卓を彩る簡単レシピを投稿しています 🍳",
  createdAt: new Date("2025-09-11T13:40:17.847Z"),
  email: "test@test.com",
  password: "",
  avatarUrl: null,
  headerUrl: null,
  recipes: [],
  comments: [],
  RefreshToken: [],
  Like: [],
  updatedAt: new Date("2025-09-11T13:40:17.847Z"),
};
