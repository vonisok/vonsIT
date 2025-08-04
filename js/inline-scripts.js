// Google Tag Manager
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PLDQ7J78');

// Google tag (gtag.js)
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-W58WMGSYS0');

// Dynamic screenshot scroll calculation for showcase section
document.addEventListener('DOMContentLoaded', function() {
    const screenshots = document.querySelectorAll('.live-preview-screenshot');

    screenshots.forEach(function(img) {
        img.addEventListener('load', function() {
            calculateScrollDistance(this);
        });

        // If image is already loaded
        if (img.complete) {
            calculateScrollDistance(img);
        }
    });

    function calculateScrollDistance(img) {
        const container = img.closest('.website-preview');
        if (!container) return; // Exit if container not found
        const containerHeight = container.offsetHeight;
        const imageHeight = img.naturalHeight * (container.offsetWidth / img.naturalWidth);

        // Calculate how much we need to scroll to show the bottom
        const scrollDistance = imageHeight - containerHeight;
        const scrollPercentage = (scrollDistance / imageHeight) * 100;

        // Set custom CSS property for this specific image
        img.style.setProperty('--scroll-distance', `-${Math.min(scrollPercentage, 85)}%`);

        // Apply the scroll on hover
        const showcaseItem = img.closest('.showcase-item');
        if (!showcaseItem) return; // Exit if item not found

        showcaseItem.addEventListener('mouseenter', function() {
            img.style.transform = `translateY(${img.style.getPropertyValue('--scroll-distance')})`;
        });

        showcaseItem.addEventListener('mouseleave', function() {
            img.style.transform = 'translateY(0)';
        });
    }
});
