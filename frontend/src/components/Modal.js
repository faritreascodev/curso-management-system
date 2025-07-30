"use client"

import { useEffect } from "react"
import classNames from "classnames"

const Modal = ({ isOpen, onClose, title, children, size = "md", showCloseButton = true }) => {
    // Cerrar modal con tecla Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener("keydown", handleEscape)
            document.body.style.overflow = "hidden"
        }

        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.body.style.overflow = "unset"
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className={classNames("relative bg-white rounded-lg shadow-xl w-full", sizeClasses[size])}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    {(title || showCloseButton) && (
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                            {showCloseButton && (
                                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                                    <i className="fas fa-times text-xl"></i>
                                </button>
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6">{children}</div>
                </div>
            </div>
        </div>
    )
}

export default Modal
