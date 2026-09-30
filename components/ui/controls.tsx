"use client";

import { useId, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

type BtnVariant = "text" | "outlined" | "contained";

export function Button({
  variant = "text",
  icon,
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; icon?: IconName }) {
  return (
    <button type="button" className={`btn btn-${variant}${className ? ` ${className}` : ""}`} {...rest}>
      {icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
    </button>
  );
}

export function IconButton({
  icon,
  label,
  size = "md",
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon: IconName; label: string; size?: "sm" | "md" }) {
  return (
    <button
      type="button"
      className={`icon-btn icon-btn-${size}${className ? ` ${className}` : ""}`}
      aria-label={label}
      title={label}
      {...rest}
    >
      <Icon name={icon} size={size === "sm" ? 18 : 24} />
    </button>
  );
}

export function TextField({
  label,
  value,
  onChange,
  multiline,
  placeholder,
  helper,
  type = "text",
  autoFocus,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
  helper?: string;
  type?: string;
  autoFocus?: boolean;
  rows?: number;
}) {
  const id = useId();
  const common = {
    id,
    value,
    placeholder: placeholder ?? " ",
    autoFocus,
    className: "field-input",
    "aria-describedby": helper ? `${id}-help` : undefined,
  };
  return (
    <div className={`field${multiline ? " field-multiline" : ""}`}>
      {multiline ? (
        <textarea {...common} rows={rows} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input {...common} type={type} onChange={(e) => onChange(e.target.value)} />
      )}
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {helper && (
        <div id={`${id}-help`} className="field-helper">
          {helper}
        </div>
      )}
    </div>
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={label}
      className={`switch${checked ? " switch-on" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span className="switch-track" />
      <span className="switch-thumb" />
    </button>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          className={`segmented-item${value === o.value ? " is-active" : ""}`}
          onClick={() => onChange(o.value)}
        >
          {value === o.value && <Icon name="check" size={16} />}
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Card({ title, subtitle, actions, children }: { title?: string; subtitle?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <section className="card">
      {(title || actions) && (
        <header className="card-header">
          <div>
            {title && <h2 className="card-title">{title}</h2>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </header>
      )}
      <div className="card-body">{children}</div>
    </section>
  );
}
