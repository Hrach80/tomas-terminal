import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AddProductForm from './AddProductForm';
import EditProductForm from './EditProductForm';
import '../assets/styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    // ----------------- ՆՈՐ ՖՈՒՆԿՑԻԱ: Դուրս գալ -----------------
    const handleSignOut = async () => {
        try {
            setLoading(true); // Կոճակը անջատելու համար
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            // App.jsx-ը կնկատի փոփոխությունը (session-ը կդառնա null) և կցուցադրի Auth ֆորման
        } catch (error) {
            console.error("Դուրս գալու սխալ:", error);
            setError(error.message); // Ցուցադրել սխալը, եթե կա
        } finally {
            setLoading(false);
        }
    };
    // ----------------- ՎԵՐՋ -----------------

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('products')
                .select(`
                  id, 
                  price, 
                  image_url, 
                  created_at,
                  category,         
                  category_hy,
                  title_hy, title_en, title_ru, title_nl, 
                  description_hy, description_en, description_ru, description_nl
                `)
                .order('created_at', { ascending: false });

            if (error) {
                throw new Error(error.message);
            }
            setProducts(data);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ----------------- ԳՈՐԾՈՂՈՒԹՅՈՒՆՆԵՐԻ ՖՈՒՆԿՑԻԱՆԵՐ -----------------

    const handleProductAdded = (newProduct) => {
        setProducts([newProduct, ...products]);
        setIsAdding(false);
    };

    const handleProductUpdated = (updatedProduct) => {
        setProducts(
            products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );
        setEditingProduct(null);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Համոզվա՞ծ եք, որ ցանկանում եք ջնջել այս ապրանքը։')) {
            try {
                const { error } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', productId);

                if (error) {
                    throw new Error(error.message);
                }
                setProducts(products.filter((p) => p.id !== productId));
            } catch (err) {
                console.error("Error deleting product:", err);
                setError(`Ջնջման սխալ: ${err.message}`);
            }
        }
    };

    // ----------------- ՑՈՒՑԱԴՐՈՒՄ -----------------

    if (loading) return <p>Բեռնվում է...</p>;
    if (error && !products.length) return <p style={{ color: 'red' }}>Սխալ բեռնման ժամանակ: {error}</p>;

    return (
        <div className="dashboard-container">
            {/* Ավելացրել ենք Դուրս Գալու Կոճակը Ձեր Դաշտի Վերևում */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Ադմինիստրատորի Վահանակ</h2>
                <button
                    onClick={handleSignOut}
                    disabled={loading}
                    style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Դուրս Գալ
                </button>
            </div>


            {/* 1. Ավելացման Ֆորմա */}
            {isAdding ? (
                <AddProductForm
                    onProductAdded={handleProductAdded}
                    onCancel={() => setIsAdding(false)}
                />
            ) : (
                <button className="add-product-btn" onClick={() => setIsAdding(true)}>
                    + Ավելացնել Նոր Ապրանք
                </button>
            )}

            {/* 2. Խմբագրման Ֆորմա */}
            {editingProduct && (
                <EditProductForm
                    product={editingProduct}
                    onUpdate={handleProductUpdated}
                    onCancel={() => setEditingProduct(null)}
                />
            )}

            {/* 3. Ապրանքների Աղյուսակ */}
            <h3>Առկա Ապրանքներ ({products.length})</h3>
            {error && <p style={{ color: 'red' }}>Սխալ: {error}</p>}

            {/* ... (մնացած աղյուսակը մնում է նույնը) ... */}
            <div className="table-responsive">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Նկար</th>
                            <th>Վերնագիր (Հայ)</th>
                            <th className="hide-on-mobile">Կատեգորիա (Հայ)</th>
                            <th className="hide-on-mobile">Կատեգորիա (Ընդհ.)</th>
                            <th className="hide-on-mobile">Վերնագիր (Անգլ)</th>
                            <th>Գին</th>
                            <th>Գործողություններ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>
                                    {product.image_url && (
                                        <img src={product.image_url} alt={product.title_hy} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                    )}
                                </td>
                                <td>{product.title_hy}</td>
                                <td className="hide-on-mobile">{product.category_hy}</td>
                                <td className="hide-on-mobile">{product.category}</td>
                                <td className="hide-on-mobile">{product.title_en}</td>
                                <td>{product.price} €</td>
                                <td>
                                    <button className="action-btn edit-btn" onClick={() => setEditingProduct(product)}>
                                        Փոփոխել
                                    </button>
                                    <button className="action-btn delete-btn" onClick={() => handleDelete(product.id)}>
                                        Ջնջել
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;