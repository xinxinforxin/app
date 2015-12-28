    $('.page').eq(0).show();
    $('.outborder').tap(function(){
        $(this).removeClass('outhover').addClass('outhover').siblings('.outhover').removeClass().children().removeClass('padhover');
        $(this).children().removeClass('padhover').addClass('padhover');
        $('.page').hide();
        $('.page').eq($(this).index()).show();
    });