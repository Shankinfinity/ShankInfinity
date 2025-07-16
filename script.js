// Combined and improved version of both scrollers
document.addEventListener("DOMContentLoaded", function () {
    // First scroller implementation (simple continuous scroll)
    const scrollWrapper = document.querySelector('.scrolling-wrapper');
    if (scrollWrapper) {
        let scrollAmount = 0;
        
        function autoScrollHorizontal() {
            scrollWrapper.scrollLeft += 3;
            scrollAmount += 3;

            if (scrollAmount >= scrollWrapper.scrollWidth) {
                scrollWrapper.scrollLeft = 0;
                scrollAmount = 0;
            }

            requestAnimationFrame(autoScrollHorizontal);
        }
        
        autoScrollHorizontal();
    }

    // Second scroller implementation (item-based with scaling)
    function setupScroller(selector) {
        const scroller = document.querySelector(selector);
        if (!scroller) return;
        
        const items = scroller.querySelectorAll(".photo-item, .image-item");
        let index = 0;

        function scaleImages() {
            const scrollerRect = scroller.getBoundingClientRect();
            const scrollerCenter = scrollerRect.left + scrollerRect.width / 2;

            items.forEach(item => {
                const img = item.querySelector('img');
                const itemRect = item.getBoundingClientRect();
                const itemCenter = itemRect.left + itemRect.width / 2;
                const distance = Math.abs(scrollerCenter - itemCenter);

                // The further from center, the smaller the scale
                const maxScale = 1.2;
                const minScale = 0.6;
                const maxDistance = scrollerRect.width / 2;
                let scale = maxScale - (distance / maxDistance) * (maxScale - minScale);
                scale = Math.max(minScale, Math.min(maxScale, scale));

                img.style.transform = `scale(${scale})`;
                img.style.zIndex = Math.round(scale * 10);
            });
        }

        function scrollToIndex(idx) {
            const item = items[idx];
            const scrollLeft = item.offsetLeft - (scroller.offsetWidth / 2) + (item.offsetWidth / 2);
            scroller.scrollTo({ left: scrollLeft, behavior: "smooth" });
        }

        function autoScroll() {
            index = (index + 1) % items.length;
            scrollToIndex(index);
            setTimeout(scaleImages, 600);
        }

        scroller.addEventListener('scroll', scaleImages);
        window.addEventListener('resize', scaleImages);

        const intervalId = setInterval(autoScroll, 3000);
        
        // Initial setup
        scrollToIndex(index);
        setTimeout(scaleImages, 600);
        
        return intervalId;
    }

    // Initialize both scrollers if they exist
    setupScroller(".photo-scroller");
    setupScroller(".image-scroller");
});
