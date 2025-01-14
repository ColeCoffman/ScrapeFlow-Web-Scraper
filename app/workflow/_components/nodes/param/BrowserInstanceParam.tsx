"use client";

import { ParamProps } from "@/types/appNode";
import React from "react";

const BrowserInstanceParam = ({ param }: ParamProps) => {
  return <span className="text-xs">{param.name}</span>;
};

export default BrowserInstanceParam;
