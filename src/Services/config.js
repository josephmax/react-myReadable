const URL_CONFIG = {
    'development': {
        baseUrl: 'http://localhost:3001',
        srcUrl: 'http://localhost:3000'
    },
    'production': {
        baseUrl: '',
        srcUrl: ''
    }
}
const env = process.env.NODE_ENV === 'production' ? 'production' : 'development'
export const baseUrl = URL_CONFIG[env].baseUrl
