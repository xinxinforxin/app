var createTime = '<%=data.investCreateTime%>';
var userName = '<%=data.userName%>';
createTime = createTime.split(" ")[0];
var  str=createTime.toString();
       str =  str.replace(/-/g,"/");
var oDate1 = new Date(str);
formatTime = oDate1.getFullYear() + '年' + (oDate1.getMonth() + 1)+'月'+oDate1.getDate()+'日';
$('.formatTime').html(formatTime);
$('.createDate').html(createTime);
/\/([\u4E00-\u9FA5]*).*/g
var reg = /\/([\u4E00-\u9FA5]*).*;
var t = "四川省仁寿县".replace(reg, "$1");;
alert(t);