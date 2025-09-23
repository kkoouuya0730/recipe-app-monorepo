import UseIcon, { IconName } from "@/components/ui/isons/UseIcon";
import clsx from "clsx";
import { InputHTMLAttributes, useId } from "react";

export const inputFormTypePropertyValues = ["text", "tel", "email"] as const;
type InputFormTypeProperty = (typeof inputFormTypePropertyValues)[number];

type Props = {
  label: string;
  type?: InputFormTypeProperty;
  // type?: InputHTMLAttributes<HTMLInputElement>["type"];
  value: InputHTMLAttributes<HTMLInputElement>["value"];
  iconName?: IconName;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: InputHTMLAttributes<HTMLInputElement>["placeholder"];
};

export type InputFormProps = Props;

export const InputForm = ({ label, type = "text", value, iconName, onChange, placeholder }: Props) => {
  const inputFormId = useId();

  const isShowClearButton = value !== "" && typeof value !== "undefined";
  const handleClearButton = () => {
    if (onChange) {
      onChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    }
  };
  return (
    <div>
      <p className="mb-2">
        <label htmlFor={`${inputFormId}-input`} className="text-black/60 text-sm">
          {label}
        </label>
      </p>
      <p className="relative">
        {iconName && (
          <span className="absolute top-1/2 -translate-y-1/2 left-3 flex items-center">
            <UseIcon iconName={iconName} />
          </span>
        )}

        <input
          type={type}
          id={`${inputFormId}-input`}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={clsx([
            "rounded-md p-1 w-full",
            "border border-rose-200",
            "focus:ring-[#EEB3D6] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white",
            iconName && "pl-10",
            isShowClearButton && "pr-10",
          ])}
        />

        {isShowClearButton && (
          <span
            className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center cursor-pointer"
            onClick={handleClearButton}
          >
            <UseIcon iconName="x" />
          </span>
        )}
      </p>
    </div>
  );
};
