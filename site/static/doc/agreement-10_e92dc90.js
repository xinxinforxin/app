var createTime = '<%=data.investCreateTime%>';
createTime = createTime.split(" ")[0];
var myDate=new Date();
var createdTime = createTime.split("-");
myDate.setFullYear(createdTime[0],createdTime[1],createdTime[1]);
var time2 = myDate.format("yyyy年MM月dd日"); 

alert(time2);