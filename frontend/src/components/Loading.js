const Loading = ({ message = "Cargando..." }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-64 py-12">
            <div className="spinner mb-4"></div>
            <p className="text-gray-600 text-lg">{message}</p>
        </div>
    )
}

export default Loading
