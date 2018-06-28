function parseMarkdown() {

  function Category () {
    this.categoryname = null;
    this.subcategories = {};
  }

  function Subcategory () {
    this.subcategoryname = null;
    this.standards = [];
  }

  let fs = require('fs');
  let path = require('path');
  let standardsFilePath = path.join(__dirname, '..', 'standards.md');
  let standards = {};

  let currentCategory = null;
  let currentSubcategory = null;

  let standardsContents = fs.readFileSync(standardsFilePath, 'utf8');
  let standardsLines = standardsContents.split('\n');

  // console.log('Standards Lines:', standardsLines);
  standardsLines.forEach(line => {
    let category = line.split('## ');
    let subcategory = line.split('### ');
    let standard = line.split('* ');

    // Checking to see if current line is a category.
    if (category[0] === '' && category.length > 1) {
      // We have a new category!
      currentCategory = new Category();
      currentCategory.categoryname = category[1];
      standards[currentCategory.categoryname] = currentCategory;
    } else if (subcategory[0] === '' && subcategory.length > 1) {
      // We have a new subcategory!
      currentSubcategory = new Subcategory();
      currentSubcategory.subcategoryname = subcategory[1];
      currentCategory.subcategories[currentSubcategory.subcategoryname] = currentSubcategory;
    } else if (standard[0] === '' && standard.length > 1) {
      // We have a new standard to add to the currentSubcategory!
      currentSubcategory.standards.push(standard[1]);
    }
  });

  return standards;
}

module.exports = parseMarkdown;
