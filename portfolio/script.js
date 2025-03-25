import { config } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    initPortfolioSliders();
    applyConfigSettings();
    initYoutubeEmbeds();
    initTypeCItems();
    initScrollIndicators();
});

function applyConfigSettings() {
    if (config.thumbnailWidth) {
        document.documentElement.style.setProperty('--thumbnail-width', `${config.thumbnailWidth}px`);
    }
    
    if (config.thumbnailHeight) {
        document.documentElement.style.setProperty('--thumbnail-height', `${config.thumbnailHeight}px`);
    }
    
    if (config.thumbnailGap) {
        document.documentElement.style.setProperty('--thumbnail-gap', `${config.thumbnailGap}px`);
    }
    
    if (config.gradientColors) {
        document.documentElement.style.setProperty('--gradient-start', config.gradientColors.start);
        document.documentElement.style.setProperty('--gradient-end', config.gradientColors.end);
    }
    
    if (config.typeCWidth) {
        document.documentElement.style.setProperty('--type-c-width', `${config.typeCWidth}px`);
    }
    
    if (config.typeCHeight) {
        document.documentElement.style.setProperty('--type-c-height', `${config.typeCHeight}px`);
    }
}

function initPortfolioSliders() {
    const sliders = document.querySelectorAll('.slider');
    const sliderTitles = config.sliderTitles || [
        "@Paranormal_Parkour",
        "@bellostudios-apps",
        "Shorts - Spirit Evidences",
        "AI Shorts"
    ];
    
    sliders.forEach((slider, index) => {
        let isDown = false;
        let startX;
        let scrollLeft;
        let lastScrollPosition = 0;
        let animationFrameId = null;

        // Mouse events for desktop
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            cancelAnimationFrame(animationFrameId); // Cancel any ongoing animation
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // scroll-speed
            
            // Use requestAnimationFrame for smoother animation
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(() => {
                slider.scrollLeft = scrollLeft - walk;
                updateThumbnailsAppearance(slider);
            });
        });

        // Touch events for mobile/iOS
        slider.addEventListener('touchstart', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.touches[0].pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            lastScrollPosition = scrollLeft;
            cancelAnimationFrame(animationFrameId); // Cancel any ongoing animation
        });

        slider.addEventListener('touchend', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('touchcancel', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            e.preventDefault(); // Be careful with this on iOS
            const x = e.touches[0].pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // scroll-speed
            
            // Use requestAnimationFrame for smoother animation
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(() => {
                slider.scrollLeft = scrollLeft - walk;
                updateThumbnailsAppearance(slider);
            });
        }, { passive: false }); // Important for iOS

        // Hide scroll indicator when user starts scrolling
        slider.addEventListener('scroll', () => {
            const scrollIndicator = slider.nextElementSibling;
            if (scrollIndicator && scrollIndicator.classList.contains('scroll-indicator')) {
                scrollIndicator.style.opacity = '0';
                
                // Restore opacity after 3 seconds
                setTimeout(() => {
                    scrollIndicator.style.opacity = '0.7';
                }, 3000);
            }
            
            // Update thumbnails appearance on scroll
            updateThumbnailsAppearance(slider);
        });

        // Add fade effect on the edges
        addSliderFadeEffect(slider);
        
        // Adding title to the slider
        const titleElement = document.createElement('h2');
        titleElement.textContent = sliderTitles[index];
        slider.parentNode.insertBefore(titleElement, slider);
    });
}

function updateThumbnailsAppearance(slider) {
    const thumbnails = slider.querySelectorAll('.thumbnail');
    const sliderRect = slider.getBoundingClientRect();
    
    thumbnails.forEach(thumbnail => {
        const rect = thumbnail.getBoundingClientRect();
        
        // Calculate how visible the thumbnail is in the viewport
        const distanceFromLeft = rect.left - sliderRect.left;
        const distanceFromRight = sliderRect.right - rect.right;
        
        // Adjust appearance based on position
        if (distanceFromLeft < 0) {
            const opacity = Math.max(0.5, 1 + distanceFromLeft / rect.width);
            const scale = Math.max(0.95, 1 + distanceFromLeft / rect.width / 20);
            thumbnail.style.opacity = opacity.toString();
            thumbnail.style.transform = `scale(${scale})`;
        } else if (distanceFromRight < 0) {
            const opacity = Math.max(0.5, 1 + distanceFromRight / rect.width);
            const scale = Math.max(0.95, 1 + distanceFromRight / rect.width / 20);
            thumbnail.style.opacity = opacity.toString();
            thumbnail.style.transform = `scale(${scale})`;
        } else {
            thumbnail.style.opacity = '1';
            thumbnail.style.transform = 'scale(1)';
        }
    });
}

function addSliderFadeEffect(slider) {
    // Replace the entire function with just an initial call to updateThumbnailsAppearance
    updateThumbnailsAppearance(slider);
}

function initYoutubeEmbeds() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const youtubeEmbed = document.querySelector('.youtube-embed');
    const youtubeIframe = document.querySelector('.youtube-embed iframe');
    const closeBtn = document.querySelector('.youtube-embed .close-btn');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            const imgUrl = thumbnail.style.getPropertyValue('--img-url');
            
            // Check if this is a regular YouTube video ID format
            const videoIdMatch = imgUrl.match(/\/vi\/([^\/]+)\/hqdefault/);
            
            if (videoIdMatch) {
                const videoId = videoIdMatch[1];
                
                // Check for all known video IDs including the new ones
                if (videoId === 'Uc-yMCxC8Jc' || videoId === '_Ov_ttEL9gs' || 
                    videoId === 'Oj0jTBaXRdA' || videoId === 'sKa1t0PI0aE' || 
                    videoId === 'IPOxFBvYaw8' || videoId === 'ZnIj6FNUJWI' ||
                    videoId === 'aX1q6DawdVI' || videoId === 'Vdpr9qBEFrQ' ||
                    videoId === 'UCxFdfRCx7s' || videoId === '1aFm6mBPxZg' ||
                    videoId === 'aFD4JoY-r9U' || videoId === 'GTR1lNKv6YI' ||
                    videoId === 'A7tz3M9FnmI' || videoId === 'a5SNGYoA6oA' ||
                    videoId === 'QpHH3Yitx0c' || videoId === 'DSWnd_vtUGg' ||
                    videoId === '7PGdGkYynC8' || videoId === '-vP1dfR7GEg' ||
                    videoId === 'bUUbPFCjzPM' || videoId === 'HspHWG4LhP4' ||
                    videoId === 'mhGKxIWYzXo' || videoId === '39KH-WBaKdI' ||
                    videoId === 'bsOL1osZpA0' || videoId === 'aZyA819cRWM' ||
                    videoId === 'Tz62JJCowWA' || videoId === 'xBT4Isc0ySw' ||
                    videoId === 'EHv1XjXh5FE' || videoId === 'rbBvfET05Lc' || 
                    videoId === 'OMSnm2225Jk' || videoId === 'UVsTIHff3rM' || 
                    videoId === 'c_QM8nheubI') {
                    youtubeIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                } else {
                    youtubeIframe.src = config.youtubeEmbedUrl;
                }
            } else {
                // For videos that might use a direct embed URL format
                const directMatch = imgUrl.match(/\/([^\/]+)\/hqdefault/);
                if (directMatch && directMatch[1]) {
                    youtubeIframe.src = `https://www.youtube.com/embed/${directMatch[1]}?autoplay=1`;
                } else {
                    youtubeIframe.src = config.youtubeEmbedUrl;
                }
            }
            
            youtubeEmbed.classList.add('active');
        });
    });
    
    closeBtn.addEventListener('click', () => {
        youtubeEmbed.classList.remove('active');
        youtubeIframe.src = '';
    });
}

function initTypeCItems() {
    const typeCItems = document.querySelectorAll('.type-c-item');
    const typeCModal = document.querySelector('.type-c-modal');
    const typeCModalContent = document.querySelector('.type-c-modal-content');
    const closeBtn = document.querySelector('.type-c-modal .close-btn');
    
    typeCItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgUrl = item.style.getPropertyValue('--img-url');
            typeCModalContent.src = imgUrl.replace('url(', '').replace(')', '').replace(/"/g, '').replace(/'/g, '');
            typeCModal.classList.add('active');
        });
    });
    
    closeBtn.addEventListener('click', () => {
        typeCModal.classList.remove('active');
    });
}

function initScrollIndicators() {
    const scrollIndicators = document.querySelectorAll('.scroll-indicator');
    
    scrollIndicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            const slider = indicator.previousElementSibling;
            const thumbnailWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--thumbnail-width'));
            const thumbnailGap = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--thumbnail-gap'));
            
            // Scroll by approximately one thumbnail width plus gap
            slider.scrollBy({
                left: thumbnailWidth + thumbnailGap,
                behavior: 'smooth'
            });
        });
        
        // Make the indicator visually clickable
        indicator.style.cursor = 'pointer';
    });
}