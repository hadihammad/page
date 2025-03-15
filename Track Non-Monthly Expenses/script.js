let categories = [];

// Core functionality
function renderCategories() {
  calculateTotals();
  const container = document.getElementById('categoriesContainer');
  container.innerHTML = '';

  categories.forEach((category, catIndex) => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category-box';
    categoryDiv.innerHTML = `
      <div class="category-header">
        <h3>${category.name} (Total: $${category.total.toFixed(2)})</h3>
        <div class="buttons">
          <button onclick="addSubcategoryPrompt(${catIndex})">+ Subcategory</button>
          <button onclick="addItemForm(${catIndex})">+ Item</button>
          <button onclick="updateCategoryPrompt(${catIndex})">✏️</button>
          <button onclick="deleteCategory(${catIndex})">🗑️</button>
        </div>
      </div>
    `;

    // Render subcategories
    const subcategoriesDiv = document.createElement('div');
    category.subcategories.forEach((sub, subIndex) => {
      const subDiv = document.createElement('div');
      subDiv.className = 'subcategory-box';
      subDiv.innerHTML = `
        <div class="subcategory-header">
          <h4>${sub.name} (Total: $${sub.total.toFixed(2)})</h4>
          <div class="buttons">
            <button onclick="addItemForm(${catIndex}, ${subIndex})">+ Item</button>
            <button onclick="updateSubcategoryPrompt(${catIndex}, ${subIndex})">✏️</button>
            <button onclick="deleteSubcategory(${catIndex}, ${subIndex})">🗑️</button>
          </div>
        </div>
      `;

      // Render items in subcategory
      const itemsDiv = document.createElement('div');
      sub.items.forEach((item, itemIndex) => {
        itemsDiv.appendChild(createItemElement(catIndex, subIndex, itemIndex, item));
      });
      subDiv.appendChild(itemsDiv);
      subcategoriesDiv.appendChild(subDiv);
    });
    categoryDiv.appendChild(subcategoriesDiv);

    // Render items directly in category
    const itemsDiv = document.createElement('div');
    category.items.forEach((item, itemIndex) => {
      itemsDiv.appendChild(createItemElement(catIndex, null, itemIndex, item));
    });
    categoryDiv.appendChild(itemsDiv);

    container.appendChild(categoryDiv);
  });
}

function createItemElement(catIndex, subIndex, itemIndex, item) {
  const div = document.createElement('div');
  div.className = 'item-box';
  div.innerHTML = `
    <span>${item.name} - $${item.amount.toFixed(2)} (${item.dates.join(', ')})</span>
    <div class="buttons">
      <button onclick="updateItemPrompt(${catIndex}, ${subIndex}, ${itemIndex})">✏️</button>
      <button onclick="deleteItem(${catIndex}, ${subIndex}, ${itemIndex})">🗑️</button>
    </div>
  `;
  return div;
}

// Calculation
function calculateTotals() {
  let globalTotal = 0;
  let totalItems = 0;

  categories.forEach(category => {
    category.total = 0;

    // Calculate subcategory totals
    category.subcategories.forEach(sub => {
      sub.total = sub.items.reduce((sum, item) => sum + item.amount, 0);
      category.total += sub.total;
      totalItems += sub.items.length;
    });

    // Add direct items
    category.total += category.items.reduce((sum, item) => sum + item.amount, 0);
    totalItems += category.items.length;

    globalTotal += category.total;
  });

  document.getElementById('globalTotal').textContent = globalTotal.toFixed(2);
  document.getElementById('totalItems').textContent = totalItems;
}

// CRUD Operations
function addCategory() {
  const name = document.getElementById('categoryName').value.trim();
  if (name) {
    categories.push({ name, subcategories: [], items: [], total: 0 });
    document.getElementById('categoryName').value = '';
    renderCategories();
  }
}

function addSubcategoryPrompt(catIndex) {
  const name = prompt('Enter subcategory name:');
  if (name) {
    categories[catIndex].subcategories.push({ name, items: [], total: 0 });
    renderCategories();
  }
}

function addItemForm(catIndex, subIndex) {
  const form = document.createElement('div');
  form.innerHTML = `
    <input type="text" placeholder="Item name" class="item-name">
    <input type="number" placeholder="Amount" class="item-amount" step="0.01">
    <input type="date" class="item-date">
    <button onclick="addItem(${catIndex}, ${subIndex}, this)">Add</button>
  `;
  const target = subIndex !== undefined ?
    document.querySelectorAll('.subcategory-box')[subIndex] :
    document.querySelectorAll('.category-box')[catIndex];
  target.appendChild(form);
}

function addItem(catIndex, subIndex, button) {
  const form = button.parentElement;
  const item = {
    name: form.querySelector('.item-name').value.trim(),
    amount: parseFloat(form.querySelector('.item-amount').value),
    dates: [form.querySelector('.item-date').value]
  };

  if (item.name && !isNaN(item.amount)) {
    if (subIndex !== undefined) {
      categories[catIndex].subcategories[subIndex].items.push(item);
    } else {
      categories[catIndex].items.push(item);
    }
    form.remove();
    renderCategories();
  }
}

// Update/Delete functions
function updateCategoryPrompt(catIndex) {
  const newName = prompt('New category name:', categories[catIndex].name);
  if (newName) {
    categories[catIndex].name = newName;
    renderCategories();
  }
}

function updateSubcategoryPrompt(catIndex, subIndex) {
  const newName = prompt('New subcategory name:', categories[catIndex].subcategories[subIndex].name);
  if (newName) {
    categories[catIndex].subcategories[subIndex].name = newName;
    renderCategories();
  }
}

function updateItemPrompt(catIndex, subIndex, itemIndex) {
  const item = subIndex !== undefined ?
    categories[catIndex].subcategories[subIndex].items[itemIndex] :
    categories[catIndex].items[itemIndex];

  const newName = prompt('New item name:', item.name);
  const newAmount = parseFloat(prompt('New amount:', item.amount));
  const newDate = prompt('New date (YYYY-MM-DD):', item.dates[0]);

  if (newName && !isNaN(newAmount) && newDate) {
    item.name = newName;
    item.amount = newAmount;
    item.dates[0] = newDate;
    renderCategories();
  }
}

function deleteCategory(catIndex) {
  categories.splice(catIndex, 1);
  renderCategories();
}

function deleteSubcategory(catIndex, subIndex) {
  categories[catIndex].subcategories.splice(subIndex, 1);
  renderCategories();
}

function deleteItem(catIndex, subIndex, itemIndex) {
  if (subIndex !== undefined) {
    categories[catIndex].subcategories[subIndex].items.splice(itemIndex, 1);
  } else {
    categories[catIndex].items.splice(itemIndex, 1);
  }
  renderCategories();
}

// Import/Export
function exportData() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Type\tName\tAmount\tDate\n"; // Header

  categories.forEach(category => {
    csvContent += `Category\t${category.name}\t\t\n`;
    category.subcategories.forEach(sub => {
      csvContent += `Subcategory\t${sub.name}\t\t\n`;
      sub.items.forEach(item => {
        item.dates.forEach(date => {
          csvContent += `Item\t${item.name}\t${item.amount}\t${date}\n`;
        });
      });
    });
    category.items.forEach(item => {
      item.dates.forEach(date => {
        csvContent += `Item\t${item.name}\t${item.amount}\t${date}\n`;
      });
    });
  });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `expenses_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
}

function importData() {
  const file = document.getElementById('importFile').files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      const rows = text.split('\n').slice(1); // Skip header
      categories = [];

      rows.forEach(row => {
        const [type, name, amount, date] = row.split('\t');
        if (type === 'Category') {
          categories.push({ name, subcategories: [], items: [], total: 0 });
        } else if (type === 'Subcategory') {
          const parentCategory = categories[categories.length - 1];
          parentCategory.subcategories.push({ name, items: [], total: 0 });
        } else if (type === 'Item') {
          const parentCategory = categories[categories.length - 1];
          const parentSubcategory = parentCategory.subcategories[parentCategory.subcategories.length - 1];
          const item = { name, amount: parseFloat(amount), dates: [date] };
          if (parentSubcategory) {
            parentSubcategory.items.push(item);
          } else {
            parentCategory.items.push(item);
          }
        }
      });

      renderCategories();
    };
    reader.readAsText(file);
  }
}