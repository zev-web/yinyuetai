/*
	滑屏原理
	1.手指按下去的时候，记录下手指坐标
	2.移动的时候，记录手指坐标
	3.用移动后的坐标 - 移动前的坐标 = 手指 移动的距离
	4. 手指按下去的时候，记录下元素的位置
	5.移动之后，用手指移动的距离 + 元素的初始位置 =  元素现在所要在的位置
*/

//取消橡皮筋效果
document.addEventListener(
  "touchstart",
	function(e) {
		e.preventDefault();
	}
);
///幻灯片
scrollPic();
//顶部导航
navShow();
//选项卡
tab();
//弹性导航
navSwipe();
/*滑动 滚动条*/
scroll();

///幻灯片
function scrollPic() {
	var wrap = document.querySelector("#picTab");
	var list = document.querySelector("#picList");
	list.innerHTML += list.innerHTML;
	var lis = document.querySelectorAll("#picList li");
	var css = document.createElement('style');
	var nav = document.querySelectorAll("#picNav span");
	var style = "#wrap{height:"+ lis[0].offsetHeight+"px}";
	var timer = 0;
	style+="#picList{width:"+lis.length+"00%}";
	style+="#picList li{width:"+(1/lis.length*100)+"%}"
	css.innerHTML+= style;
	document.head.appendChild(css);
	var startPoint = 0;
	var startX = 0;
	var now = 0;
	var isMove = true;
	var isFirst = true;
	cssTransform(list,"translateZ",0.01);
	cssTransform(list,"translateX",0);
	auto();
	wrap.addEventListener(
		"touchstart",
		function(e) {
			clearInterval(timer);
			list.style.transition = "none";
			var translateX = cssTransform(list,"translateX");
			now = Math.round(-translateX / wrap.offsetWidth);
			if(now == 0) {
				now = nav.length;
			}
			if(now == lis.length-1) {
				now = nav.length-1;
			}
			/*
				 对象是存址的，
				move的时候，和 start 提取手指坐标，手指坐标的对象用的是同一个对象
			*/
			cssTransform(list,"translateX",-now * wrap.offsetWidth);
			startPoint = {pageX: e.changedTouches[0].pageX,pageY: e.changedTouches[0].pageY}; //存址 存值
			startX = cssTransform(list,"translateX");
			isMove = true;
			isFirst = true;
		}
	);
	wrap.addEventListener(
		"touchmove",
		function(e) {
			if(!isMove) {
				return;
			}
			var nowPoint = e.changedTouches[0];
			var disX = nowPoint.pageX - startPoint.pageX;
			var disY = nowPoint.pageY - startPoint.pageY;
			if(isFirst) {
				isFirst = false;
				if(Math.abs(disY) > Math.abs(disX)) {
					isMove = false;
				}
			}
			if(isMove) {
				cssTransform(list,"translateX",startX + disX);
			}
		}
	);
	wrap.addEventListener(
		"touchend",
		function(e) {
			var translateX = cssTransform(list,"translateX");
			now = Math.round(-translateX / wrap.offsetWidth);
			tab();
			auto();
		}
	);
	function auto() {
		clearInterval(timer);
		timer = setInterval(
			function() {
				if(now == lis.length-1) {
					now = nav.length-1;
				}
				list.style.transition = "none";
				cssTransform(list,"translateX",-now * wrap.offsetWidth);
				setTimeout(
					function () {
						now++;
						tab();
					},50
				);
			},3000
		);
	}
	function tab() {
		list.style.transition = ".5s";
		cssTransform(list,"translateX",-now * wrap.offsetWidth);
		for(var i = 0 ; i < nav.length; i++) {
			nav[i].className = "";
		}
		nav[now%nav.length].className = "active";
	}
}
//顶部导航
function navShow() {
	var btn = document.querySelector("#menuBtn");
	var nav = document.querySelector("#nav");
	btn.addEventListener(
		"touchstart",
		function(e) {
			if(btn.className == "menu-btn-close") {
				btn.className = "menu-btn-show";
				nav.style.display = "block";
			} else {
				btn.className = "menu-btn-close";
				nav.style.display = "none";
			}
			e.stopPropagation();
		}
	);
	nav.addEventListener("touchstart", function(e) {
		e.stopPropagation();
	});
	document.addEventListener(
		"touchstart",
		function (){
			if(btn.className == "menu-btn-show"){
				btn.className = "menu-btn-close";
				nav.style.display = "none";
			}
		}
	);
}
//选项卡
function tab(){
	var tabList = document.querySelectorAll(".tabList");
	var tabNav = document.querySelectorAll(".tabNav");
	var width = tabNav[0].offsetWidth;
	for(var i = 0; i < tabNav.length; i++) {
		swipe(tabNav[i],tabList[i]);
	}
	function swipe(nav,list){
		cssTransform(list,"translateZ",0.01);
		cssTransform(list,"translateX",-width);
		var startPoint = 0;
		var startX = 0;
		var now = 0;
		var isMove = true;
		var isFirst = true;
		var next = document.querySelectorAll(".tabNext");
		var isLoad = false;
		var navA = nav.getElementsByTagName('a');
		var navActive = nav.getElementsByTagName('span')[0];
		list.addEventListener(
			"touchstart",
			function(e) {
				if(isLoad) {
					return;
				}
				list.style.transition = "none";
				startPoint = {pageX:e.changedTouches[0].pageX,pageY:e.changedTouches[0].pageY};
				startX = cssTransform(list,"translateX");
				isMove = true;
				isFirst = true;
			}
		);
		list.addEventListener(
			"touchmove",
			function(e) {
				if(isLoad) {
					return;
				}
				if(!isMove) {
					return;
				}
				var nowPoint = e.changedTouches[0];
				var disX = nowPoint.pageX - startPoint.pageX;
				var disY = nowPoint.pageY - startPoint.pageY;
				if(isFirst) {
					isFirst = false;
					if(Math.abs(disY) > Math.abs(disX)) {
						isMove = false;
					}
				}
				if(isMove) {
					cssTransform(list,"translateX",startX + disX);
				}
				if(Math.abs(disX) > width/2){
					end(disX);
				}
			}
		);
		list.addEventListener(
			"touchend",
			function() {
				if(isLoad) {
					return ;
				}
				list.style.transition = ".5s";
				cssTransform(list,"translateX",-width);
			}
		);
		function end(disX){
			isLoad = true;
			var dir = disX/Math.abs(disX); //正 右侧  负左侧
			var target = dir > 0? 0: -2*width;
			//console.log(dir);// -1 下一张   1 上一张
			now -= dir;
			//console.log(now);
			if(now < 0) {
				now = navA.length - 1;
			}
			if(now >= navA.length) {
				now = 0;
			}
			//console.log(now);
			list.style.transition = "300ms";
			cssTransform(list,"translateX",target);
			list.addEventListener(
				"webkitTransitionEnd",
				tranEnd
			);
			list.addEventListener(
				"transitionend",
				tranEnd
			);
		}
		function tranEnd(){
			var left = navA[now].offsetLeft;
			console.log(left);

			cssTransform(navActive,"translateX",left);
			list.removeEventListener(
				"webkitTransitionEnd",
				tranEnd
			);
			list.removeEventListener(
				"transitionend",
				tranEnd
			);
			for(var i = 0; i < next.length; i++){
				next[i].style.opacity = 1;
			}
			setTimeout(
				function(){ /* 在工作的时候，应该通过ajax 请求数据，然后修改 show里边内容，之后执行代码*/
					list.style.transition = "none";
					cssTransform(list,"translateX",-width);
					isLoad = false;
					for(var i = 0; i < next.length; i++){
						next[i].style.opacity = 0;
					}
				},1000
			)
		}
	}
}
//弹性导航
function navSwipe() {
	var navScroll = document.querySelector('#navScroll');
	var navs = document.querySelector('#navs');
	var startPoint = 0;
	var startX = 0;
	var minX = navScroll.clientWidth - navs.offsetWidth;
	var step = 1;
	var lastX = 0; //上次的距离
	var lastTime = 0;//上次的时间戳
	var lastDis = 0;
	var lastTimeDis = 0;
	cssTransform(navs,"translateZ",0.01);
	navScroll.addEventListener(
		'touchstart',
		function(e) {
			navs.style.transition = "none";
			startPoint = e.changedTouches[0].pageX;
			startX = cssTransform(navs,"translateX");
			step = 1;
			lastX = startPoint;
			lastTime = new Date().getTime();
			lastDis = 0;
			lastTimeDis = 0;
		}
	);
	navScroll.addEventListener(
		'touchmove',
		function(e) {
			var nowPoint = e.changedTouches[0].pageX;
			var dis = nowPoint - startPoint;
			var left = startX + dis;
			var nowTime = new Date().getTime();
			if(left > 0) {
				step = 1-left / navScroll.clientWidth; //根据超出长度计算系数大小，超出的越到 系数越小
				left = parseInt(left*step);
				/*left = 0;*/
			}
			if(left < minX) {
				var over = minX - left; // 计算下超出值
				step = 1-over / navScroll.clientWidth; //根据超出值计算系数
				over = parseInt(over*step);
				left = minX - over;
				/*left = minX; */
			}
			lastDis = nowPoint-lastX; //距离差值
			lastTimeDis = nowTime - lastTime; //时间差值
			lastX = nowPoint;
			lastTime = nowTime;
			cssTransform(navs,"translateX",left);
		}
	);
	navScroll.addEventListener(
		'touchend',
		function (){
			var speed = (lastDis/lastTimeDis)*300; //用距离差值/时间差值 = 速度   速度*系数 = 缓冲距离
			var left = cssTransform(navs,"translateX");
			var target = left + speed; //当前值 + 缓冲距离 = 目标点
			var type = "cubic-bezier(.34,.92,.58,.9)";
			var time = Math.abs(speed*.9);
			time = time<300?300:time;
			if(target > 0) {
				target = 0;
				type ="cubic-bezier(.08,1.44,.6,1.46)";
			}
			if(target < minX) {
				target = minX;
				type ="cubic-bezier(.08,1.44,.6,1.46)";
			}
			navs.style.transition = time+"ms " + type;
			cssTransform(navs,"translateX",target);
		}
	);
}


/*滑动 滚动条*/
function scroll() {
	var wrap  = document.querySelector(".wrap");
	var scroll = wrap.children[0];
	var bar = document.querySelector('#scrollBar');
	var callBack = {};
	var scale = wrap.clientHeight/scroll.offsetHeight;
	var search = document.querySelector(".search");
	var searchBtn = document.querySelector(".search-btn");
	bar.style.height = wrap.clientHeight*scale + "px";
	searchBtn.addEventListener("touchend",
		function() {
			var top =-cssTransform(scroll,"translateY")
			if(search.style.display == "block") {
				if(top) {
		 			search.style.display = "none";
				}
			} else {
				search.style.display = "block"
			}
		}
	);
	callBack.in = function() {
		bar.style.opacity = 1;
		var top =-cssTransform(scroll,"translateY")*scale;
		cssTransform(bar,"translateY",top);
		if(top) {
 			search.style.display = "none";
		}
	};
	callBack.over = function() {
		bar.style.opacity = 0;
		var top =-cssTransform(scroll,"translateY");
		cssTransform(bar,"translateY",top);
		if(top == 0) {
 			search.style.display = "block";
		}
	};
	addScroll(wrap,callBack);
}
/*
	如果在webkit内核下的浏览器 出现transition的闪烁问题：
	解决办法：
		1. 给运动元素 开启3d加速
		2. 给运动元素本身加上 ：
			-webkit-backface-visibility: hidden;
  			backface-visibility: hidden;
		3.给运动元素的父级加：
			-webkit-transform-style: preserve-3d;
  			transform-style: preserve-3d;
*/
