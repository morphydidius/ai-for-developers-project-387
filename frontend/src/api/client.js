const BASE = '/api';
async function request(url, init) {
    const res = await fetch(`${BASE}${url}`, {
        headers: { 'Content-Type': 'application/json' },
        ...init,
    });
    if (res.status === 204)
        return undefined;
    const data = await res.json();
    if (!res.ok)
        throw data;
    return data;
}
export const api = {
    eventTypes: {
        list: () => request('/event-types'),
        create: (body) => request('/event-types', { method: 'POST', body: JSON.stringify(body) }),
        update: (id, body) => request(`/event-types/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
        delete: (id) => request(`/event-types/${id}`, { method: 'DELETE' }),
    },
    slots: {
        list: () => request('/slots'),
        create: (body) => request('/slots', { method: 'POST', body: JSON.stringify(body) }),
        update: (id, body) => request(`/slots/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
        delete: (id) => request(`/slots/${id}`, { method: 'DELETE' }),
        generate: (body) => request('/slots/generate', { method: 'POST', body: JSON.stringify(body) }),
    },
    events: {
        list: () => request('/events'),
        create: (body) => request('/events', { method: 'POST', body: JSON.stringify(body) }),
        delete: (id) => request(`/events/${id}`, { method: 'DELETE' }),
    },
};
