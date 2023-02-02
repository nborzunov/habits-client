import ky from 'ky';

const api = ky.create({
    prefixUrl: import.meta.env.PROD
        ? 'https://habits-server-production.up.railway.app/'
        : 'http://localhost:8080/',
    hooks: {
        beforeRequest: [
            (options) => {
                const token = localStorage.getItem('authToken');
                console.log(token);
                if (token) {
                    options.headers.set('Authorization', token);
                }
            },
        ],
    },
});

export default api;
