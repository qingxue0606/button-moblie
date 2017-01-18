"use strict";

;(function($){
	var Dialog = function(config){
		var _this=this;
		this.config={
			//按钮配置
			buttuons:null,
			//对话框的类型
			type:"waiting",
			//弹出框延时多久关闭
			delay:null,
			//延时关闭的回调函数
			delayCallback:null,
			//对话框的提示信息

			message:"",
			//遮罩层能否点击关闭
			maskClose:null,
			// 对话框的宽
			width:"auto",
			height:"auto",
			//对话框遮罩层透明度，
			maskOpacity:null,
			//是否启动动画
			effect:null
		};
		//默认参数扩展；
		if (config && $.isPlainObject(config) ) {
			$.extend(this.config, config);
			
		}else {
			this.isConfig=true;
		};
		//创建基本的dom
		this.body=$("body");
		//创建遮罩层
		this.mask=$('<div class="g-dialog-container">');
		//创建弹出框
		this.win=$('<div class="dialog-window">');
		//创建弹出框头部
		this.winHeader=$('<div class="dialog-header">');
		//创建提示信息
		this.winContent=$('<div class="dialog-content">');
		//创建弹出框按钮组
		this.winFooter=$('<div class="dialog-footer">');
		//渲染Dom
		this.creat();



	};
	//记录弹框层级，静态属性
	Dialog.zIndex=10000;

	Dialog.prototype={
		//动画函数
		animate:function(){
			var _this=this;
			this.win.css("-webkit-transform","scale(0,0)");
			window.setTimeout(function(){
				_this.win.css("-webkit-transform","scale(1,1)");
			},100);
			
		},
		creat:function(){
			var _this=this,
			config=this.config,
			win=this.win,
			mask=this.mask,
			header=this.winHeader,
			content=this.winContent,
			footer=this.winFooter,
			body=this.body;
			//增加弹框层级
			Dialog.zIndex++;
			mask.css('zIndex', Dialog.zIndex);

			//如果没有传递任何配置参数，就弹出一个等待的弹框
			if(this.isConfig){
				win.append(header.addClass('waiting'));
				if(config.effect){
					this.animate();
				}


				mask.append(win);
				body.append(mask);
			}else {
				//根据配置参数配置弹框
				header.addClass(config.type);
				win.append(header);
				//如果传递了信息文本
				if(config.message){
					win.append( content.html(config.message));

				}
				//如果传递了按钮组；
				if(config.buttuons){
					//
					win.append(footer);
				};
				mask.append(win);
				body.append(mask);
				//设置对话框的宽高；
				if(config.width!="auto"){
					win.width(config.width);
				}
				//设置对话框的高度；
				if(config.height!="auto"){
					win.height(config.height);
				}
				//对话框遮罩透明度
				if(config.maskOpacity){
					mask.css('backgroundColor', 'rgba(0,0,0,'+config.maskOpacity+')');
				}
				//设置弹出框，弹出后多久关闭；
				if(config.delay && config.delay!=0){
					window.setTimeout(function(){
						_this.close();
						//执行延时的回调函数
						_this.config.delayCallback && _this.config.delayCallback();
					},config.delay);

				}
				if(config.effect){
					this.animate();
				}
				console.log(config.effect);
				if(config.buttuons){
					this.creatButtons(footer,config.buttuons);

				}
				//指定遮罩层点击是否关闭
				if(config.maskClose){
					mask.tap(function(){
						_this.close();
					});
				}



			}




		},
		//根据配置参数的buttons创建按钮列表
		creatButtons:function(footer,buttuons){
			var _this=this;
			$(buttuons).each(function(index, el) {
				//获取按钮的样式，回调以及文本，
				var type=this.type?' class='+this.type:' class='+'';
				var btnText=this.text?this.text:'按钮'+(index);
				var button=$('<button'+type+'>'+btnText+'</button>');
				var callback=this.callback?this.callback:null;
				if(callback){
					button.tap(function(e){
						var isClose=callback();
						//阻止事件冒泡
						e.stopPropagation();
						//e.preventDefault();
						if(isClose!=false){
							_this.close(); 
						}
					})
				}else {
					button.tap(function(e){
						e.stopPropagation();
						//e.preventDefault();
						_this.close(); 
					})
				}

				footer.append(button);
			});
		},
		close:function(argument) {
			//把遮罩层去掉
			this.mask.remove();

		}
	};
	window.Dialog=Dialog;
	$.dialog=function(config){
				return new Dialog(config);
			}

})(Zepto);