
$('.header').tap(function(){
    $(this).next().toggle();
    $(this).find('img').toggleClass('upArrow');
    $(this).find('img').toggleClass('downArrow');
});