import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

// POST /api/jobs - Create generation job
export const POST: RequestHandler = async ({ request, cookies }) => {
    const token = cookies.get('session_token');

    if (!token) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const response = await fetch(`${PUBLIC_BACKEND_URL}/api/v1/jobs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const error = await response.text();
        return json({ error }, { status: response.status });
    }

    const data = await response.json();
    return json(data);
};
