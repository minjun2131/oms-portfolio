"use client";

import { useState, useCallback, ChangeEvent } from "react";

/**
 * 폼 인풋 상태 관리 훅
 */
export function useInputs<T extends Record<string, string>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const reset = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  const setValue = useCallback((name: keyof T, value: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  return {
    values,
    handleChange,
    reset,
    setValue,
  };
}
