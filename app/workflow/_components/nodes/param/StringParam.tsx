"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useId, useState } from "react";
import { ParamProps } from "@/types/appNode";
import { Textarea } from "@/components/ui/textarea";

const StringParam = ({
  param,
  value,
  updateNodeParamValue,
  disabled,
}: ParamProps) => {
  const [inputValue, setInputValue] = useState(value);
  const id = useId();

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  let Component: any = Input;
  if (param.variant === "textarea") {
    Component = Textarea;
  }
  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <span className="text-red-500 px-2">*</span>}
      </Label>
      <Component
        id={id}
        value={inputValue}
        onChange={(e: any) => {
          setInputValue(e.target.value);
        }}
        onBlur={(e: any) => {
          updateNodeParamValue(e.target.value);
        }}
        placeholder="Enter value here"
        className="text-xs"
        disabled={disabled}
      />
      {param.helperText && (
        <p className="px-2 text-muted-foreground">{param.helperText}</p>
      )}
    </div>
  );
};

export default StringParam;
