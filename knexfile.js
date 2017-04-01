module.exports = {
  test: {
    client: 'pg',
    connection: 'postgres://localhost/expense-tracker-test',
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/test'
    }
  },
  development: {
    client: 'pg',
    connection: 'postgres://localhost/expense-tracker',
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    // seeds: {
    //   directory: __dirname + '/db/seeds/development'
    // }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + '?ssl=true',
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    // seeds: {
    //   directory: __dirname + '/db/seeds/production'
    // }
  }
};
