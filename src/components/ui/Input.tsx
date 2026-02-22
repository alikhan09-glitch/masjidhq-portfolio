import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  type = "text",
  className = "",
  error,
  helperText,
  required,
  disabled,
  id,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  const isPassword = type === "password";
  const inputType =
    isPassword && showPassword ? "text" : type;

  return (
    <div className="space-y-1 w-full">
      {/* Label */}
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {/* Input Wrapper */}
      <div className="relative">
        <input
          id={inputId}
          type={inputType}
          disabled={disabled}
          required={required}
          className={`
            w-full rounded-xl border px-4 py-2 text-sm
            transition-all duration-200
            ${error
              ? "border-red-400 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/30"
            }
            ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
            ${className}
          `}
          {...props}
        />

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}

      {/* Helper Text */}
      {!error && helperText && (
        <p className="text-xs text-gray-500 mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
}
