
$('.header').triggerHandler('tap', [sliderup($(this).next()), sliderdown($(this).next()])

function slideup(e){
    e.animate({
        opacity: 0,height:'0'
        }, 500, 'ease-out');
}   
$("#some_element").animate({
  opacity: 0.25, left: '50px', rotateZ: '45deg', color: '#abcdef'
}, 2, 'ease-out')

$('.delete').tap(function(){
  $(this).parent('li').remove()
})