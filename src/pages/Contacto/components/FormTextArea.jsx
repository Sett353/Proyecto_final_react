import { forwardRef } from "react";

const FormTextArea = forwardRef(function FormTextArea({ label, name, placeholder, required = false, error = "", rows, ...rest }, ref) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="block mb-1.5 text-sm font-semibold text-violet-900 dark:text-violet-200"
      >
        {label} {required && <span className="text-fuchsia-400">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        rows={4}
        required={required}
        className="w-full resize-y rounded-lg border border-violet-200 dark:border-violet-900 bg-violet-50 dark:bg-zinc-950 px-3 py-2.5 text-zinc-900 dark:text-violet-50 shadow-sm outline-none transition placeholder:text-zinc-500 hover:border-violet-500 focus:border-fuchsia-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-violet-200 dark:focus:ring-violet-950"
        ref={ref}
        {...rest}
      />
      {error && (
        <span className="text-sm text-fuchsia-400">
          {error}
        </span>
      )}
    </div>
  );
});

export default FormTextArea;