import jwtDecode from "jwt-decode"

export const isTokenValid = (token) => {
    try {
        if (!token) return false

        const decoded = jwtDecode(token)
        const currentTime = Date.now() / 1000

        return decoded.exp > currentTime
    } catch (error) {
        return false
    }
}

export const getTokenData = (token) => {
    try {
        if (!token) return null
        return jwtDecode(token)
    } catch (error) {
        return null
    }
}
