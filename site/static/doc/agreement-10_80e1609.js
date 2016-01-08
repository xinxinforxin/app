var createTime = '<%=data.investCreateTime%>';
createTime = createTime.split(" ")[0];
createTime.replace("-","年");
alert(createTime);