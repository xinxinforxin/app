/*$('.header').toggle(alert(""));*/
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

$('.header').tap(function(){
    $(this).next().toggle($(this).next().height(0));
});