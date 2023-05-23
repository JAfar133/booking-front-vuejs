window.onscroll = function() {
    const scrollPos = window.pageYOffset;
    const wWidth = window.innerWidth;
    const menu_item = document.querySelector('.menu-item');
    const body =  document.querySelector('.body');
    if(wWidth>991){
        if (scrollPos >= 50) {
            menu_item.classList.add('fixed');
            body.classList.add('paddingTop');
        } else {
            menu_item.classList.remove('fixed');
            body.classList.remove('paddingTop');
        }
    }
};