"use client"
import classNames from "classnames"

const Button = ({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    icon,
    onClick,
    className,
    ...props
}) => {
    const baseClasses =
        "font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

    const variantClasses = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
        secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
        danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
        success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
        outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500",
    }

    const sizeClasses = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    }

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={classNames(baseClasses, variantClasses[variant], sizeClasses[size], className)}
            {...props}
        >
            <div className="flex items-center justify-center space-x-2">
                {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    icon && <i className={icon}></i>
                )}
                <span>{children}</span>
            </div>
        </button>
    )
}

export default Button
