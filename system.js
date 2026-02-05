document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const productForm = document.getElementById('product-form');
    const nameInput = document.getElementById('product-name');
    const priceInput = document.getElementById('product-price');
    const qtyInput = document.getElementById('product-qty');
    const tableBody = document.getElementById('product-table-body');
    const totalItemsSpan = document.getElementById('total-items');
    const msgDiv = document.getElementById('form-msg');
    const clearBtn = document.getElementById('clear-all-btn');

    // App State
    let products = JSON.parse(localStorage.getItem('cosmetics_products')) || [];

    // Helper: Show Message
    function showMessage(msg, type) {
        msgDiv.textContent = msg;
        msgDiv.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700');

        if (type === 'error') {
            msgDiv.classList.add('bg-red-100', 'text-red-700');
        } else {
            msgDiv.classList.add('bg-green-100', 'text-green-700');
        }

        msgDiv.classList.remove('hidden');
        setTimeout(() => {
            msgDiv.classList.add('hidden');
        }, 3000);
    }

    // Render Table
    function renderTable() {
        tableBody.innerHTML = '';

        if (products.length === 0) {
            tableBody.innerHTML = `
                <tr id="empty-row">
                    <td colspan="5" class="p-8 text-center text-slate-400 italic">
                        No products added yet.
                    </td>
                </tr>
            `;
            totalItemsSpan.textContent = '0';
            return;
        }

        products.forEach((product, index) => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50 transition border-b border-slate-100 last:border-0';
            tr.innerHTML = `
                <td class="p-4 text-slate-500 text-sm font-mono">#${index + 1}</td>
                <td class="p-4 font-medium text-slate-800">${product.name}</td>
                <td class="p-4 text-slate-600">$${parseFloat(product.price).toFixed(2)}</td>
                <td class="p-4">
                    <span class="inline-block px-2 py-1 text-xs font-semibold rounded-full ${product.qty < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">
                        ${product.qty}
                    </span>
                </td>
                <td class="p-4 text-center">
                    <button class="delete-btn text-slate-400 hover:text-red-600 transition p-2" data-id="${product.id}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        totalItemsSpan.textContent = products.length;
    }

    // Save Data
    function saveData() {
        localStorage.setItem('cosmetics_products', JSON.stringify(products));
        renderTable();
    }

    // Add Product
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const price = parseFloat(priceInput.value);
        const qty = parseInt(qtyInput.value);

        // Validation logic
        if (!name || isNaN(price) || isNaN(qty)) {
            showMessage('Please fill in all fields correctly.', 'error');
            return;
        }

        if (price < 0) {
            showMessage('Price cannot be negative.', 'error');
            return;
        }

        if (qty <= 0) {
            showMessage('Quantity must be greater than zero.', 'error');
            return;
        }

        const newProduct = {
            id: Date.now(),
            name,
            price,
            qty
        };

        products.push(newProduct);
        saveData();
        showMessage('Product added successfully!', 'success');

        // Reset form
        productForm.reset();
        nameInput.focus();
    });

    // Delete Product
    tableBody.addEventListener('click', (e) => {
        const btn = e.target.closest('.delete-btn');
        if (!btn) return;

        const id = parseInt(btn.dataset.id);
        if (confirm('Are you sure you want to delete this product?')) {
            products = products.filter(p => p.id !== id);
            saveData();
            showMessage('Product deleted.', 'success');
        }
    });

    // Clear All
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (products.length === 0) return;

            if (confirm('Are you sure you want to delete ALL products? This cannot be undone.')) {
                products = [];
                saveData();
                showMessage('All products cleared.', 'success');
            }
        });
    }

    // Initial Render
    renderTable();
});
[]