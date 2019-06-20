const css = require('./style.scss');
import Poisson from "./poisson";


let poisson = new Poisson(100,5,false);
poisson.iteration(1000);



// EVENTS

const uiAnimationBtnList = document.querySelectorAll('[data-animation-times]');
for (const button of uiAnimationBtnList) {
    button.addEventListener('click', function(event) {
        let times = button.dataset.animationTimes;
        poisson.iteration(times);
    })
}

const uiAnimationPlay = document.querySelector('[data-animation-play]');
uiAnimationPlay.addEventListener('click', function(event) {
    uiAnimationPlay.classList.add("disabled");
    poisson.playAnimation();
});


let checkbox = document.querySelector("[data-checkbox-dynamic-source]");
checkbox.addEventListener( 'change', function() {
    if(this.checked) {
        poisson.setDynamicSourceStatus(true)
    } else {
        poisson.setDynamicSourceStatus(false)
    }
});


document.querySelector("[data-reset-space]").addEventListener('click', function(event) {
    restart()
});

// FUNCTION

const restart = () => {

    uiAnimationPlay.classList.remove("disabled");
    if(poisson.animationId){
        poisson.stopAnimation();
    }

    poisson = new Poisson(100,5,false); 
    poisson.iteration(1000);
    document.querySelector("[data-checkbox-dynamic-source]").checked = false;
}



window.poisson = poisson;