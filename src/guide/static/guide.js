var isfirst=true;
$(function() {
    var dev_height = document.documentElement.clientHeight;
    var dev_width = document.documentElement.clientWidth;
    if (dev_height <= dev_width) {
        alert("请将屏幕竖着,重新加载");
        window.stop();
    }
})
$('.limitIcon').click(function(){
    if(isfirst)
        turnoff();
        isfirst=false;
});

function turnoff() {
    var isfirst = true;
    //var beauty = $('.beauty');
    setTimeout(function() {
        $('#p01').hide()
    }, 100);
    setTimeout(function() {
        $('#p02').hide()
    }, 200);
    setTimeout(function() {
        $('#p03').hide()
    }, 300);
    setTimeout(function() {
        $('#p04').hide()
    }, 400);
    setTimeout(function() {
        $('#icorn').fadeOut(0)
    }, 300);
    setTimeout(function() {
        $('#sprinklink').fadeOut(500)
    }, 400);
    setTimeout(function() {
        enlarge()
    }, 500);
    $('#icorn').animate({
        top: "+=15em",
    }, {
        duration: 400,
        specialEasing: {
            top: 'linear'
        },
    });
    $('#sprinklink').animate({
        'margin-top': "+=15em",
    }, {
        duration: 400,
        specialEasing: {
            top: 'linear'
        },
    });
}
$('#icron').addClass('shrink');
    //返回角度



function enlarge(){
    $('#p05').hide();
    $('#sprinklink').hide();
    $('#p06').addClass('enlarge').addClass('large');
    $('#goldlink').addClass('enlargecorn').addClass('largecorn');
    setTimeout(function(){
        $('#flower').addClass('showflower').addClass('flowershowup');
        $('#p06').hide();
    },800);
    setTimeout(function(){
        $('.regdiv').css('display','block');
    },900);
    setTimeout(function(){
        $('#register').addClass('turnover').addClass('overturn');
    },1000);
    setTimeout(function(){
        $('#flower').hide();
    },1300);
    setTimeout(function(){
        $('#register').addClass('scaleright').addClass('rightscale');
        $('.regdiv').addClass('rotateright');
    },1600);
    setTimeout(function(){
        $('#forios').show();
        $('#forandroid').show();
    },2200);
}
var dev_height=document.documentElement.clientHeight;
var dev_width=document.documentElement.clientWidth;
$('.limitIcon').css('height',dev_height*0.56);
$('#forios').click(function(){
    $('.regdiv').hide();
    $('.iosDiv').show();
});