"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useId, useState } from "react";
import { ParamProps } from "@/types/appNode";

const StringParam = ({ param, value, updateNodeParamValue }: ParamProps) => {
  const [inputValue, setInputValue] = useState(value);
  const id = useId();

  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <span className="text-red-500 px-2">*</span>}
      </Label>
      <Input
        id={id}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        onBlur={(e) => {
          updateNodeParamValue(e.target.value);
        }}
        placeholder="Enter value here"
        className="text-xs"
      />
      {param.helperText && (
        <p className="px-2 text-muted-foreground">{param.helperText}</p>
      )}
    </div>
  );
};

export default StringParam;
