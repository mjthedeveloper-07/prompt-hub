import { useEffect } from 'react';

const AdBanner = ({ slot, format = 'auto', responsive = 'true', className = '' }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense Error:', err);
    }
  }, []);

  return (
    <div className={`ad-container my-8 overflow-hidden rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center p-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-7086654533887050"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export default AdBanner;
