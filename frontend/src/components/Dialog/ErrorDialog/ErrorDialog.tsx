"use client";

import { Button } from "@/components/Button/Button/Button";
import { isDefined } from "@/util/isDefinedValue";
import React, { ReactNode, useEffect, useRef } from "react";

type Props = {
  message: string | null;
  onClick?: () => void;
  children: ReactNode;
};

export const ErrorDialog = ({ message, onClick, children }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open && isDefined(message)) {
      dialog.showModal();
    }
    return () => {
      if (dialog && dialog.open) {
        dialog.close();
      }
    };
  }, [message]);

  return (
    <dialog
      ref={dialogRef}
      className="fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-lg shadow-lg p-6 min-w-[300px]"
    >
      <h2 className="text-lg font-bold mb-2 text-red-600">エラー</h2>
      <p className="mb-4 text-sm">{message}</p>
      <Button
        color="danger"
        onClick={() => {
          dialogRef.current?.close();
          onClick?.();
        }}
      >
        {children}
      </Button>
    </dialog>
  );
};
