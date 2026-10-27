// Age from a birth date, in the bands clinics read (health-exam format-age): months alone under two years, years and
// months under six (Đối tượng khám splits at six), whole years after that. Counted in calendar months, not days ÷ 30.

export type Age =
  | { unit: "months"; months: number }
  | { unit: "yearsMonths"; years: number; months: number }
  | { unit: "years"; years: number };

/** "DD/MM/YYYY" (DateField's value) or a Date → Date, or null when incomplete or not a real date. */
function toDate(value: Date | string | null | undefined) {
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? null : value;
  const m = value?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const date = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  return date.getDate() === Number(m[1]) ? date : null;
}

/** The age band and its numbers, or null for an empty, half-typed, impossible or future birth date. */
export function ageOf(
  birth: Date | string | null | undefined,
  today: Date = new Date(),
): Age | null {
  const b = toDate(birth);
  if (!b) return null;
  let months =
    (today.getFullYear() - b.getFullYear()) * 12 +
    today.getMonth() -
    b.getMonth();
  if (today.getDate() < b.getDate()) months -= 1;
  if (months < 0) return null;
  if (months < 24) return { unit: "months", months };
  const years = Math.floor(months / 12);
  if (months < 72) return { unit: "yearsMonths", years, months: months % 12 };
  return { unit: "years", years };
}

/** "8 tháng", "3 tuổi 2 tháng", "35 tuổi", or "" when there is no age yet. */
export function formatAge(
  birth: Date | string | null | undefined,
  today?: Date,
) {
  const age = ageOf(birth, today);
  if (!age) return "";
  if (age.unit === "months") return `${age.months} tháng`;
  if (age.unit === "yearsMonths")
    return age.months
      ? `${age.years} tuổi ${age.months} tháng`
      : `${age.years} tuổi`;
  return `${age.years} tuổi`;
}
