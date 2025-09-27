import UseIcon, { IconName } from "@/components/ui/isons/UseIcon";
import { isNonEmptyString } from "@/util/isDefinedValue";
import clsx from "clsx";
import { InputHTMLAttributes, useId } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

export const inputFormTypePropertyValues = ["text", "tel", "email", "password"] as const;
type InputFormTypeProperty = (typeof inputFormTypePropertyValues)[number];

type Props = {
  label: string;
  type?: InputFormTypeProperty;
  // type?: InputHTMLAttributes<HTMLInputElement>["type"];
  value: InputHTMLAttributes<HTMLInputElement>["value"];
  register?: UseFormRegisterReturn;
  placeholder?: InputHTMLAttributes<HTMLInputElement>["placeholder"];
  required?: boolean;
  errorMessage?: string;
  onClear?: () => void;
};

export type InputFormProps = Props;

function getIconName(type: string) {
  switch (type) {
    case "email":
      return "email";
    case "password":
      return "lock";
    default:
      return undefined;
  }
}

export const InputForm = ({
  label,
  type = "text",
  value,
  placeholder,
  required,
  errorMessage,
  register,
  onClear,
  ...rest
}: Props) => {
  const inputFormId = useId();

  const isShowClearButton = isNonEmptyString(value);
  const iconName = getIconName(type) as IconName;
  return (
    <div>
      <p className="mb-2">
        <label htmlFor={`${inputFormId}-input`} className="text-black/60 text-sm">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
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
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? `${inputFormId}-error` : undefined}
          required={required}
          {...register}
          {...rest}
          className={clsx([
            "rounded-md p-1 w-full border transition-all ease-in duration-200",
            errorMessage ? "border-red-500" : "border-rose-200",
            "bg-white focus:ring-[#EEB3D6] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white",
            iconName && "pl-10",
            isShowClearButton && "pr-10",
          ])}
        />

        {isShowClearButton && (
          <button
            type="button"
            onClick={onClear}
            aria-label={`${label}をクリア`}
            className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center"
          >
            <UseIcon iconName="x" />
          </button>
        )}
      </p>
      {errorMessage && (
        <p id={`${inputFormId}-error`} className="mt-1 text-sm text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
};
