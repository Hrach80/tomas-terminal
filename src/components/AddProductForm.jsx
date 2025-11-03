import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { productImagesBucket } from '../supabaseClient';
import "../assets/styles/AddProductForm.css"
const AddProductForm = ({ onProductAdded, onCancel }) => {
    // ------------------ Title States (4 Լեզու) - ԱՆՓՈՓՈԽ ------------------
    const [titleHy, setTitleHy] = useState('');
    const [titleEn, setTitleEn] = useState('');
    const [titleRu, setTitleRu] = useState('');
    const [titleNl, setTitleNl] = useState('');

    // ---------------- Description States (4 Լեզու) - ԱՆՓՈՓՈԽ ----------------
    const [descriptionHy, setDescriptionHy] = useState('');
    const [descriptionEn, setDescriptionEn] = useState('');
    const [descriptionRu, setDescriptionRu] = useState('');
    const [descriptionNl, setDescriptionNl] = useState('');

    // ---------------- Category States (Ուղղված է) ----------------
    const [category, setCategory] = useState(''); 
    const [categoryHy, setCategoryHy] = useState(''); 

    // ✅ ՌՈՒՍԵՐԵՆ ԵՎ ՆԻԴԵՐԼԱՆԴԵՐԵՆ
    const [categoryRu, setCategoryRu] = useState('');
    const [categoryNl, setCategoryNl] = useState('');
    // ...

    // ---------------- General States - ԱՆՓՈՓՈԽ ----------------
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const uploadImage = async (file) => {
        if (!file) return null;

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
            if (!titleHy || !descriptionHy || !price) {
                throw new Error("Խնդրում ենք լրացնել Հայերենի վերնագիրը, նկարագրությունը և գինը:");
            }

            const imageUrl = await uploadImage(image);

            const newProduct = {
                title_hy: titleHy,
                title_en: titleEn,
                title_ru: titleRu,
                title_nl: titleNl,
                description_hy: descriptionHy,
                description_en: descriptionEn,
                description_ru: descriptionRu,
                description_nl: descriptionNl,
                category: category, 
                category_hy: categoryHy,
                category_ru: categoryRu,
                category_nl: categoryNl,

                price: price,
                image_url: imageUrl,
            };


            const { data, error } = await supabase
                .from('products')
                .insert([newProduct])
                .select();

            if (error) {
                throw new Error(`Տվյալների ավելացման սխալ: ${error.message}`);
            }

            onProductAdded(data[0]);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-form-container">
            <h3>Ավելացնել Նոր Ապրանք</h3>
            <form onSubmit={handleSubmit}>
                <h4>Վերնագրեր</h4>
                <label>Վերնագիր (Հայերեն)*</label>
                <input type="text" value={titleHy} onChange={(e) => setTitleHy(e.target.value)} required />
                <label>Վերնագիր (Անգլերեն)</label>
                <input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
                <label>Վերնագիր (Ռուսերեն)</label>
                <input type="text" value={titleRu} onChange={(e) => setTitleRu(e.target.value)} />
                <label>Վերնագիր (Նիդերլանդերեն)</label>
                <input type="text" value={titleNl} onChange={(e) => setTitleNl(e.target.value)} />

                <hr />


                <h4>Նկարագրություններ</h4>
                <label>Նկարագրություն (Հայերեն)*</label>
                <textarea value={descriptionHy} onChange={(e) => setDescriptionHy(e.target.value)} required />
                <label>Նկարագրություն (Անգլերեն)</label>
                <textarea value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} />
                <label>Նկարագրություն (Ռուսերեն)</label>
                <textarea value={descriptionRu} onChange={(e) => setDescriptionRu(e.target.value)} />
                <label>Նկարագրություն (Նիդերլանդերեն)</label>
                <textarea value={descriptionNl} onChange={(e) => setDescriptionNl(e.target.value)} />

                <hr />
                <h4>Կատեգորիաներ</h4>
                <label>Կատեգորիա (Անգլերեն/Ընդհանուր)</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
                <label>Կատեգորիա (Հայերեն)</label>
                <input type="text" value={categoryHy} onChange={(e) => setCategoryHy(e.target.value)} />
                <label>Կատեգորիա (Ռուսերեն)</label>
                <input type="text" value={categoryRu} onChange={(e) => setCategoryRu(e.target.value)} />
                <label>Կատեգորիա (Նիդերլանդերեն)</label>
                <input type="text" value={categoryNl} onChange={(e) => setCategoryNl(e.target.value)} />
    
                <hr />

                <label>Գին*</label>
                <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} required />

                <label>Նկար</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />

                {error && <p style={{ color: 'red' }}>Սխալ: {error}</p>}

                <div className="form-actions">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Ավելացվում է...' : 'Ավելացնել Ապրանք'}
                    </button>
                    <button type="button" onClick={onCancel} disabled={loading}>
                        Չեղարկել
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProductForm;