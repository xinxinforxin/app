var createTime = '<%=data.investCreateTime%>';
createTime = createTime.split(" ")[0];
var myDate=new Date()
createdTime = createTime.splite("-");
myDate.setFullYear(createTime.splite,7,9)
var time2 = new Date(createTime).format("yyyy年MM月dd日"); 

alert(time2);