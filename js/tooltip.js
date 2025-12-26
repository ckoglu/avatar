function initializeTooltip() {
    let currentTooltipEl = null;
    let currentTargetEl = null;

    const showTooltip = (el) => {
        const tooltipText = el.dataset.altTooltip || el.dataset.sagTooltip || el.dataset.solTooltip || el.dataset.ustTooltip || el.dataset.tooltip;
        if (!tooltipText) return;

        const tooltip = document.createElement("div");
        tooltip.textContent = tooltipText;
        tooltip.setAttribute('data-tooltip-container', '');
        document.body.appendChild(tooltip);

        const rect = el.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const offset = 8;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // AKILLI KONUMLANDIRMA FONKSİYONU
        const calculatePosition = () => {
            const positions = [
                {
                    name: 'top',
                    top: rect.top - tooltipRect.height - offset,
                    left: rect.left + (rect.width - tooltipRect.width) / 2,
                    fits: rect.top - tooltipRect.height - offset > 0,
                    priority: 1
                },
                {
                    name: 'bottom',
                    top: rect.bottom + offset,
                    left: rect.left + (rect.width - tooltipRect.width) / 2,
                    fits: rect.bottom + tooltipRect.height + offset < windowHeight,
                    priority: 2
                },
                {
                    name: 'right',
                    top: rect.top + (rect.height - tooltipRect.height) / 2,
                    left: rect.right + offset,
                    fits: rect.right + tooltipRect.width + offset < windowWidth,
                    priority: 3
                },
                {
                    name: 'left',
                    top: rect.top + (rect.height - tooltipRect.height) / 2,
                    left: rect.left - tooltipRect.width - offset,
                    fits: rect.left - tooltipRect.width - offset > 0,
                    priority: 4
                }
            ];

            // Önce özel attribute varsa onu kullan
            if (el.hasAttribute("data-alt-tooltip")) {
                return positions.find(p => p.name === 'bottom') || positions[0];
            } else if (el.hasAttribute("data-ust-tooltip")) {
                return positions.find(p => p.name === 'top') || positions[1];
            } else if (el.hasAttribute("data-sag-tooltip")) {
                return positions.find(p => p.name === 'right') || positions[2];
            } else if (el.hasAttribute("data-sol-tooltip")) {
                return positions.find(p => p.name === 'left') || positions[3];
            }

            // Akıllı konumlandırma: önce uygun pozisyonları bul
            const validPositions = positions.filter(p => p.fits);
            
            if (validPositions.length > 0) {
                // Uygun pozisyon varsa, priority'ye göre sırala
                return validPositions.sort((a, b) => a.priority - b.priority)[0];
            }

            // Hiç uygun pozisyon yoksa, en az taşanı bul
            return positions.reduce((best, current) => {
                const bestOverflow = calculateOverflow(best);
                const currentOverflow = calculateOverflow(current);
                return currentOverflow < bestOverflow ? current : best;
            });
        };

        const calculateOverflow = (pos) => {
            let overflow = 0;
            if (pos.top < 0) overflow += Math.abs(pos.top);
            if (pos.top + tooltipRect.height > windowHeight) overflow += (pos.top + tooltipRect.height - windowHeight);
            if (pos.left < 0) overflow += Math.abs(pos.left);
            if (pos.left + tooltipRect.width > windowWidth) overflow += (pos.left + tooltipRect.width - windowWidth);
            return overflow;
        };

        const position = calculatePosition();

        // Pozisyonu uygula ve sınırlara yasla
        let finalTop = position.top;
        let finalLeft = position.left;

        // Sınır kontrolleri
        if (finalTop < 0) finalTop = offset;
        if (finalTop + tooltipRect.height > windowHeight) {
            finalTop = windowHeight - tooltipRect.height - offset;
        }
        if (finalLeft < 0) finalLeft = offset;
        if (finalLeft + tooltipRect.width > windowWidth) {
            finalLeft = windowWidth - tooltipRect.width - offset;
        }

        tooltip.style.top = `${finalTop}px`;
        tooltip.style.left = `${finalLeft}px`;

        currentTooltipEl = tooltip;
        currentTargetEl = el;
    };

    const hideTooltip = () => {
        if (currentTooltipEl) {
            currentTooltipEl.remove();
            currentTooltipEl = null;
            currentTargetEl = null;
        }
    };

    document.addEventListener(
        "mouseenter",
        (e) => {
            const el = e.target;
            if (el.nodeType === Node.ELEMENT_NODE && el.matches("[data-alt-tooltip], [data-sag-tooltip], [data-sol-tooltip], [data-ust-tooltip], [data-tooltip]")) {
                el.tooltipTimeout = setTimeout(() => showTooltip(el), 300);
            }
        },
        true
    );

    document.addEventListener(
        "mouseleave",
        (e) => {
            const el = e.target;
            if (el.nodeType === Node.ELEMENT_NODE && el.matches("[data-alt-tooltip], [data-sag-tooltip], [data-sol-tooltip], [data-ust-tooltip], [data-tooltip]")) {
                clearTimeout(el.tooltipTimeout);
                hideTooltip();
            }
        },
        true
    );

    window.addEventListener("scroll", () => {
        if (!currentTooltipEl || !currentTargetEl) return;

        const el = currentTargetEl;
        const tooltip = currentTooltipEl;
        const rect = el.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const offset = 8;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Mevcut pozisyonu koru veya yeniden hesapla
        const currentTop = parseFloat(tooltip.style.top);
        const currentLeft = parseFloat(tooltip.style.left);
        
        // Hangi pozisyonda olduğunu tahmin et
        let positionName = 'bottom';
        if (currentTop < rect.top) positionName = 'top';
        else if (currentLeft > rect.right) positionName = 'right';
        else if (currentLeft < rect.left) positionName = 'left';

        // Yeni pozisyonu hesapla
        let newTop = currentTop;
        let newLeft = currentLeft;

        switch(positionName) {
            case 'top':
                newTop = rect.top - tooltipRect.height - offset;
                newLeft = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                newTop = rect.bottom + offset;
                newLeft = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'right':
                newTop = rect.top + (rect.height - tooltipRect.height) / 2;
                newLeft = rect.right + offset;
                break;
            case 'left':
                newTop = rect.top + (rect.height - tooltipRect.height) / 2;
                newLeft = rect.left - tooltipRect.width - offset;
                break;
        }

        // Sınır kontrolleri
        if (newTop < 0) newTop = offset;
        if (newTop + tooltipRect.height > windowHeight) newTop = windowHeight - tooltipRect.height - offset;
        if (newLeft < 0) newLeft = offset;
        if (newLeft + tooltipRect.width > windowWidth) newLeft = windowWidth - tooltipRect.width - offset;

        tooltip.style.top = `${newTop}px`;
        tooltip.style.left = `${newLeft}px`;
    });
}

document.addEventListener('DOMContentLoaded', function() {initializeTooltip();});