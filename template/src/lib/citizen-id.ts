// Căn cước công dân (CCCD) read from its QR code (a handheld reader types it, or the camera decodes it) or typed.
// The 2021–06/2024 QR is "số CCCD|số CMND|họ tên|ngày sinh|giới tính|địa chỉ|ngày cấp", dates DDMMYYYY; any field
// may be empty and the tail may be cut short. Same rules as health-exam's parse-scanned-citizen-id.

export type CitizenCard = {
  /** 12 digits */
  citizenId: string;
  /** the old 9-digit CMND, when the card carries it */
  oldId: string;
  fullName: string;
  /** DD/MM/YYYY, or "" when missing or not a real date (DateField's value format) */
  birthDate: string;
  /** "Nam" | "Nữ" as printed, or "" */
  gender: string;
  address: string;
  /** DD/MM/YYYY, or "" (a date after today is a misread) */
  issuedDate: string;
};

const CITIZEN_ID = /^\d{12}$/;

/** "15061988" → "15/06/1988", or "" when it isn't a real date (or is in the future, for ngày cấp). */
function compactDate(value: string, { past = false } = {}) {
  const m = value.trim().match(/^(\d{2})(\d{2})(\d{4})$/);
  if (!m) return "";
  const date = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  if (date.getDate() !== Number(m[1]) || date.getMonth() !== Number(m[2]) - 1)
    return "";
  if (past && date > new Date()) return "";
  return `${m[1]}/${m[2]}/${m[3]}`;
}

const blank: CitizenCard = {
  citizenId: "",
  oldId: "",
  fullName: "",
  birthDate: "",
  gender: "",
  address: "",
  issuedDate: "",
};

/**
 * The card in whatever a reader handed over (or the 12 digits typed by hand), or null when there is no số CCCD in it.
 * The card's own number is the first field, so a payload that also carries a 9-digit CMND can't be mistaken for it.
 */
export function parseCitizenCard(raw: string): CitizenCard | null {
  const text = raw.trim();
  if (!text) return null;
  if (CITIZEN_ID.test(text)) return { ...blank, citizenId: text };

  const [
    first = "",
    oldId = "",
    fullName = "",
    birth = "",
    gender = "",
    address = "",
    issued = "",
  ] = text.split("|").map((f) => f.trim());
  const citizenId = first.replace(/[\s.-]/g, "");
  if (CITIZEN_ID.test(citizenId))
    return {
      citizenId,
      oldId: /^\d{9}$/.test(oldId) ? oldId : "",
      fullName: fullName.replace(/\s+/g, " "),
      birthDate: compactDate(birth),
      gender: /^n[ữu]$/i.test(gender)
        ? "Nữ"
        : /^nam$/i.test(gender)
          ? "Nam"
          : "",
      address,
      issuedDate: compactDate(issued, { past: true }),
    };

  // A reader with another separator: a whole run of exactly 12 digits (a 15-digit number is a different number).
  const run = text.split(/\D+/).find((r) => CITIZEN_ID.test(r));
  return run ? { ...blank, citizenId: run } : null;
}
