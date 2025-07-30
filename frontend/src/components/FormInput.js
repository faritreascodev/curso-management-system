"use client"
import classNames from "classnames"

const FormInput = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    required = false,
    error,
    disabled = false,
    icon,
    ...props
}) => {
    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className={`${icon} text-gray-400`}></i>
                    </div>
                )}

                <input
                    type={type}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={classNames(
                        "form-input w-full px-3 py-2 border rounded-lg shadow-sm transition-colors duration-200",
                        {
                            "pl-10": icon,
                            "border-red-300 focus:border-red-500": error,
                            "border-gray-300 focus:border-blue-500": !error,
                            "bg-gray-100 cursor-not-allowed": disabled,
                            "bg-white": !disabled,
                        },
                    )}
                    {...props}
                />
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600">
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    {error}
                </p>
            )}
        </div>
    )
}

export default FormInput
