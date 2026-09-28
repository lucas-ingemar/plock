import { type RegistrationData, toHaulRequest } from "./types"

export const createHaul = async (data: RegistrationData) => {
    const body = new FormData()
    body.append("request", JSON.stringify(toHaulRequest(data)))

    if (data.receiptFile) {
        body.append("receipt", data.receiptFile)
    }

    const response = await fetch("/api/hauls", { method: "POST", body })

    if (!response.ok) {
        throw new Error(`Failed to create haul: ${response.status}`)
    }

    return response.json()
}
