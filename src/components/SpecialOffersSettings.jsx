// src/components/Admin/SpecialOffersSettings.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid'; // uuid-ը, որը տեղադրել ենք

// Խնդրում եմ, ստուգեք, որ 'product-images'-ը Ձեր Storage Bucket-ի ճիշտ անունն է
const OFFERS_BUCKET = 'product-images';

const SpecialOffersSettings = () => {
    const [loading, setLoading] = useState(true);
    const [heroImageUrl, setHeroImageUrl] = useState(''); // Պահպանված URL
    const [imageFile, setImageFile] = useState(null); // Ընտրված ֆայլը բեռնելու համար
    const [targetDate, setTargetDate] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [status, setStatus] = useState('');
    const [imageUploadStatus, setImageUploadStatus] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        setStatus('');

        const { data, error } = await supabase
            .from('special_offers_config')
            .select('hero_image_url, target_date, discount_percentage')
            .eq('id', 1)
            .single(); // << Խնդիրը այստեղ է

        if (error) {
            if (error.code === 'PGRST116') {
                console.log('Special offers config row not found, using default settings.');
                setStatus('Կարգավորումների տողը դեռ ստեղծված չէ (օգտագործվում են լռելյայն արժեքները)');
            } else {
                console.error('Error fetching settings:', error);
                setStatus(`Սխալ տվյալների բեռնման ժամանակ: ${error.message}`);
            }
            // Դատարկ դեպքում data-ն կլինի null, և կօգտագործվեն useState-ի սկզբնական արժեքները

        } else if (data) {
            // ... մնացած կոդը նույնն է
            setHeroImageUrl(data.hero_image_url || '');
            // ...
        }
        setLoading(false);
    };

    const handleImageUpload = async () => {
        if (!imageFile) return heroImageUrl;

        setImageUploadStatus('Նկարը բեռնվում է...');
        // Ստեղծում ենք ունիկալ ֆայլի անուն և տեղադրում 'offers/' ֆոլդերի մեջ
        const uniqueFileName = `hero_offer_${uuidv4()}_${imageFile.name.replace(/\s/g, '_')}`;
        const filePath = `offers/${uniqueFileName}`;

        const { error: uploadError } = await supabase.storage
            .from(OFFERS_BUCKET)
            .upload(filePath, imageFile, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            setImageUploadStatus(`Նկարի բեռնման սխալ: ${uploadError.message}`);
            throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
            .from(OFFERS_BUCKET)
            .getPublicUrl(filePath);

        setImageUploadStatus('Նկարը հաջողությամբ բեռնվեց։');
        return publicUrlData.publicUrl;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');
        setImageUploadStatus('');

        let finalImageUrl = heroImageUrl;

        try {
            // Քայլ 1: Բեռնել նոր նկարը (եթե ընտրված է)
            if (imageFile) {
                finalImageUrl = await handleImageUpload();
            }

            // Քայլ 2: Թարմացնել տվյալների բազան
            // Փոխակերպում է տեղական ժամանակը UTC timestamp-ի
            const utcDate = targetDate ? new Date(targetDate).toISOString() : null;

            const updateObject = {
                hero_image_url: finalImageUrl,
                target_date: utcDate,
                discount_percentage: parseInt(discountPercentage, 10) || null,
            };

            const { error: dbError } = await supabase
                .from('special_offers_config')
                .update(updateObject)
                .eq('id', 1);

            if (dbError) throw dbError;

            setHeroImageUrl(finalImageUrl);
            setImageFile(null);
            setStatus('Կարգավորումները հաջողությամբ թարմացվել են։');

        } catch (err) {
            // Սխալի դեպքում մաքրում ենք loading-ը
            console.error('Submission Error:', err.message);
            setStatus(`Գործողության սխալ: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Դիզայնի կոդը մնում է նույնը, ինչ նախորդ պատասխանում էր
    return (
        <div className="settings-panel product-form">
            <h3>Ակցիաների Էջի Կարգավորումներ</h3>
            <form onSubmit={handleSubmit}>

                {/* 1. Նկարի Բեռնում/Ցուցադրում */}
                <div className="form-group">
                    <label>Հերոսական Նկար:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                    />
                    {imageUploadStatus && <p style={{ color: imageUploadStatus.includes('Սխալ') ? 'red' : 'green', fontSize: '0.9rem' }}>{imageUploadStatus}</p>}
                </div>

                {heroImageUrl && (
                    <div className="current-image-preview" style={{ marginBottom: '15px' }}>
                        <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Ընթացիկ նկար:</p>
                        <img src={heroImageUrl} alt="Ընթացիկ Ակցիայի Նկար" style={{ maxWidth: '200px', height: 'auto', borderRadius: '8px' }} />
                    </div>
                )}

                {/* 2. Զեղչի Տոկոսը */}
                <div className="form-group">
                    <label htmlFor="discountPercentage">Զեղչի Տոկոսը (օրինակ՝ 20):</label>
                    <input
                        id="discountPercentage"
                        type="number"
                        min="0"
                        max="100"
                        value={discountPercentage}
                        onChange={(e) => setDiscountPercentage(e.target.value)}
                        placeholder="20"
                    />
                </div>

                {/* 3. Թայմերի Վերջնաժամկետը */}
                <div className="form-group">
                    <label htmlFor="targetDate">Թայմերի Վերջնաժամկետը:</label>
                    <input
                        id="targetDate"
                        type="datetime-local"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                    />
                </div>

                {status && <p style={{ marginTop: '15px', color: status.startsWith('Սխալ') ? 'red' : 'green' }}>{status}</p>}

                <div className="form-actions">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Պահպանվում է...' : 'Պահպանել Փոփոխությունները'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SpecialOffersSettings;