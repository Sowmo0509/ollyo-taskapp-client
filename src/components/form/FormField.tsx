interface FormFieldProps {
  label: string;
  name: string;
  type: "text" | "textarea" | "select" | "date";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  options?: { value: string; label: string }[];
}

const FormField = ({ label, name, type, value, onChange, error, options }: FormFieldProps) => {
  const baseClasses = `mt-1 block w-full rounded-md border ${
    error ? "border-red-500" : "border-gray-300"
  } px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
    error ? "focus:ring-red-500" : "focus:ring-indigo-500"
  }`;

  const renderField = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            rows={3}
            className={baseClasses}
          />
        );
      case "select":
        return (
          <select name={name} id={name} value={value} onChange={onChange} className={baseClasses}>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            className={baseClasses}
          />
        );
    }
  };

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {renderField()}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FormField;