function v_code() {
	var code = "";
	var codeLength = 6;
	var selectChar = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

	for (var i = 0; i < codeLength; i++) {
		var charIndex = Math.floor(Math.random() * 10);
		code += selectChar[charIndex];
	}
	return code;
}

exports.v_code = v_code;