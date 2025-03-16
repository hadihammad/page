let categories = [];

function renderCategories() {
  calculateTotals();
  const container = document.getElementById('categoriesContainer');
  container.innerHTML = '';

  categories.forEach((category, catIndex) => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = `category-box ${category.editing ? 'edit-mode' : ''}`;
    
    const headerContent = category.editing ? `
      <input type="text" value="${category.name}" class="edit-category-name">
      <button onclick="saveCategoryEdit(${catIndex})">Save</button>
      <button onclick="cancelCategoryEdit(${catIndex})">Cancel</button>
    ` : `
      <h3>${category.name} (Total: ﷼${category.total.toFixed(2)} | Done: ﷼${category.doneTotal.toFixed(2)})</h3>
      <div class="buttons">
        <button onclick="showSubcategoryForm(${catIndex})">+ Subcategory</button>
        <button onclick="showItemForm(${catIndex})">+ Item</button>
        <button onclick="startCategoryEdit(${catIndex})">✏️</button>
        <button onclick="deleteCategory(${catIndex})">🗑️</button>
      </div>
    `;

    categoryDiv.innerHTML = `
      <div class="category-header">
        ${headerContent}
      </div>
    `;

    const itemsDiv = document.createElement('div');
    category.items.forEach((item, itemIndex) => {
      itemsDiv.appendChild(createItemElement(catIndex, null, itemIndex, item));
    });
    categoryDiv.appendChild(itemsDiv);

    const subcategoriesDiv = document.createElement('div');
    category.subcategories.forEach((sub, subIndex) => {
      const subDiv = document.createElement('div');
      subDiv.className = `subcategory-box ${sub.editing ? 'edit-mode' : ''}`;
      
      const subHeaderContent = sub.editing ? `
        <input type="text" value="${sub.name}" class="edit-subcategory-name">
        <button onclick="saveSubcategoryEdit(${catIndex}, ${subIndex})">Save</button>
        <button onclick="cancelSubcategoryEdit(${catIndex}, ${subIndex})">Cancel</button>
      ` : `
        <h4>${sub.name} (Total: ﷼${sub.total.toFixed(2)} | Done: ﷼${sub.doneTotal.toFixed(2)})</h4>
        <div class="buttons">
          <button onclick="showItemForm(${catIndex}, ${subIndex})">+ Item</button>
          <button onclick="startSubcategoryEdit(${catIndex}, ${subIndex})">✏️</button>
          <button onclick="deleteSubcategory(${catIndex}, ${subIndex})">🗑️</button>
        </div>
      `;

      subDiv.innerHTML = `
        <div class="subcategory-header">
          ${subHeaderContent}
        </div>
      `;

      const itemsDiv = document.createElement('div');
      sub.items.forEach((item, itemIndex) => {
        itemsDiv.appendChild(createItemElement(catIndex, subIndex, itemIndex, item));
      });
      subDiv.appendChild(itemsDiv);
      subcategoriesDiv.appendChild(subDiv);
    });
    categoryDiv.appendChild(subcategoriesDiv);
    container.appendChild(categoryDiv);
  });
}

function createItemElement(catIndex, subIndex, itemIndex, item) {
  const div = document.createElement('div');
  div.className = `item-box ${item.done ? 'done' : ''}`;
  div.setAttribute('data-cat', catIndex);
  div.setAttribute('data-sub', subIndex);
  div.setAttribute('data-item', itemIndex);
  
  if (item.editing) {
    div.innerHTML = `
      <div class="edit-form">
        <input type="text" value="${item.name}" class="edit-name">
        <input type="number" value="${item.amount}" class="edit-amount" step="0.01">
        <input type="date" value="${item.dates[0]}" class="edit-date">
        <button onclick="saveItem(${catIndex}, ${subIndex}, ${itemIndex})">Save</button>
        <button onclick="cancelEdit(${catIndex}, ${subIndex}, ${itemIndex})">Cancel</button>
      </div>
    `;
  } else {
    div.innerHTML = `
      <div class="checkbox-wrapper">
        <input type="checkbox" ${item.done ? 'checked' : ''} 
          onchange="toggleDoneStatus(${catIndex}, ${subIndex}, ${itemIndex})">
      </div>
      <span>${item.name} - ﷼${item.amount.toFixed(2)} (${item.dates.join(', ')})</span>
      <div class="buttons">
        <button onclick="editItem(${catIndex}, ${subIndex}, ${itemIndex})">✏️</button>
        <button onclick="deleteItem(${catIndex}, ${subIndex}, ${itemIndex})">🗑️</button>
      </div>
    `;
  }
  return div;
}

function startCategoryEdit(catIndex) {
  categories[catIndex].editing = true;
  renderCategories();
}

function saveCategoryEdit(catIndex) {
  const newName = document.querySelector(`.category-box:nth-child(${catIndex + 1}) .edit-category-name`).value.trim();
  if (newName) {
    categories[catIndex].name = newName;
    categories[catIndex].editing = false;
    renderCategories();
  }
}

function cancelCategoryEdit(catIndex) {
  categories[catIndex].editing = false;
  renderCategories();
}

function startSubcategoryEdit(catIndex, subIndex) {
  categories[catIndex].subcategories[subIndex].editing = true;
  renderCategories();
}

function saveSubcategoryEdit(catIndex, subIndex) {
  const newName = document.querySelector(`.category-box:nth-child(${catIndex + 1}) .subcategory-box:nth-child(${subIndex + 1}) .edit-subcategory-name`).value.trim();
  if (newName) {
    categories[catIndex].subcategories[subIndex].name = newName;
    categories[catIndex].subcategories[subIndex].editing = false;
    renderCategories();
  }
}

function cancelSubcategoryEdit(catIndex, subIndex) {
  categories[catIndex].subcategories[subIndex].editing = false;
  renderCategories();
}

function toggleDoneStatus(catIndex, subIndex, itemIndex) {
  const item = subIndex !== undefined ?
    categories[catIndex].subcategories[subIndex].items[itemIndex] :
    categories[catIndex].items[itemIndex];
  item.done = !item.done;
  calculateTotals();
  renderCategories();
}

function calculateTotals() {
  let globalTotal = 0;
  let globalDoneTotal = 0;
  let totalItems = 0;

  categories.forEach(category => {
    category.total = 0;
    category.doneTotal = 0;
    
    category.items.forEach(item => {
      category.total += item.amount;
      if (item.done) category.doneTotal += item.amount;
    });
    totalItems += category.items.length;

    category.subcategories.forEach(sub => {
      sub.total = 0;
      sub.doneTotal = 0;
      sub.items.forEach(item => {
        sub.total += item.amount;
        if (item.done) sub.doneTotal += item.amount;
      });
      category.total += sub.total;
      category.doneTotal += sub.doneTotal;
      totalItems += sub.items.length;
    });

    globalTotal += category.total;
    globalDoneTotal += category.doneTotal;
  });

  document.getElementById('globalTotal').textContent = globalTotal.toFixed(2);
  document.getElementById('globalDoneTotal').textContent = globalDoneTotal.toFixed(2);
  document.getElementById('totalItems').textContent = totalItems;
}

function addCategory() {
  const name = document.getElementById('categoryName').value.trim();
  if (name) {
    categories.push({
      name,
      subcategories: [],
      items: [],
      total: 0,
      doneTotal: 0,
      editing: false
    });
    document.getElementById('categoryName').value = '';
    renderCategories();
  }
}

function showSubcategoryForm(catIndex) {
  const form = document.createElement('div');
  form.className = 'subcategory-form';
  form.innerHTML = `
    <input type="text" placeholder="Subcategory name" class="subcategory-name">
    <button onclick="addSubcategory(${catIndex}, this)">Add</button>
  `;
  const categoryDiv = document.querySelectorAll('.category-box')[catIndex];
  categoryDiv.appendChild(form);
}

function addSubcategory(catIndex, button) {
  const form = button.parentElement;
  const name = form.querySelector('.subcategory-name').value.trim();
  if (name) {
    categories[catIndex].subcategories.push({
      name,
      items: [],
      total: 0,
      doneTotal: 0,
      editing: false
    });
    form.remove();
    renderCategories();
  }
}

function showItemForm(catIndex, subIndex) {
  const form = document.createElement('div');
  form.className = 'item-form';
  form.innerHTML = `
    <input type="text" placeholder="Item name" class="item-name">
    <input type="number" placeholder="Amount" class="item-amount" step="0.01">
    <input type="date" class="item-date">
    <button onclick="addItem(${catIndex}, ${subIndex}, this)">Add</button>
  `;

  const selector = subIndex !== undefined ? 
    `.category-box:nth-child(${catIndex + 1}) .subcategory-box:nth-child(${subIndex + 1})` : 
    `.category-box:nth-child(${catIndex + 1})`;
  
  const target = document.querySelector(selector);
  if (target) target.appendChild(form);
}

function addItem(catIndex, subIndex, button) {
  const form = button.parentElement;
  const item = {
    name: form.querySelector('.item-name').value.trim(),
    amount: parseFloat(form.querySelector('.item-amount').value),
    dates: [form.querySelector('.item-date').value],
    done: false,
    editing: false
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

function editItem(catIndex, subIndex, itemIndex) {
  const item = subIndex !== undefined ?
    categories[catIndex].subcategories[subIndex].items[itemIndex] :
    categories[catIndex].items[itemIndex];
  item.editing = true;
  renderCategories();
}

function saveItem(catIndex, subIndex, itemIndex) {
  const item = subIndex !== undefined ?
    categories[catIndex].subcategories[subIndex].items[itemIndex] :
    categories[catIndex].items[itemIndex];
  
  const editForm = document.querySelector(`[data-cat="${catIndex}"][data-sub="${subIndex}"][data-item="${itemIndex}"] .edit-form`);
  const newName = editForm.querySelector('.edit-name').value.trim();
  const newAmount = parseFloat(editForm.querySelector('.edit-amount').value);
  const newDate = editForm.querySelector('.edit-date').value;

  if (newName && !isNaN(newAmount) && newDate) {
    item.name = newName;
    item.amount = newAmount;
    item.dates[0] = newDate;
    item.editing = false;
    renderCategories();
  }
}

function cancelEdit(catIndex, subIndex, itemIndex) {
  const item = subIndex !== undefined ?
    categories[catIndex].subcategories[subIndex].items[itemIndex] :
    categories[catIndex].items[itemIndex];
  item.editing = false;
  renderCategories();
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
  if (typeof subIndex === 'number') {
    categories[catIndex].subcategories[subIndex].items.splice(itemIndex, 1);
  } else {
    categories[catIndex].items.splice(itemIndex, 1);
  }
  renderCategories();
}

function exportData() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Type\tName\tAmount\tDate\tDone\n";

  categories.forEach(category => {
    csvContent += `Category\t${category.name}\t\t\t\n`;
    category.items.forEach(item => {
      item.dates.forEach(date => {
        csvContent += `Item\t${item.name}\t${item.amount}\t${date}\t${item.done}\n`;
      });
    });
    category.subcategories.forEach(sub => {
      csvContent += `Subcategory\t${sub.name}\t\t\t\n`;
      sub.items.forEach(item => {
        item.dates.forEach(date => {
          csvContent += `Item\t${item.name}\t${item.amount}\t${date}\t${item.done}\n`;
        });
      });
    });
  });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Non-Monthly Expense Organizer_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
}

function importData() {
  const file = document.getElementById('importFile').files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      const rows = text.split('\n').slice(1);
      categories = [];

      let currentCategory = null;
      let currentSubcategory = null;

      rows.forEach(row => {
        const [type, name, amount, date, done] = row.split('\t');
        if (type === 'Category') {
          currentCategory = {
            name,
            subcategories: [],
            items: [],
            total: 0,
            doneTotal: 0,
            editing: false
          };
          categories.push(currentCategory);
          currentSubcategory = null;
        } else if (type === 'Subcategory') {
          currentSubcategory = {
            name,
            items: [],
            total: 0,
            doneTotal: 0,
            editing: false
          };
          currentCategory.subcategories.push(currentSubcategory);
        } else if (type === 'Item') {
          const item = {
            name,
            amount: parseFloat(amount),
            dates: [date],
            done: done === 'true',
            editing: false
          };
          if (currentSubcategory) {
            currentSubcategory.items.push(item);
          } else {
            currentCategory.items.push(item);
          }
        }
      });

      renderCategories();
    };
    reader.readAsText(file);
  }
}