$.ajax({
    url: "/doc/list/mobile?type=91&start=0&length=110",
    method: "GET",
    success: function(data){
        var addhtml = successData(data.aaData);
        $('.ninty-one').next().html(addhtml);
        }
    });