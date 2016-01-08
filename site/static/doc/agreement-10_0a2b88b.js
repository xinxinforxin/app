var createTime = '<%=data.investCreateTime%>';
createTime = createTime.split(" ")[0];
createTime = setDate(createTime);
alert(createTime);
/*createTime.replace("-","年");
alert(createTime.replace("-","年"));*/