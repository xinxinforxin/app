var createTime = '<%=data.investCreateTime%>';
createTime = createTime.split(" ")[0];
var time2 = new Date(createTime).format("yyyy年MM月dd日");  
alert(time2);