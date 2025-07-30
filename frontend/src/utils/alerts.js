import Swal from "sweetalert2"

export const showAlert = {
    success: (title, text = "") => {
        return Swal.fire({
            icon: "success",
            title,
            text,
            confirmButtonColor: "#3b82f6",
            timer: 3000,
            timerProgressBar: true,
        })
    },

    error: (title, text = "") => {
        return Swal.fire({
            icon: "error",
            title,
            text,
            confirmButtonColor: "#3b82f6",
        })
    },

    warning: (title, text = "") => {
        return Swal.fire({
            icon: "warning",
            title,
            text,
            confirmButtonColor: "#3b82f6",
        })
    },

    info: (title, text = "") => {
        return Swal.fire({
            icon: "info",
            title,
            text,
            confirmButtonColor: "#3b82f6",
        })
    },

    confirm: (title, text = "", confirmButtonText = "Sí, confirmar") => {
        return Swal.fire({
            icon: "question",
            title,
            text,
            showCancelButton: true,
            confirmButtonColor: "#3b82f6",
            cancelButtonColor: "#6b7280",
            confirmButtonText,
            cancelButtonText: "Cancelar",
        })
    },

    confirmDelete: (title = "¿Estás seguro?", text = "Esta acción no se puede deshacer") => {
        return Swal.fire({
            icon: "warning",
            title,
            text,
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        })
    },
}
