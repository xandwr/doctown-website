import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

// GET /api/docpacks/[docpack_id]/job - Get latest job for docpack
export const GET: RequestHandler = async ({ params, cookies }) => {
    const token = cookies.get('session_token');

    if (!token) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { docpack_id } = params;

    const response = await fetch(`${PUBLIC_BACKEND_URL}/api/v1/docpacks/${docpack_id}/job`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const error = await response.text();
        return json({ error }, { status: response.status });
    }

    const data = await response.json();
    return json(data);
};
