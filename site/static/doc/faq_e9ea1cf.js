$('.header').toggle(alert("d"));
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

/*$('.header').tap(function(){
    $(this).toggle(sliderup($(this).next()),sliderdown($(this).next());
        alert(d);
});*/