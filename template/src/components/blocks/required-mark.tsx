/**
 * The red `*` after a required field's label (gmhs, manage-form). The leading space sits inside the span so the label
 * doesn't run into it; it stays in the accessible name ("Họ tên *"), which tests and screen readers rely on.
 */
export function RequiredMark() {
  return <span className="text-destructive-text"> *</span>;
}
