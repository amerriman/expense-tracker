module.exports = {
    
    development: {
        client: 'pg',
        connection: 'postgress://localhost/[DATABASE HERE]'
    },
    
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL
    }
}