$.ajax({
    url: "/doc/list/mobile?type=91&start=0&length=110",
    method: "GET",
    success: function(data){
        var addhtml = successData(data.aaData);
        $('.ninty-one').next().html(addhtml);
        }
    });
function successData(data){
    var addhtml = '';
    for (var i = 0 ;i < data.length; i++) {
            addhtml += '<div class="titleLine"><i class="redCircle"> </i><span class="title2">'+data[i].title+'</span></div><p class="contectfont">'+data[i].detail+'</p>';
            }
    return addhtml;

}