"use client";

import { useFormStatus } from "react-dom";
import type { Theme } from "@/lib/theme";

interface Choice {
  value: string;
  label: string;
  lang?: string;
  preview?: Theme;
}

interface Props {
  name: "theme" | "language";
  label: string;
  selected: string;
  choices: Choice[];
  action: (data: FormData) => Promise<void>;
}

export default function PreferenceSelector({ action, ...props }: Props) {
  return (
    <form action={action} className="preference-form">
      <PreferenceOptions {...props} />
    </form>
  );
}

function PreferenceOptions({ name, label, selected, choices }: Omit<Props, "action">) {
  const { pending } = useFormStatus();

  return (
    <fieldset disabled={pending}>
      <legend className="preference-heading">{label}</legend>
      <div className="preference-options" data-preference={name}>
        {choices.map(({ value, label: title, lang, preview }) => (
          <button
            key={value}
            type="submit"
            name={name}
            value={value}
            lang={lang}
            aria-pressed={value === selected}
            className="motion-control preference-option"
          >
            {preview && <span className="theme-swatch" data-swatch={preview} aria-hidden="true" />}
            <span className="preference-label">
              {title}
              <span className="preference-indicator" aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
