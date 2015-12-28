wx.ready(function() {
	var p = {
		title: wx_share.title,
		desc: wx_share.desc,
		link: wx_share.link,
		imgUrl: wx_share.img,
		success: window.wx_share_success || function() {},
		cancel: function() {}
	};
	wx.onMenuShareTimeline(p);
	wx.onMenuShareAppMessage(p);
	wx.onMenuShareQQ(p);
	wx.onMenuShareWeibo(p);
	wx.onMenuShareQZone(p);
});