export class ApiError extends Error {
    status?: number;
    body?: any;

    constructor(message: string, status?: number, body?: any) {
        super(message);
        this.status = status;
        this.body = body;
    }
}

export class ApiClient {
    constructor(private baseHeaders: Record<string, string> = {}) {}

    async get<T>(url: string, body?: any): Promise<T> {
        return this.request<T>(url, {
            method: 'GET',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async post<T>(url: string, body?: any): Promise<T> {
        return this.request<T>(url, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }
    async put<T>(url: string, body?: any): Promise<T> {
        return this.request<T>(url, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    async delete<T>(url: string, body?: any): Promise<T> {
        return this.request<T>(url, {
            method: 'DELETE',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    private async request<T>(
        url: string,
        options: RequestInit
    ): Promise<T> {
        const res = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...this.baseHeaders,
                ...(options.headers || {}),
            },
        });

        const text = await res.text();

        let data: any;
        try {
            data = text ? JSON.parse(text) : {};
        } catch {
            data = text;
        }

        if (!res.ok) {
            const errorMessage = 
                data?.result?.error ||
                data?.result?.message ||
                data?.error ||
                data?.message ||
                res.statusText;
                
            throw new ApiError(errorMessage, res.status, data);
        }

        return data as T;
    }
}