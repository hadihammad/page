let categories = [];

// Add Main Category
document.getElementById('addCategory').addEventListener('click', () => {
  const categoryName = document.getElementById('categoryName').value.trim();
  if (categoryName) {
    categories.push({
      name: categoryName,
      items: [],
      subcategories: [],
    });
    renderCategories();
    document.getElementById('categoryName').value = '';
    updateGlobalTotals(); // Update global totals
  }
});

// Render Categories
function renderCategories() {
  const container = document.getElementById('categories');
  container.innerHTML = '';
  categories.forEach((category, catIndex) => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category';
    categoryDiv.innerHTML = `
      <h2>${category.name}</h2>
      <button onclick="addSubcategory(${catIndex})">Add Subcategory</button>
      <button onclick="addItem(${catIndex})">Add Item</button>
      <div class="subcategories"></div>
      <div class="total">Total Items: ${calculateTotalItems(category)} | Total Amount: $${calculateTotalAmount(category)}</div>
    `;
    container.appendChild(categoryDiv);

    // Render Subcategories
    const subcategoriesDiv = categoryDiv.querySelector('.subcategories');
    category.subcategories.forEach((subcategory, subIndex) => {
      const subcategoryDiv = document.createElement('div');
      subcategoryDiv.className = 'subcategory';
      subcategoryDiv.innerHTML = `
        <h3>${subcategory.name}</h3>
        <button onclick="addItem(${catIndex}, ${subIndex})">Add Item</button>
        <div class="items"></div>
        <div class="total">Total Items: ${calculateTotalItems(subcategory)} | Total Amount: $${calculateTotalAmount(subcategory)}</div>
      `;
      subcategoriesDiv.appendChild(subcategoryDiv);

      // Render Items
      const itemsDiv = subcategoryDiv.querySelector('.items');
      subcategory.items.forEach((item, itemIndex) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.innerHTML = `
          <span>${item.text}: $${item.value}</span>
          <div class="item-controls">
            <button onclick="updateItem(${catIndex}, ${subIndex}, ${itemIndex})">Edit</button>
            <button onclick="deleteItem(${catIndex}, ${subIndex}, ${itemIndex})">Delete</button>
          </div>
        `;
        itemsDiv.appendChild(itemDiv);
      });
    });

    // Render Items in Main Category
    const itemsDiv = document.createElement('div');
    itemsDiv.className = 'items';
    category.items.forEach((item, itemIndex) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'item';
      itemDiv.innerHTML = `
        <span>${item.text}: $${item.value}</span>
        <div class="item-controls">
          <button onclick="updateItem(${catIndex}, null, ${itemIndex})">Edit</button>
          <button onclick="deleteItem(${catIndex}, null, ${itemIndex})">Delete</button>
        </div>
      `;
      itemsDiv.appendChild(itemDiv);
    });
    categoryDiv.appendChild(itemsDiv);
  });
  updateGlobalTotals(); // Update global totals after rendering
}

// Add Subcategory
function addSubcategory(catIndex) {
  const subcategoryName = prompt('Enter subcategory name:');
  if (subcategoryName) {
    categories[catIndex].subcategories.push({
      name: subcategoryName,
      items: [],
      subcategories: [],
    });
    renderCategories();
    updateGlobalTotals(); // Update global totals
  }
}

// Add Item
function addItem(catIndex, subIndex) {
  const text = prompt('Enter item name:');
  const value = parseFloat(prompt('Enter item value:'));
  if (text && !isNaN(value)) {
    if (subIndex !== undefined) {
      categories[catIndex].subcategories[subIndex].items.push({ text, value });
    } else {
      categories[catIndex].items.push({ text, value });
    }
    renderCategories();
    updateGlobalTotals(); // Update global totals
  }
}

// Update Item (fixed)
function updateItem(catIndex, subIndex, itemIndex) {
  const isMainCategory = subIndex === null || subIndex === undefined;
  const item = isMainCategory
    ? categories[catIndex].items[itemIndex]
    : categories[catIndex].subcategories[subIndex].items[itemIndex];
  
  const newText = prompt('Enter new item name:', item.text);
  const newValue = parseFloat(prompt('Enter new item value:', item.value));
  
  if (newText && !isNaN(newValue)) {
    if (isMainCategory) {
      categories[catIndex].items[itemIndex] = { text: newText, value: newValue };
    } else {
      categories[catIndex].subcategories[subIndex].items[itemIndex] = { text: newText, value: newValue };
    }
    renderCategories();
    updateGlobalTotals();
  }
}

// Delete Item (fixed)
function deleteItem(catIndex, subIndex, itemIndex) {
  if (confirm('Are you sure you want to delete this item?')) {
    const isMainCategory = subIndex === null || subIndex === undefined;
    if (isMainCategory) {
      categories[catIndex].items.splice(itemIndex, 1);
    } else {
      categories[catIndex].subcategories[subIndex].items.splice(itemIndex, 1);
    }
    renderCategories();
    updateGlobalTotals();
  }
}

// Calculate Total Items
function calculateTotalItems(category) {
  let total = category.items.length;
  category.subcategories.forEach((subcategory) => {
    total += calculateTotalItems(subcategory);
  });
  return total;
}

// Calculate Total Amount
function calculateTotalAmount(category) {
  let total = category.items.reduce((sum, item) => sum + item.value, 0);
  category.subcategories.forEach((subcategory) => {
    total += calculateTotalAmount(subcategory);
  });
  return total.toFixed(2);
}

// Update Global Totals
function updateGlobalTotals() {
  let totalItems = 0;
  let totalAmount = 0;

  categories.forEach((category) => {
    totalItems += calculateTotalItems(category);
    totalAmount += parseFloat(calculateTotalAmount(category));
  });

  document.getElementById('totalItems').textContent = `Total Items: ${totalItems}`;
  document.getElementById('totalAmount').textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
}

// Export to CSV
document.getElementById('exportData').addEventListener('click', () => {
  let csvContent = 'Field\tValue\n'; // Tab-delimited header
  categories.forEach((category) => {
    csvContent += `Category\t${category.name}\n`; // Tab-delimited category
    category.items.forEach((item) => {
      csvContent += `${item.text}\t${item.value}\n`; // Tab-delimited item
    });
    category.subcategories.forEach((subcategory) => {
      csvContent += `Subcategory\t${subcategory.name}\n`; // Tab-delimited subcategory
      subcategory.items.forEach((item) => {
        csvContent += `${item.text}\t${item.value}\n`; // Tab-delimited item
      });
    });
  });

  // Create a timestamp for the filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `expenses_${timestamp}.csv`;

  // Create and download the CSV file
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
});

// Import from CSV
document.getElementById('importData').addEventListener('click', () => {
  const file = document.getElementById('importFile').files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      categories = [];
      let currentCategory = null;
      let currentSubcategory = null;

      lines.forEach((line) => {
        const [field, value] = line.split('\t'); // Split by tab delimiter
        if (field === 'Category') {
          currentCategory = { name: value, items: [], subcategories: [] };
          categories.push(currentCategory);
          currentSubcategory = null;
        } else if (field === 'Subcategory') {
          currentSubcategory = { name: value, items: [], subcategories: [] };
          currentCategory.subcategories.push(currentSubcategory);
        } else if (field && value) {
          const item = { text: field, value: parseFloat(value) };
          if (currentSubcategory) {
            currentSubcategory.items.push(item);
          } else if (currentCategory) {
            currentCategory.items.push(item);
          }
        }
      });

      renderCategories();
      updateGlobalTotals(); // Update global totals after import
    };
    reader.readAsText(file);
  }
});