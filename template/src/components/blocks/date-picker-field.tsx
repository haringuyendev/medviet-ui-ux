import type { ComponentProps } from "react";

import { DateField } from "./date-field";

/**
 * A date picked from a calendar or typed as DD/MM/YYYY (web-emr SelectDate / PickerDate). Same as DateField, whose
 * calendar is on by default; kept so screens that import it keep working.
 */
export function DatePickerField(
  props: Omit<ComponentProps<typeof DateField>, "picker">,
) {
  return <DateField {...props} picker />;
}
