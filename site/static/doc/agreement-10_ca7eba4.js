var createTime = '<%=data.investCreateTime%>';
var  str=createTime.toString();
       str =  str.replace(/-/g,"/");
var oDate1 = new Date(str);
formatTime = oDate1.getFullYear() + '年' + (oDate1.getMonth() + 1)+'月'+oDate1.getDate()+'日';
$('.formatTime').html(formatTime);
$('.createDate').html(createTime);