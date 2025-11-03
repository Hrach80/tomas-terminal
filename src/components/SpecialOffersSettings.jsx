
import React, { useState, useEffect } from "react"; 
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";
import "../assets/styles/SpecialOffersSettings.css";

const OFFERS_BUCKET = 'product-images';

const SpecialOffersSettings = () => {
    const [loading, setLoading] = useState(true);
    const [heroImageUrl, setHeroImageUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [targetDate, setTargetDate] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [status, setStatus] = useState('');
    const [imageUploadStatus, setImageUploadStatus] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('special_offers_config')
                .select('id, target_date, hero_image_url, discount_percentage')
                .eq('id', 1)
                .limit(1);

            if (error) throw error;

            if (data && data.length > 0) {
                const config = data[0];

                setHeroImageUrl(config.hero_image_url || '');
                setDiscountPercentage(config.discount_percentage || '');
                if (config.target_date) {
                    const localTime = new Date(config.target_date).toISOString().substring(0, 16);
                    setTargetDate(localTime);
                } else {
                    setTargetDate('');
                }
            }

        } catch (error) {
            console.error('Failed to fetch settings:', error);
            setStatus('Կարգավորումները բեռնելիս սխալ առաջացավ։');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (file) => {
        if (!file) return heroImageUrl;

        setImageUploadStatus('Նկարը բեռնվում է...');
        const uniqueFileName = `hero_offer_${uuidv4()}_${file.name.replace(/\s/g, '_')}`;
        const filePath = `offers/${uniqueFileName}`;
        const { error: uploadError } = await supabase.storage
            .from(OFFERS_BUCKET)
            .upload(filePath, file, { cacheControl: '3600', upsert: false });

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

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        try {
            const newImageUrl = imageFile ? await handleImageUpload(imageFile) : heroImageUrl;
            const discountValue = discountPercentage ? parseInt(discountPercentage, 10) : null;
            const targetDateString = targetDate ? new Date(targetDate).toISOString() : null;
            const { error } = await supabase
                .from('special_offers_config')
                .upsert(
                    [{
                        id: 1,
                        hero_image_url: newImageUrl,
                        target_date: targetDateString,
                        discount_percentage: discountValue,
                    }],
                    { onConflict: 'id', ignoreDuplicates: false }
                )
                .select()
                .single();

            if (error) throw error;

            setStatus('Կարգավորումները հաջողությամբ պահպանվեցին։');
            setImageFile(null);
            fetchSettings();

        } catch (err) {
            console.error("Սխալ պահպանման ժամանակ:", err.message || err);
            setStatus(`Պահպանման սխալ։ ${err.message || 'Տեխնիկական սխալ'}`);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-container">
            <h3>🎁 Ակցիաների Կարգավորում</h3>
            <form onSubmit={handleSaveSettings} className="settings-form">
                <label>Զեղչի Տոկոս (%)</label>
                <input
                    type="number"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value)}
                    placeholder="Օրինակ: 15"
                    min="0"
                    max="100"
                />

                <label>Ավարտի Ամսաթիվ (Target Date)</label>
                <input
                    type="datetime-local"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                />

                <hr />

                <h4>Հերոսի Նկարի Կարգավորում</h4>
                {heroImageUrl && (
                    <div className="current-image">
                        <label>Ընթացիկ Նկար</label>
                        <img
                            src={heroImageUrl}
                            alt="Special Offer Hero"
                            style={{ maxWidth: '200px', display: 'block' }}
                        />
                    </div>
                )}

                <label>Նոր Նկար (Ընտրեք ֆայլ)</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                />
                {imageUploadStatus && <p className="upload-status">{imageUploadStatus}</p>}

                <div className="form-actions">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Պահպանվում է...' : 'Պահպանել Կարգավորումները'}
                    </button>
                </div>
                {status && <p className={status.includes('Սխալ') ? 'error-msg' : 'success-msg'}>{status}</p>}
            </form>
        </div>
    );
};

export default SpecialOffersSettings;