
exports.up = function(knex, Promise) {
  return Promise.all([
    // Creating cohorts table.
    knex.schema.createTable('cohorts', (table) => {
      table.increments('cohortid');
      table.string('cohortname').notNullable();
      table.datetime('startdate').notNullable();
      table.datetime('enddate').notNullable();
      table.timestamp('createdat').defaultTo(knex.fn.now());
      table.timestamp('updatedat').defaultTo(knex.fn.now());
    }),
    // Creating usertypes table.
    knex.schema.createTable('usertypes', (table) => {
      table.increments('usertypeid').primary();
      table.string('usertypename').notNullable();
    }),
    // Creating categories table.
    knex.schema.createTable('categories', (table) => {
      table.increments('categoryid').primary();
      table.string('categoryname').notNullable();
    })
  ])
  .then(() => {
    // Now that all of our top tables have been created, we can create
    // our dependency tables.
    return Promise.all([
      // Creating our users table.
      knex.schema.createTable('users', (table) => {
        table.increments('userid');
        table.string('name').notNullable();
        table.string('email').unique().notNullable();
        table.string('passwordhash').notNullable();
        table.string('profilepicture');
        table.integer('usertypeid').references('usertypes.usertypeid').notNullable().onDelete('CASCADE');
      }),
      // Creating cohortmembers table.
      knex.schema.createTable('cohortmembers', (table) => {
        table.integer('cohortid').references('cohorts.cohortid').notNullable().onDelete('CASCADE');
        table.integer('userid').references('users.userid').notNullable().onDelete('CASCADE');
        table.boolean('completed').defaultTo(false);
      }),
      // Creating subcategories table.
      knex.schema.createTable('subcategories', (table) => {
        table.increments('subcategoriesid');
        table.integer('categoryid').references('categories.categoryid').notNullable().onDelete('CASCADE');
        table.string('subcategoryname').notNullable();
      })
    ])
  })
  .then(() => {
    // Now that we have created our users, cohortmembers, and subcategories
    // tables, we can create our standards, then student assessment tables
    // respectively in order.
    return Promise.all([
      // Creating our standards table.
      knex.schema.createTable('standards', (table) => {
        table.increments('standardid');
        table.integer('subcategoryid').references('subcategories.subcategoriesid').notNullable().onDelete('CASCADE');
        table.string('standardname').notNullable();
      })
    ])
    .then(() => {
      // Lastly, creating our student assessment.
      knex.schema.createTable('studentassessments', (table) => {
        table.integer('userid').references('users.userid').notNullable().onDelete('CASCADE');
        table.integer('standardid').references('standards.standardid').notNullable().onDelete('CASCADE');
      });
    })
    .catch((error) => {
      // There was an error at some point along the chain, let's log this now.
      console.error('Initial migration error:', error);
    })
  });
};

exports.down = function(knex, Promise) {
  // Here, we need to UNDO the actions of:
  // Creating our cohorts, usertypes, categories, users, cohortmembers, subcategories,
  // standards, and studentassessments tables.
  return Promise.all([
    knex.schema.dropTableIfExists('studentassessments'),
    knex.schema.dropTableIfExists('standards'),
    knex.schema.dropTableIfExists('subcategories'),
    knex.schema.dropTableIfExists('cohortmembers'),
    knex.schema.dropTableIfExists('users'),
    knex.schema.dropTableIfExists('categories'),
    knex.schema.dropTableIfExists('usertypes'),
    knex.schema.dropTableIfExists('cohorts')
  ]);
};
