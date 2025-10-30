import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { productImagesBucket } from '../supabaseClient';
// import './AddProductForm.css'; // Եթե Ձեր CSS-ը այլևս App.jsx-ի կողմից չի բեռնվում, կարող եք այն ներմուծել այստեղ

const AddProductForm = ({ onProductAdded, onCancel }) => {
    // ------------------ Title States (4 Լեզու) ------------------
    // Թողնում ենք title/description դաշտերը, քանի դեռ սխալ չեն տալիս
    const [titleHy, setTitleHy] = useState('');
    const [titleEn, setTitleEn] = useState('');
    const [titleRu, setTitleRu] = useState('');
    const [titleNl, setTitleNl] = useState('');

    // ---------------- Description States (4 Լեզու) ----------------
    const [descriptionHy, setDescriptionHy] = useState('');
    const [descriptionEn, setDescriptionEn] = useState('');
    const [descriptionRu, setDescriptionRu] = useState('');
    const [descriptionNl, setDescriptionNl] = useState('');

    // ---------------- Category States (ՄԻԱՅՆ ԳՈՅՈՒԹՅՈՒՆ ՈՒՆԵՑՈՂՆԵՐԸ) ----------------
    const [category, setCategory] = useState(''); // Ընդհանուր 'category'
    const [categoryHy, setCategoryHy] = useState(''); // Հայերեն
    // category_en, category_ru, category_nl ՀԵՌԱՑՎԱԾ ԵՆ

    // ---------------- General States ----------------
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const uploadImage = async (file) => {
        // ... (Նկարի ներբեռնման տրամաբանությունը անփոփոխ)
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

            // Ուղարկում ենք ՄԻԱՅՆ գոյություն ունեցող սյունակները
            const newProduct = {
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

                // Category (ՄԻԱՅՆ category և category_hy)
                category: category,
                category_hy: categoryHy,
                // category_en, category_ru, category_nl ՉԵՆ ՈՒՂԱՐԿՎՈՒՄ

                price: price,
                image_url: imageUrl,
            };

            const { data, error } = await supabase
                .from('products')
                // Supabase-ը ավտոմատ կերպով կլցնի այս դաշտերը NULL-ով, եթե դրանք բացակայեն newProduct օբյեկտում
                .insert([newProduct])
                .select();

            if (error) {
                throw new Error(`Տվյալների ավելացման սխալ: ${error.message}`);
            }

            onProductAdded(data[0]);
        } catch (err) {
            console.error(err);
            // Եթե այլ սխալներ առաջանան, այն կցուցադրվի այստեղ
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-form-container">
            <h3>Ավելացնել Նոր Ապրանք</h3>
            <form onSubmit={handleSubmit}>

                {/* Title Dields (4 Languanges) */}
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

                {/* Description Fields (4 Languanges) */}
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

                {/* Category Fields (ՄԻԱՅՆ category և category_hy) */}
                <h4>Կատեգորիաներ</h4>
                <label>Կատեգորիա (Ընդհանուր)</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
                <label>Կատեգորիա (Հայերեն)</label>
                <input type="text" value={categoryHy} onChange={(e) => setCategoryHy(e.target.value)} />

                {/* category_en, category_ru, category_nl input-ները ՀԵՌԱՑՎԱԾ ԵՆ */}

                <hr />

                {/* Price and Image */}
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