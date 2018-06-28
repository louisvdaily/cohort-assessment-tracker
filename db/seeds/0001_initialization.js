let standards = require('../../utilities/standardsMarkdownParser')();


exports.seed = function(knex, Promise) {

  // Rolling back migrations.
  return knex.migrate.rollback()
    .then(() => {
      // Running all migrations forward.
      return knex.migrate.latest();
    })
    .then(function () {
      return Promise.all([
        // Inserting user types.
        knex('usertypes').insert([
          {usertypename: 'admin'},
          {usertypename: 'instructor'},
          {usertypename: 'student'}
        ])
      ])
    })
    .then(() => {
      // Need to seed categories, subcategories, and standards now.
      let categories = [];
      let subcategories = [];
      let standardsArray = [];

      Object.keys(standards).forEach((category, index) => {
        categories.push({categoryname: category});
        let categoryObject = standards[category];
        let subcategoryKeys = Object.keys(categoryObject.subcategories);
        let categoryID = ++index;

        subcategoryKeys.forEach((subcategoryKey, keyIndex) => {
          let subcategoryID = ++keyIndex;
          subcategories.push({categoryid: categoryID, subcategoryname: subcategoryKey})
          let standardNames = categoryObject.subcategories[subcategoryKey].standards;
          
          standardNames.forEach(standardName => {
            standardsArray.push({subcategoryid: subcategoryID, standardname: standardName});
          });
        });
      });

      return knex('categories').insert(categories)
      .then(() => {
        return knex('subcategories').insert(subcategories);
      })
      .then(() => {
        return knex('standards').insert(standardsArray);
      })
      .then(() => {
        console.log('Seeding complete.');
      })
    });
};
