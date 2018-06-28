// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/cohortassessmenttracker'
  },

  staging: {
    client: 'pg',
    connection: {
      database: '[insert db name after deploying to heroku]',
      user:     '[insert db username after deploying to heroku]',
      password: '[insert db password after deploying to heroku]'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      database: '[insert db name after deploying to heroku]',
      user:     '[insert db username after deploying to heroku]',
      password: '[insert db password after deploying to heroku]'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
