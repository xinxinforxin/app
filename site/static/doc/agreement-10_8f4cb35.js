var createTime = '<%=data.investCreateTime%>';
//createTime = createTime.split(" ")[0];
var  str=createTime.toString();
       str =  str.replace(/-/g,"/");
      //// str =  str.replace("T"," "); 
   var oDate1 = new Date(str);
   alert(oDate1.Format("yyyy年MM月dd日"));
/*createTime.replace("-","年");
alert(createTime.replace("-","年"));*/