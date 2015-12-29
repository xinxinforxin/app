
$('.header').triggerHandler('tap', [sliderup($(this).next()), sliderdown($(this).next()]);

function sliderup(e){
    e.animate({
        opacity: 0,height:'0'
        }, 500, 'ease-out');
}
function sliderdown(e){
    e.animate({
        opacity: 1,height:'auto'
        }, 500, 'ease-out');
}