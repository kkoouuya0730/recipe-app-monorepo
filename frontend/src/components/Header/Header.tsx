import { LinkButton } from "../Button/LinkButton/LinkButton";

export const Header = () => {
  return (
    <header>
      <div className="flex items-center justify-between h-16 px-2">
        <p className="text-[#A20065] text-2xl font-bold">レシピ共有アプリ</p>
        <div>
          <ul className="flex gap-2 px-2">
            <li>
              <LinkButton href="/login">ログイン</LinkButton>
            </li>
            <li>
              <LinkButton href="/signup" color="secondary">
                新規登録
              </LinkButton>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};
