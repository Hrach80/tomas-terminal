// src/components/AdminDashboard.jsx

import React from 'react';
// Ոճավորումը արդեն ներմուծված է App.jsx-ում, բայց այն կարող է աշխատել նաև այստեղ, կախված Vite-ի կազմաձևից:

function AdminDashboard() {
    return (
        <div className="dashboard-container">
            <h2>Ապրանքների Կառավարում</h2>

            <button className="add-product-btn">
                + Ավելացնել Նոր Ապրանք
            </button>

            <h3>Ընթացիկ Ապրանքներ (Mock Data)</h3>

            <div className="table-responsive">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Անուն (Հայ)</th>
                            <th>Գին</th>
                            <th className="hide-on-mobile">Կատեգորիա</th>
                            <th>Գործողություններ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Շոկոլադե Տորթ</td>
                            <td>9500 Դր.</td>
                            <td className="hide-on-mobile">pastries</td>
                            <td>
                                <button className="action-btn edit-btn">Փոփոխել</button>
                                <button className="action-btn delete-btn">Ջնջել</button>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Նապոլեոն</td>
                            <td>350 Դր.</td>
                            <td className="hide-on-mobile">pastries</td>
                            <td>
                                <button className="action-btn edit-btn">Փոփոխել</button>
                                <button className="action-btn delete-btn">Ջնջել</button>
                            </td>
                        </tr>
                        {/* Ավելացնել այլ ապրանքների տողեր */}
                    </tbody>
                </table>
            </div>

            <div className="security-note">
                <p>⚠️ Մուտքը պետք է պաշտպանված լինի (տե՛ս Փուլ 4)</p>
            </div>
        </div>
    );
}

export default AdminDashboard;