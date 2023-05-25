window.onscroll = function() {
    const scrollPos = window.scrollY;
    const wHeight = window.innerHeight;
    const wave1 = document.querySelector("#wave1")
    const wave2 = document.querySelector("#wave2")
    if(wave1!==null && wave2!==null){
        if(scrollPos>150){
            wave1.style.transform = `translateX(${scrollPos-150}px)`
        }
        if(scrollPos>wHeight){
            wave2.style.transform = `scaleX(-1) translateX(${scrollPos-wHeight}px)`
        }
    }
};
