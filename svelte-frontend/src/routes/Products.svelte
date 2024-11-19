<script>
    import { onMount } from 'svelte';
    import { fade, scale } from 'svelte/transition';
    import { getProducts, addProduct } from '../services/api.js';

    let products = [];
    let newProduct = { name: '', description: '', price: '' };
    let isSubmitting = false;

    // Fetch all products
    onMount(async () => {
        products = await getProducts();
    });

    // Handle adding a new product
    async function handleAddProduct() {
        if (isSubmitting) return;

        if (newProduct.name && newProduct.description && newProduct.price) {
            isSubmitting = true;
            try {
                const product = await addProduct({
                    ...newProduct,
                    price: Number(newProduct.price)
                });
                products = [...products, product];
                newProduct = { name: '', description: '', price: '' };
                alert(`🎉 Product added: ${product.name}`);
            } catch (error) {
                alert('Failed to add product. Please try again.');
            } finally {
                isSubmitting = false;
            }
        } else {
            alert('Please fill in all product details.');
        }
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }
</script>

<main>
    <div class="container">
        <!-- Title -->
        <div class="title-section">
            <h1>Product Marketplace</h1>
            <p>Discover, explore, and add new products effortlessly.</p>
        </div>

        <!-- Product Grid -->
        <div class="product-grid">
            {#each products as product (product.id)}
                <div 
                    transition:scale
                    class="product-card"
                >
                    <img 
                        src={product.image || 'https://media.istockphoto.com/id/175385309/photo/pizza.jpg?s=1024x1024&w=is&k=20&c=1byPlCQKmmeytdYrXtaMhW93DKUhiCde9L2Ryvxjt4o='} 
                        alt={product.name} 
                    />
                    <div class="product-details">
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <div class="product-footer">
                            <span class="price">{formatPrice(product.price)}</span>
                            <button class="add-to-cart">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <!-- Add Product Form -->
        <div class="add-product-form">
            <h2>Add New Product</h2>
            <form on:submit|preventDefault={handleAddProduct}>
                <input
                    type="text"
                    bind:value={newProduct.name}
                    placeholder="Product Name"
                    required
                />
                <input
                    type="text"
                    bind:value={newProduct.description}
                    placeholder="Product Description"
                    required
                />
                <input
                    type="number"
                    bind:value={newProduct.price}
                    placeholder="Product Price"
                    min="0"
                    step="0.01"
                    required
                />
                <button 
                    type="submit"
                    disabled={isSubmitting}
                >
                    + Add Product
                </button>
            </form>
        </div>
    </div>
</main>

<style>
    :root {
        --primary-gradient: linear-gradient(to right, #4a90e2, #50c878);
        --background-gradient: linear-gradient(to bottom right, #f5f7fa, #e6e9f0);
        --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        --transition-speed: 0.3s;
    }

    main {
        min-height: 100vh;
        background: var(--background-gradient);
        font-family: 'Inter', sans-serif;
        padding: 2rem;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
    }

    /* Title Section */
    .title-section {
        text-align: center;
        margin-bottom: 2.5rem;
    }

    .title-section h1 {
        font-size: 2.5rem;
        font-weight: 800;
        background: linear-gradient(to right, #4a5568, #6b46c1);
        -webkit-background-clip: text;
        color: transparent;
        margin-bottom: 0.5rem;
    }

    .title-section p {
        color: #718096;
        font-size: 1.1rem;
    }

    /* Product Grid */
    .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
    }

    .product-card {
        background: white;
        border-radius: 1rem;
        overflow: hidden;
        box-shadow: var(--card-shadow);
        transition: transform var(--transition-speed), box-shadow var(--transition-speed);
    }

    .product-card:hover {
        transform: scale(1.05);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
    }

    .product-card img {
        width: 100%;
        height: 250px;
        object-fit: cover;
    }

    .product-details {
        padding: 1.25rem;
    }

    .product-details h2 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 0.5rem;
    }

    .product-details p {
        color: #718096;
        margin-bottom: 1rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .product-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .price {
        color: #48bb78;
        font-size: 1.25rem;
        font-weight: 700;
    }

    .add-to-cart {
        background: #4a90e2;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: background var(--transition-speed);
    }

    .add-to-cart:hover {
        background: #357abd;
    }

    /* Add Product Form */
    .add-product-form {
        max-width: 500px;
        margin: 0 auto;
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: var(--card-shadow);
    }

    .add-product-form h2 {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #2d3748;
    }

    .add-product-form input {
        width: 100%;
        padding: 0.75rem;
        margin-bottom: 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        transition: border-color var(--transition-speed);
    }

    .add-product-form input:focus {
        outline: none;
        border-color: #4a90e2;
    }

    .add-product-form button {
        width: 100%;
        padding: 0.75rem;
        background: var(--primary-gradient);
        color: white;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: opacity var(--transition-speed);
    }

    .add-product-form button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    /* Responsive Adjustments */
    @media (max-width: 768px) {
        .title-section h1 {
            font-size: 2rem;
        }

        .product-grid {
            grid-template-columns: 1fr;
        }
    }
</style>