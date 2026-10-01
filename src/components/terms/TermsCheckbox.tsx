import { TERMS_CHECKBOX_LABEL } from "@/lib/terms";

type TermsCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
};

/** Caixa "Li e concordo com os Termos de Uso." */
export function TermsCheckbox({
  checked,
  onChange,
  id = "aceite-termos",
  disabled = false,
}: TermsCheckboxProps) {
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-border accent-brand disabled:cursor-not-allowed"
      />
      <label
        htmlFor={id}
        className="cursor-pointer text-sm leading-6 text-foreground"
      >
        {TERMS_CHECKBOX_LABEL}
      </label>
    </div>
  );
}
