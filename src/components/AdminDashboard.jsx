import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Login from './Login';
import AddProductForm from './AddProductForm';
import EditProductForm from './EditProductForm';
import '../assets/styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [session, setSession] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentView, setCurrentView] = useState('list');
    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: false });

        if (error) console.error('Error fetching products:', error);
        else setProducts(data);

        setLoading(false);
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchProducts();
        });

        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            if (session) fetchProducts();
            else setProducts([]);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        setLoading(false);
        if (error) console.error('Logout error:', error.message);
        else {
            setSession(null);
            setCurrentView('list');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Ջնջե՞լ այս ապրանքը։')) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) console.error(error);
        else setProducts(products.filter((p) => p.id !== id));
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setCurrentView('edit');
    };

    if (!session) return <Login />;

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                
                <div className="dashboard-actions">
                    <button type="button" onClick={() => { setCurrentView('list'); setSelectedProduct(null); }}>
                        Ապրանքների Ցուցակ
                    </button>
                    <button type="button" onClick={() => setCurrentView('add')}>
                        + Ավելացնել Ապրանք
                    </button>
                    <button
                        type="button"
                        className="logout-btn"
                        onClick={handleLogout}
                        disabled={loading}
                    >
                        {loading ? 'Ելք...' : 'Ելք'}
                    </button>
                </div>
            </header>

            {currentView === 'add' && (
                <AddProductForm
                    onProductAdded={() => { setCurrentView('list'); fetchProducts(); }}
                    onCancel={() => setCurrentView('list')}
                />
            )}

            {currentView === 'edit' && selectedProduct && (
                <EditProductForm
                    product={selectedProduct}
                    onUpdate={() => { setCurrentView('list'); setSelectedProduct(null); fetchProducts(); }}
                    onCancel={() => { setCurrentView('list'); setSelectedProduct(null); }}
                />
            )}

            {currentView === 'list' && (
                <div className="product-list-area">
                    <h3>Ապրանքներ ({products.length})</h3>
                    {loading ? (
                        <p>Բեռնվում է...</p>
                    ) : products.length === 0 ? (
                        <p>Ապրանքներ չկան։</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Նկար</th>
                                    <th>Վերնագիր (HY)</th>
                                    <th>Գին</th>
                                    <th>Գործողություններ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr className='td-obshi' key={product.id}>
                                        <td data-label="ID">{product.id}</td>
                                        <td data-label="Նկար">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.title_hy}
                                                    className="product-thumb"
                                                />
                                            ) : (
                                                <span className="no-image">Չկա</span>
                                            )}
                                        </td>
                                        <td data-label="Վերնագիր (HY)">{product.title_hy}</td>
                                        <td data-label="Գին" className="price">{product.price} €</td>
                                        <td className='td-tab' data-label="Գործողություններ">
                                            <div className="action-group">
                                                <button
                                                    type="button"
                                                    className="table-btn edit"
                                                    onClick={() => handleEdit(product)}
                                                >
                                                    Խմբագրել
                                                </button>
                                                <button
                                                    type="button"
                                                    className="table-btn delete"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    Ջնջել
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;