import { Convert, type HaulRequest } from "./types/haulrequest"

export const createHaul = async (request: HaulRequest) => {
    const response = await fetch("/api/hauls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: Convert.haulRequestToJson(request),
    })

    if (!response.ok) {
        throw new Error(`Failed to create haul: ${response.status}`)
    }

    return response.json()
}
