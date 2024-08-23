"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DropdownMenuFilter({ setDropdownVal }) {
  const [position, setPosition] = useState("bottom");

  const filteringHandler = (value) => {
    setDropdownVal(value);
  };

  const categories = [
    "Allowed-With-License-Passthrough",
    "Allowed-With-Indication",
    "Allowed-With-Credit",
    "Allowed-With-RevenueShare-[.0-9+]%",
    "[Before/After]-[0-9+]-Years-Derivation",
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Filter UDL</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filter By UDL</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={position}
          onValueChange={filteringHandler}>
          {categories.map((category, idx) => {
            return (
              <DropdownMenuRadioItem value={category} key={idx}>
                {category}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
