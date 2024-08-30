import React from 'react';

interface ShareProductProps {
  productTitle: string;
  productLink: string;
}

const ShareProduct: React.FC<ShareProductProps> = ({ productTitle, productLink }) => {
  const handleShare = (platform: string) => {
    const shareText = `Check out this amazing product: ${productTitle}`;
    const shareUrl = productLink;

    switch (platform) {
      case 'instagram':
        window.open(`https://www.instagram.com/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`);
        break;
      case 'pinterest':
        window.open(`https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="compare-share-section">
      <ul className="share-product">
        <span>Share</span>
        <li>
          <a href="javascript:void(0)" onClick={() => handleShare('instagram')}>
            <em className="osicon-instagram"></em>
          </a>
        </li>
        <li>
          <a href="javascript:void(0)" onClick={() => handleShare('facebook')}>
            <em className="osicon-facebook"></em>
          </a>
        </li>
        <li>
          <a href="javascript:void(0)" onClick={() => handleShare('twitter')}>
            <em className="osicon-twitter"></em>
          </a>
        </li>
        <li>
          <a href="javascript:void(0)" onClick={() => handleShare('pinterest')}>
            <em className="osicon-pinterest"></em>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ShareProduct;
