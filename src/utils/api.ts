export interface FetchOptions extends RequestInit {
    timeout?: number;
    retries?: number;
    backoff?: number;
}

/**
 * Enhanced fetch with timeout and retry capabilities
 * @param url Request URL
 * @param options Fetch options + timeout, retries, backoff
 */
export async function fetchWithRetry(url: string, options: FetchOptions = {}): Promise<Response> {
    const {
        timeout = 10000,
        retries = 3,
        backoff = 1000,
        ...fetchOptions
    } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
        });
        clearTimeout(id);

        if (!response.ok) {
            // Throw to trigger retry for 5xx errors, but maybe we want to just return for 4xx?
            // For now, let's treat only network errors or 5xx as retryable if we wanted to get fancy,
            // but simple retry logic usually retries anything that throws or is not ok if we decide so.
            // However, retrying 404 is useless.
            // Let's retry on 5xx or network error (which throws).
            if (response.status >= 500) {
                throw new Error(`Request failed with status ${response.status}`);
            }
        }

        return response;
    } catch (error: any) {
        clearTimeout(id);

        if (retries > 0) {
            console.warn(`Fetch failed, retrying... (${retries} attempts left). Error:`, error);
            await new Promise(resolve => setTimeout(resolve, backoff));
            return fetchWithRetry(url, {
                ...options,
                retries: retries - 1,
                backoff: backoff * 1.5 // Exponential backoff
            });
        }

        throw error;
    }
}
