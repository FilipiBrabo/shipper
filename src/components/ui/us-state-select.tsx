"use client";

import type * as SelectPrimitive from "@radix-ui/react-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const US_STATES = [
  "AK",
  "AL",
  "AR",
  "AZ",
  "CA",
  "CO",
  "CT",
  "DC",
  "DE",
  "FL",
  "GA",
  "HI",
  "IA",
  "ID",
  "IL",
  "IN",
  "KS",
  "KY",
  "LA",
  "MA",
  "MD",
  "ME",
  "MI",
  "MN",
  "MO",
  "MS",
  "MT",
  "NC",
  "ND",
  "NE",
  "NH",
  "NJ",
  "NM",
  "NV",
  "NY",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VA",
  "VT",
  "WA",
  "WI",
  "WV",
  "WY",
];

type UsStateSelectProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  triggerProps?: React.ComponentProps<typeof SelectPrimitive.Trigger>;
};

export function UsStateSelect({
  value,
  onValueChange,
  triggerProps,
}: UsStateSelectProps) {
  return (
    <Select value={value ?? undefined} onValueChange={onValueChange}>
      <SelectTrigger {...triggerProps}>
        <SelectValue placeholder="Select state" />
      </SelectTrigger>
      <SelectContent>
        {US_STATES.map((code) => (
          <SelectItem key={code} value={code}>
            {code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
