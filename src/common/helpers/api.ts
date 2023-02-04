import ky from 'ky';

const api = ky.create({
    prefixUrl: import.meta.env.PROD
        ? 'https://habits-server-production.up.railway.app/'
        : 'http://localhost:8080/',
    hooks: {
        beforeRequest: [
            (options) => {
                const token = localStorage.getItem('authToken');

                if (token) {
                    options.headers.set('Authorization', token);
                }
            },
        ],
        afterResponse: [
            async (_request, _options, response) => {
                if (!response.ok) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    response.data = await response.json();
                    return response;
                }
            },
        ],
    },
});

export default api;
