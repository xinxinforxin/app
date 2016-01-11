
$('.header').tap(function(){
    $(this).next().toggle();
    $(this).find('img').toggleClass('upArrow');
    $(this).find('img').toggleClass('downArrow');
});
$('.ninty').tap(function(){
    $.ajax({
    url: "/doc/list/mobile?type=90&start=0&length=110",
    method: "GET",
    success: function(data){
        var addhtml = successData(data.aaData);
        $('.ninty').next().html(addhtml.replace(/[\r\n]/g,""));
        }
    });
});
$('.ninty-one').tap(function(){
    $.ajax({
    url: "/doc/list/mobile?type=91&start=0&length=110",
    method: "GET",
    success: function(data){
        var addhtml = successData(data.aaData);
        $('.ninty-one').next().html(addhtml.replace(/[\r\n]/g,""));
        }
    });
});
$('.ninty-two').tap(function(){
    $.ajax({
    url: "/doc/list/mobile?type=92&start=0&length=110",
    method: "GET",
    success: function(data){
        var addhtml = successData(data.aaData);
        $('.ninty-two').next().html(addhtml.replace(/[\r\n]/g,""));
        }
    });
});
$('.ninty-three').tap(function(){
    $.ajax({
    url: "/doc/list/mobile?type=93&start=0&length=110",
    method: "GET",
    success: function(data){
        var addhtml = successData(data.aaData);
        $('.ninty-three').next().html(addhtml.replace(/[\r\n]/g,""));
        }
    });
});
$('.ninty-four').tap(function(){
    $.ajax({
    url: "/doc/list/mobile?type=94&start=0&length=110",
    method: "GET",
    success: function(data){
        var addhtml = successData(data.aaData);
        $('.ninty-four').next().html(addhtml.replace(/[\r\n]/g,""));
        }
    });
});
function successData(data){
    var addhtml = '';
    for (var i = 0 ;i < data.length; i++) {
            addhtml += '<div class="titleLine"><i class="redCircle"> </i><span class="title2">'+data[i].title+'</span></div><p class="contectfont">'+data[i].detail+'</p>';
            }
    return addhtml;

}