// src/components/EditProductForm.jsx (ՈՒՂՂՎԱԾ)

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { productImagesBucket } from '../supabaseClient';


const EditProductForm = ({ product, onUpdate, onCancel }) => {
    // ------------------ Title States (4 Լեզու) ------------------
    const [titleHy, setTitleHy] = useState(product.title_hy || '');
    const [titleEn, setTitleEn] = useState(product.title_en || '');
    const [titleRu, setTitleRu] = useState(product.title_ru || '');
    const [titleNl, setTitleNl] = useState(product.title_nl || '');

    // ---------------- Description States (4 Լեզու) ----------------
    const [descriptionHy, setDescriptionHy] = useState(product.description_hy || '');
    const [descriptionEn, setDescriptionEn] = useState(product.description_en || '');
    const [descriptionRu, setDescriptionRu] = useState(product.description_ru || '');
    const [descriptionNl, setDescriptionNl] = useState(product.description_nl || '');

    // ✅ Category States (Ավելացված Ru և Nl) ----------------
    const [category, setCategory] = useState(product.category || '');
    const [categoryHy, setCategoryHy] = useState(product.category_hy || '');
    const [categoryRu, setCategoryRu] = useState(product.category_ru || '');
    const [categoryNl, setCategoryNl] = useState(product.category_nl || '');

    // ---------------- General States ----------------
    const [price, setPrice] = useState(product.price || 0);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const uploadImage = async (file) => {
        if (!file) return product.image_url;

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(productImagesBucket)
            .upload(filePath, file);

        if (uploadError) {
            throw new Error(`Նկարի ներբեռնման սխալ: ${uploadError.message}`);
        }

        const { data } = supabase.storage
            .from(productImagesBucket)
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const newImageUrl = await uploadImage(image);

            const updates = {
                // Title
                title_hy: titleHy,
                title_en: titleEn,
                title_ru: titleRu,
                title_nl: titleNl,

                // Description
                description_hy: descriptionHy,
                description_en: descriptionEn,
                description_ru: descriptionRu,
                description_nl: descriptionNl,

                // ✅ Category (Ավելացված Ru և Nl)
                category: category,
                category_hy: categoryHy,
                category_ru: categoryRu,
                category_nl: categoryNl,

                price: price,
                image_url: newImageUrl,
            };

            const { data, error } = await supabase
                .from('products')
                .update(updates)
                .eq('id', product.id)
                .select();

            if (error) {
                throw new Error(`Տվյալների փոփոխման սխալ: ${error.message}`);
            }

            onUpdate(data[0]);
            onCancel();
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-form-container">
            <h3>Փոփոխել Ապրանքը: {product.title_hy}</h3>
            <form onSubmit={handleSubmit}>

                {/* Title Dields (4 Languanges) */}
                <h4>Վերնագրեր</h4>
                <label>Վերնագիր (Հայերեն)</label>
                <input type="text" value={titleHy} onChange={(e) => setTitleHy(e.target.value)} required />
                <label>Վերնագիր (Անգլերեն)</label>
                <input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
                <label>Վերնագիր (Ռուսերեն)</label>
                <input type="text" value={titleRu} onChange={(e) => setTitleRu(e.target.value)} />
                <label>Վերնագիր (Նիդերլանդերեն)</label>
                <input type="text" value={titleNl} onChange={(e) => setTitleNl(e.target.value)} />

                <hr />

                {/* Description Fields (4 Languanges) */}
                <h4>Նկարագրություններ</h4>
                <label>Նկարագրություն (Հայերեն)</label>
                <textarea value={descriptionHy} onChange={(e) => setDescriptionHy(e.target.value)} required />
                <label>Նկարագրություն (Անգլերեն)</label>
                <textarea value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} />
                <label>Նկարագրություն (Ռուսերեն)</label>
                <textarea value={descriptionRu} onChange={(e) => setDescriptionRu(e.target.value)} />
                <label>Նկարագրություն (Նիդերլանդերեն)</label>
                <textarea value={descriptionNl} onChange={(e) => setDescriptionNl(e.target.value)} />

                <hr />

                {/* ✅ Category Fields (Ավելացված Ru և Nl) */}
                <h4>Կատեգորիաներ</h4>
                <label>Կատեգորիա (Ընդհանուր/Անգլերեն)</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
                <label>Կատեգորիա (Հայերեն)</label>
                <input type="text" value={categoryHy} onChange={(e) => setCategoryHy(e.target.value)} />
                <label>Կատեգորիա (Ռուսերեն)</label>
                <input type="text" value={categoryRu} onChange={(e) => setCategoryRu(e.target.value)} />
                <label>Կատեգորիա (Նիդերլանդերեն)</label>
                <input type="text" value={categoryNl} onChange={(e) => setCategoryNl(e.target.value)} />

                <hr />

                {/* Price and Image */}
                <label>Գին</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />

                <div className="current-image">
                    <label>Ընթացիկ Նկար</label>
                    {product.image_url && (
                        <img src={product.image_url} alt={product.title_hy} style={{ maxWidth: '100px', height: 'auto' }} />
                    )}
                </div>

                <label>Նոր Նկար (Ընտրեք նորը, եթե ցանկանում եք փոխել)</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />

                {error && <p style={{ color: 'red' }}>Սխալ: {error}</p>}

                <div className="form-actions">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Պահպանվում է...' : 'Պահպանել Փոփոխությունները'}
                    </button>
                    <button type="button" onClick={onCancel} disabled={loading}>
                        Չեղարկել
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProductForm;