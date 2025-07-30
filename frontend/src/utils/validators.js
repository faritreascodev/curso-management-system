export const validators = {
    // Validar email
    email: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email) return "El email es obligatorio"
        if (!emailRegex.test(email)) return "Formato de email inválido"
        return null
    },

    // Validar contraseña
    password: (password) => {
        if (!password) return "La contraseña es obligatoria"
        if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres"
        return null
    },

    // Validar campo requerido
    required: (value, fieldName) => {
        if (!value || value.toString().trim() === "") {
            return `${fieldName} es obligatorio`
        }
        return null
    },

    // Validar número
    number: (value, fieldName, min = null, max = null) => {
        if (!value) return `${fieldName} es obligatorio`

        const num = Number.parseFloat(value)
        if (isNaN(num)) return `${fieldName} debe ser un número válido`

        if (min !== null && num < min) return `${fieldName} debe ser mayor o igual a ${min}`
        if (max !== null && num > max) return `${fieldName} debe ser menor o igual a ${max}`

        return null
    },

    // Validar longitud de texto
    length: (value, fieldName, min = null, max = null) => {
        if (!value) return `${fieldName} es obligatorio`

        const length = value.toString().length
        if (min !== null && length < min) return `${fieldName} debe tener al menos ${min} caracteres`
        if (max !== null && length > max) return `${fieldName} no puede exceder ${max} caracteres`

        return null
    },
}
