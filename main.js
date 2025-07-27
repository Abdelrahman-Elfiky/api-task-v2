const productList = document.getElementById('product-list');
const productForm = document.getElementById('product-form');
const loadingOverlay = document.getElementById('loading-overlay');
const modal = document.getElementById('product-modal');
const closeModalBtn = document.getElementById('close-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-description');
const modalPrice = document.getElementById('modal-price');
const formButton = document.getElementById('form-button');

let editingProduct = null;

function showLoader(state) {
  loadingOverlay.style.display = state ? 'flex' : 'none';
}

async function fetchProducts() {
  try {
    showLoader(true);
    const res = await fetch('https://fakestoreapi.com/products');
    if (!res.ok) throw new Error('Failed to fetch');
    const products = await res.json();

    const filteredProducts = products.filter(p => p.title && p.description && p.image && p.price);
    renderProducts(filteredProducts);

  } catch (err) {
    console.error('Error fetching products:', err);
    productList.innerHTML = `<p>Failed to load products.</p>`;
  } finally {
    showLoader(false);
  }
}

function renderProducts(products) {
  productList.innerHTML = "";
  products.forEach(product => createCard(product));
}

function createCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';

  card.dataset.title = product.title;
  card.dataset.description = product.description;
  card.dataset.price = product.price;
  card.dataset.image = product.image;

  card.innerHTML = `
    <div class="product-image"><img src="${product.image}" alt="${product.title}" /></div>
    <div class="product-title">${product.title}</div>
    <div class="product-description">${product.description}</div>
    <div class="product-separator"></div>
    <div class="product-price">$${product.price}</div>
    <div class="card-buttons">
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
      <button class="details">Details</button>
    </div>
  `;

  card.querySelector('.edit').addEventListener('click', () => {
    document.getElementById('title').value = card.dataset.title;
    document.getElementById('description').value = card.dataset.description;
    document.getElementById('price').value = card.dataset.price;
    document.getElementById('image').value = card.dataset.image;

    editingProduct = card;
    formButton.textContent = "Edit Product";
  });

  card.querySelector('.delete').addEventListener('click', () => {
    card.remove();
  });

  card.querySelector('.details').addEventListener('click', () => {
    modalImage.src = card.dataset.image;
    modalTitle.textContent = card.dataset.title;
    modalDesc.textContent = card.dataset.description;
    modalPrice.textContent = `$${card.dataset.price}`;
    modal.style.display = 'block';
  });

  productList.appendChild(card);
}

function addNewProduct(title, description, price, image) {
  const newProduct = { title, description, price, image };
  createCard(newProduct);
}

function updateProduct(card, title, description, price, image) {
  card.querySelector('.product-title').textContent = title;
  card.querySelector('.product-description').textContent = description;
  card.querySelector('.product-price').textContent = `$${price}`;
  card.querySelector('img').src = image;

  card.dataset.title = title;
  card.dataset.description = description;
  card.dataset.price = price;
  card.dataset.image = image;
}

productForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const price = parseFloat(document.getElementById('price').value.trim());
  const image = document.getElementById('image').value.trim();

  if (!title || !description || !image || !Number.isFinite(price) || price <= 0) return;

  if (editingProduct) {
    updateProduct(editingProduct, title, description, price, image);
    editingProduct = null;
    formButton.textContent = "Add Product";
  } else {
    addNewProduct(title, description, price, image);
  }

  productForm.reset();
});

closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

fetchProducts();
