var createTime = '<%=data.investCreateTime%>';
var userName = '<%=data.userName%>';
createTime = createTime.split(" ")[0];
var  str=createTime.toString();
       str =  str.replace(/-/g,"/");
var oDate1 = new Date(str);
formatTime = oDate1.getFullYear() + '年' + (oDate1.getMonth() + 1)+'月'+oDate1.getDate()+'日';
$('.formatTime').html(formatTime);
$('.createDate').html(createTime);
var userName = userName.match(/^[\u4E00-\u9FA5]{1}/);
var t = "***".replace(reg,"$1");
alert(t);