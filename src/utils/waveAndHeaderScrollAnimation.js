function headerScrollHandler() {
    const scrollPos = window.scrollY;
    const wWidth = window.innerWidth;
    const menu_item = document.querySelector('.menu-item');
    const body =  document.querySelector('.body');
    if (wWidth > 991 && menu_item!==null && body!==null) {
        if (scrollPos >= 50) {
            menu_item.classList.add('fixed');
            body.classList.add('paddingTop');
        } else {
            menu_item.classList.remove('fixed');
            body.classList.remove('paddingTop');
        }
    }
}

function waveScrollHandler() {
    const scrollPos = window.scrollY;
    const wHeight = window.innerHeight;
    const wave1 = document.querySelector("#wave1");
    const wave2 = document.querySelector("#wave2");
    if (wave1 !== null && wave2 !== null) {
        if (scrollPos > 150) {
            wave1.style.transform = `translateX(${scrollPos - 150}px)`;
        }
        if (scrollPos > wHeight) {
            wave2.style.transform = `scaleX(-1) translateX(${scrollPos - wHeight}px)`;
        }
    }
}

// Attach both scroll handlers
window.onscroll = function() {
    headerScrollHandler();
    waveScrollHandler();
};
