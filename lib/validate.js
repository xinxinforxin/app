module.exports = function (paramter, list, res){
	var t = "";
	for(var i = 0; i < list.length; i++){
		var variable = paramter[list[i]];
		if(variable != undefined){ 
			variable = variable.replace(/(^\s*)|(\s*$)/g,"");
		}
		if(i != list.length -1){
			
			if(variable == "" || variable == undefined || variable == null){
				t = t + list[i] + ",";
			}
		}else{

			if(variable == "" || variable == undefined || variable == null){
				t = t + list[i] + " 参数为空";
			}
		}
		
	}	
	if(t != ""){
		res.send({
			code:-10,
			detail:t,
			value:""
		})
		return false;
	}
	return true;
}