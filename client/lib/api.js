// A central place for all our API calls

// Fetches all products from our Express backend
export async function getProducts({ keyword = '', category = '', sortBy = '' } = {}) {
  // This function is now simple and only accepts primitive values.
  const params = new URLSearchParams({ keyword, category, sortBy });
  const url = `http://localhost:5001/api/products?${params.toString()}`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    
    // It returns the products array from the API response object.
    return data.products || []; 
  } catch (error) {
    console.error('[GET_PRODUCTS_ERROR]', error);
    return []; // Always return an array.
  }
}

// Fetches a single product by its slug
export async function getProductBySlug(slug) {
  try {
    const res = await fetch(`http://localhost:5001/api/products/slug/${slug}`, {
      next: { revalidate: 60 }
    });

    // If the product is not found, the API will return a 404
    if (res.status === 404) {
      return null; // Return null to indicate not found
    }

    if (!res.ok) {
      throw new Error('Failed to fetch product');
    }

    const product = await res.json();
    return product;
  } catch (error) {
    console.error('[GET_PRODUCT_ERROR]', error);
    return null;
  }
}