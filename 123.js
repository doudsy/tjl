var cityStr='';
//数字输入限制
function amountLimit(obj){
    obj.value = obj.value.replace(/[^\d.]/g, "");
    obj.value = obj.value.replace(/\.{2,}/g, ".");
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    if (obj.value.indexOf(".") < 0 && obj.value != "") {
        obj.value = parseFloat(obj.value);
    }
}

//上传图片
function uploadImg(obj){
	//上传图片要点   
	//1.判断是否选择了图片  2.判断上传图片的位置是哪里(以便限制上传的数量)   3.判断图片后缀是否符合   4. 图片大小是否符合要求  5.图片上传的路径  
	//6.将图片传入后台 并显示到页面
	if (obj.value == "" || obj.value == null) {
        // tipBoxJ.msg({ title: "没有选择文件", time: 1000, icon: 2 });
        return false;
    }
    var obj_id=obj.parentNode.parentNode.id;  
    var imgBox = obj.parentNode.previousElementSibling; //存放图片的div
    var imgBack = imgBox.querySelectorAll(".imgBack");//真正图片展示div
    console.log(obj_id);
    if(obj_id=="imgList"){
    	if(imgBack.length>1){
    		// tipBoxJ.msg({title:"最多上传2张商品主图",time:2000,icon:2});
    		return false;
    	}
    
    }else{
    	if(imgBack.length>2){
    		// tipBoxJ.msg({title:"最多上传3张商品主图",time:2000,icon:2});
    		return false;
    	}
    }
     //判断图片后缀
    var ext = obj.value.substring(obj.value.lastIndexOf(".") + 1).toLowerCase();
    if (ext != 'png' && ext != 'jpg' && ext != 'jpeg' && ext != 'gif' && ext != 'bmp') {
        // tipBoxJ.msg({ title: "图片的格式必须为png、jpg、jpeg、bmp及gif格式！", time: 1000, icon: 2 });
        return false;
    }
    if(obj.value!=null&&obj.value!="" &&obj.file.length>0){
    	var fs = new FormData();
    	fs.append("FileCode", "");
        fs.append("FileType", "12");//图片指定路径
        //限制图片大小
        for (var i = 0; i < obj.files.length; i++) {
            var size = obj.files[i].size / 1024 / 1024;
            if (size > 5) {
                // tipBoxJ.closeNew();
                // tipBoxJ.msg({ title: "上传的图片大小不能超过5M！", time: 1000 });
                return false;
            }
            formData.append("File[" + i + "]", obj.files[i]);
        }
        SubmitData("/api/server/uploadFile","POST",fs,true,function(e){
        	var res=JSON.parse(e);
        	var files = res.rData.files;
        	var imgSrc="";
        	if(res.rCode=="0000"){
        		for (var i = 0; i < files.length; i++) {
        			imgSrc = files[i].FileUrl;
        			var imgStr = '<div class="imgBack" id="imgBack">'
                        + ' <span class="removeIcon" id = "removeIcon" onclick = "deleteImg(this)" > '
                        + '  <a class="removeInnerIcon" > x</a ></span > '
                        + '<img src = "' + imgSrc + '" class="imgUploadStyle"></div>';
                    if(imgBack.length<1){
                    	imgBox.innerHTML="";
                    }
        		}
        		imgBox.innerHTML +=imgStr;
        	}else{
        		// tipBoxJ.closeNew();
          //       tipBoxJ.msg({ title: res.rMsg, time: 1000, icon: 2 });
        	}
        },function(readyState,Status){})
    }

}
//删除图片  一张和多张
function deleteImg(_this){
	var imgBox = _this.parentNode.parentNode;//图片盒子
    var imgBack = imgBox.querySelectorAll(".imgBack");
    if (imgBack.length == 1) {
        var str = '<div class="imgBackNull" id="imgBackNull"><img src = "/img/Program/null.jpg" class="imgUploadStyle" /></div >';
        imgBox.innerHTML = str;
    } else {
        imgBox.removeChild(_this.parentNode);
    }
}

//添加更多附加商品
function addMoreOtherGoods(){
	var addGood_ul = document.getElementById("addGood_ul");
	var count  = addGood_ul.querySelectorAll("li").length+1;
	if(count>2){
		// tipBoxJ.msg({title:"最多添加2个附加商品"})；
		return false;
	}
	var str = '<li class="addGood_li"><div class="mainDoodsInfo"><div><label>商品名称：</label><input type="text" name="addGoodName" class="txtInput" /></div><div style="margin-top:15px;">'
		     +'<label>商品链接：</label><input type="text" name="addGoodUrl" class="txtInput" /></div><div class="priceDiv"><div><label class="floatLabel">成交价格：</label><div class="priceDiv_input">'
		     +'<input type="text" name="addGoodPrice" class="numInput" onblur="totalMoney()" /><span>元</span></div><span class="goodTxtTip">（每单总金额<span class="moneyStyle">0</span>元（不含运费））</span></div><div>'
		     +'<label class="floatLabel">展示价格：</label><div class="priceDiv_input"><input type="text" name="addDisplayPrice" class="numInput" /><span>元</span></div>'
		     +'<span class="goodTxtTip">(务必亲自在手机端搜索，保证价格准确)</span></div></div><div class="priceDiv"><div><label class="floatLabel">单拍数量：</label><div class="priceDiv_input">'
		     +'<input type="text" name="addGoodCount" class="numInput" onblur="totalMoney()" /><span>件</span></div><span class="goodTxtTip">（用户拍下价格，不同等级卖号看到商品价格不同，取最大值)</span></div>'
		     // +'<div><label class="floatLabel">商品邮费：</label><div class="priceDiv_input"><input type="text" name="addGoodpPostage" class="numInput" /><span>元</span></div>'
		     // +'<span class="goodTxtTip">(如订单拍下需邮费，则按邮费金额填写，如邮费是0也可不用填写)</span></div>'
		     +'</div><div style="margin-top: 15px;"><label class="floatLabel">商品属性：</label>'
		     +'<input type="text" name="addSkuValue" class="shortTxtInput" placeholder="尺码" /><span class="goodTxtTip">（多个属性请用";"分隔）</span></div><div data-value="imgList" style="margin-top: 20px;">'
		     +'<label class="floatLabel">商品主图：</label><div  class="mainGoodImgDiv"><div class="imgBackNull"><img src="null.jpg" class="imgUploadStyle" /></div></div><div class="addImgBtn">'
		     +'<span class="addImgSpan">+</span><input type="file" class="addImg" id="" data-id="imgList" accept="image/gif,image/jpeg,image/png,image/bmp" /></div><button type="button" class="deleteImgBtn" onclick="deleteOtherGoods(this)">'
		     +'<img src="del.png" /></button></div></div></li>';
		    addGood_ul.insertAdjacentHTML("beforeend",str);
}

//删除附加商品 
function deleteOtherGoods(_this){
	var targetNode = _this.parentNode.parentNode.parentNode;
	document.getElementById("addGood_ul").removeChild(targetNode);
}

//获取城市
// function getProvince(){
// 	var cityData={
// 		ProvinceCode: null,
//         CityCode: null,
//         DistrictCode: null
// 	};
// 	SubmitData("/api/server/getDomesticCity","POST",cityData,false,function(e){
// 		if(e!=null&& isJsonString(e)){
// 			var res = JSON.parse(e);
// 			var data = res.rData.CityList;
// 			var str = '<option value="">全国</option>';
//             var _provinceName = "";
//             var cityName = "";
// 			if(res.rCode=="0000"){
// 				//成功
// 				 for (var i = 0; i < data.length; i++) {
//                     var _provinceCode = data[i].ProvinceCode,
//                         _provinceName = data[i].ProvinceName;
//                     str += '<option value="' + _provinceCode + '">' + _provinceName + '</option>';
//                 }
//                 document.getElementById("address_select").innerHTML = str;

//                 //千人千面地域范围
//                  var areaList = document.getElementById("areaList");//获取千人千面 地域范围div
//                 var cityLen = data.length;

//                 for (var j = 0; j < cityLen; j++) {
//                     //将后缀去掉
//                     _provinceName = data[j].ProvinceName;
//                     var _provinceCode = data[j].ProvinceCode;

//                     if (_provinceName.indexOf("市") > 0) {
//                         cityName = _provinceName.replace("市", "");
//                     }
//                     if (_provinceName.indexOf("省") > 0) {
//                         cityName = _provinceName.replace("省", "");
//                     }
//                     if (_provinceName.indexOf("壮族自治区") > 0) {
//                         cityName = _provinceName.replace("壮族自治区", "");
//                     }
//                     if (_provinceName.indexOf("回族自治区") > 0) {
//                         cityName = _provinceName.replace("回族自治区", "");
//                     }
//                     if (_provinceName.indexOf("自治区") > 0 && _provinceCode == "540000000000") {
//                         cityName = _provinceName.replace("西藏自治区", "西藏");
//                     }
//                     if (_provinceName.indexOf("自治区") > 0 && _provinceCode == "150000000000") {
//                         cityName = _provinceName.replace("内蒙古自治区", "内蒙古");
//                     } if (_provinceName.indexOf("维吾尔自治区") > 0) {
//                         cityName = _provinceName.replace("维吾尔自治区", "");
//                     }
//                     cityStr += '<label class="classLabel"><input type = "checkbox" name = "city" value = "' + _provinceName + '" />' + cityName + '</label >';

// 			}else if(res.rCode=="0001"||res.rCode=="0002"){
// 				// tipBoxJ.msg({title:res.msg,time:2000,icon:2});
// 			}else{
// 				// tipBoxJ.msg({title:res.msg,time:2000,icon:2});
// 			}
// 		}
// 	},function(readyState,Status){})
// }

// //折扣与服务 
// function platformService(){
// 	var planId  = GetQueryString("PLANID");
// 	var serviceStr = "";
// 	if (planId == "taobao") {
//         serviceStr = '<label style="float: left;">折扣与服务：</label>'
//             + '<label><input type="checkbox" value="包邮" /><span class="tagSpan">包邮</span></label>'
//             + '<label><input type="checkbox" value="天猫" /><span class="tagSpan">天猫</span></label>'
//             + '<label><input type="checkbox" value="淘金币" /><span class="tagSpan">淘金币</span></label>'
//             + '<label><input type="checkbox" value="货到付款" /><span class="tagSpan">货到付款</span></label>'
//             + '<label><input type="checkbox" value="消费者保障" /><span class="tagSpan">消费者保障</span></label>'
//             + '<label><input type="checkbox" value="赠送运费险" /><span class="tagSpan">赠送运费险</span></label>'
//             + '<label><input type="checkbox" value="7+天退换货" /><span class="tagSpan">7+天退换货</span></label>'
//             + '<label><input type="checkbox" value="天猫国际" /><span class="tagSpan">天猫国际</span></label>'
//             + '<label><input type="checkbox" value="全球购" /><span class="tagSpan">全球购</span></label>'
//             + '<label><input type="checkbox" value="花呗分期" /><span class="tagSpan">花呗分期</span></label>'
//             + '<label><input type="checkbox" value="通用排序" /><span class="tagSpan">通用排序</span></label>';
//     }else if(planId=="jd") {
//         serviceStr = '<label style="float: left;">京东服务：</label>'
//             + '<label><input type="checkbox" value="京东物流" /><span class="tagSpan">京东物流</span></label>'
//             + '<label><input type="checkbox" value="货到付款" /><span class="tagSpan">货到付款</span></label>'
//             + '<label><input type="checkbox" value="PLUS专享价" /><span class="tagSpan">PLUS专享价</span></label>'
//             + '<label><input type="checkbox" value="促销" /><span class="tagSpan">促销</span></label>'
//             + '<label><input type="checkbox" value="全球购" /><span class="tagSpan">全球购</span></label>'
//             + '<label><input type="checkbox" value="配送全球" /><span class="tagSpan">配送全球</span></label>';
//     }
//     document.getElementById("disCountDiv").innerHTML = serviceStr;
// }

//打开任务类型
function openTaskType(){
	var normalCheckbox = document.getElementById("normalCheckbox");
	var txtCheckbox = document.getElementById("txtCheckbox");
	var imgCheckbox = document.getElementById("imgCheckbox");
	var addTaskIcon = document.querySelectorAll(".addMoreSearchBtn")
	if(normalCheckbox.checked){
		document.getElementById("normalEvaluationTask_ul").style.display = "block";
	}else{
		document.getElementById("normalEvaluationTask_ul").style.display = "none";
	}
	if(txtCheckbox.checked){
		document.getElementById("txtEvaluationTask_ul").style.display = "block";
		addTaskIcon[1].style.display="block";
	}else{
		document.getElementById("txtEvaluationTask_ul").style.display = "none";
		addTaskIcon[1].style.display="none";
	}
	if(imgCheckbox.checked){
		document.getElementById("imgEvaluationTask_ul").style.display = "block";
		addTaskIcon[2].style.display="block";

	}else{
		document.getElementById("imgEvaluationTask_ul").style.display = "none";
		addTaskIcon[2].style.display="none";

	}
}

//添加更多普通好评任务
function addMoreNormalTask(){
	var count = document.getElementById("normalEvaluationTask_ul").querySelectorAll("li").length+1;
	var str='<li class="searchKeyWord_li"><span style="margin-left: 15px;">搜索关键字<span class="taskNum">'+count+'</span>：</span>'
             +'<input type="text" name="KeyWords" class="KeyWordInput" /><span style="margin-left:15px;">数量：</span>'
            +'<input type="text" name="searchCount" class="searchInput" onblur="totalTaskCount()" /><button type="button" class="deleteSearchBtn" onclick="deleteNormalTask(this)">'
           +'<img src="del.png" /></button></li>';
    document.getElementById("normalEvaluationTask_ul").insertAdjacentHTML("beforeend",str);
      
}
//删除普通好评任务
function deleteNormalTask(_this){
	var count = document.getElementById("normalEvaluationTask_ul").querySelectorAll(".taskNum");
	var keyCode = Number(_this.parentNode.querySelectorAll(".taskNum")[0].innerHTML)-1;
 	for (var i = keyCode; i < count.length; i++) {
        count[i].innerHTML = i + 1;
    }
    document.getElementById("normalEvaluationTask_ul").removeChild(_this.parentNode);
}

//添加更多文字好评任务
function addMoreTxtTask(){
	var count =document.getElementById("txtEvaluationTask_ul").querySelectorAll("li").length+1;
	var str='<li class="searchKeyWord_li"><span style="margin-left: 15px;">搜索关键字<span class="taskNum">'+count+'</span>：</span>'
           +'<input type="text" name="KeyWords" class="KeyWordInput" /><span style="margin-left: 15px;">数量：</span>'
           +'<input type="text" name="searchCount" class="searchInput" disabled value="1" />'
           +'<button type="button" class="deleteSearchBtn" onclick="deleteTxtTask(this)"><img src="del.png" /></button>'
           +'<div style="margin:15px;"><label class="floatLabel">文字好评内容：</label>'
           +'<textarea class="txtEvaluationMsg" maxlength="200"></textarea></div></li>';
    document.getElementById("txtEvaluationTask_ul").insertAdjacentHTML("beforeend",str);
}
//删除文字好评任务
function deleteTxtTask(_this){
	var count = document.getElementById("txtEvaluationTask_ul").querySelectorAll(".taskNum");
	var keyCode = Number(_this.parentNode.querySelectorAll(".taskNum")[0].innerHTML)-1;
 	for (var i = keyCode; i < count.length; i++) {
        count[i].innerHTML = i + 1;
    }
    document.getElementById("txtEvaluationTask_ul").removeChild(_this.parentNode);
}
//添加更多图文好评任务
function addMoreImgTask(){
	var count =document.getElementById("imgEvaluationTask_ul").querySelectorAll("li").length+1;
	var str='<li class="searchKeyWord_li"><span style="margin-left:15px;">搜索关键字<span class="taskNum">'+count+'</span>：</span>'
            +'<input type="text" name="KeyWords" class="KeyWordInput" /><span style="margin-left:15px;">数量：</span>'
            +'<input type="text" name="searchCount" class="searchInput" disabled value="1" /><button type="button" class="deleteSearchBtn" onclick="deleteImgTask(this)">'
            +'<img src="del.png" /></button><div style="margin:15px;"><label class="floatLabel">上传图片：</label>'
            +'<div class="taskImg"><div class="imgBackNull"><img src="null.jpg" class="imgUploadStyle" /></div>'
            +'<div class="addImgBtn"><span class="addImgSpan">+</span><input type="file" class="addImg" id="" data-id="imgList" accept="image/gif,image/jpeg,image/png,image/bmp" />'
            +'</div></div></div><div style="margin:15px;margin-bottom: 0px;"><label class="floatLabel">文字好评内容：</label>'
            +'<textarea class="txtEvaluationMsg" maxlength="200"></textarea></div></li>';
    document.getElementById("imgEvaluationTask_ul").insertAdjacentHTML("beforeend",str);       
}
//删除图文好评任务
function deleteImgTask(_this){
	var count = document.getElementById("imgEvaluationTask_ul").querySelectorAll(".taskNum");
	var keyCode = Number(_this.parentNode.querySelectorAll(".taskNum")[0].innerHTML)-1;
 	for (var i = keyCode; i < count.length; i++) {
        count[i].innerHTML = i + 1;
    }
    document.getElementById("imgEvaluationTask_ul").removeChild(_this.parentNode);
}

//切换推送方式
function togglePushWay(){
	var pushCheckBox = document.querySelectorAll("input[name=pushWay]");
	if(pushCheckBox[1].checked){
		document.getElementById("pointTime_ul").style.display="block";
	}else{
		document.getElementById("pointTime_ul").style.display="none";
	}

}
//增加推送时间点
function addMorePushTime(){
	var str ='<li class="pointTime_li"><div class="pushTimeBlock"><div><label>时间点：</label>'
            +'<input type="text" name="pushTime" class="pushInput" oninput="checkPushTime(this)" /></div><div><label>数量：</label>'
            +'<input type="text" name="pushCount" class="pushInput" /></div>'
            +'<button type="button" class="deleteSearchBtn" onclick="deletePushTime(this)">'
            +'<img src="del.png" /></button></div></li>';
    document.getElementById("pointTime_ul").insertAdjacentHTML("beforeend",str);
}
//删除推送时间点
function deletePushTime(_this){
	document.getElementById("pointTime_ul").removeChild(_this.parentNode.parentNode);
}
//输入推送时间点的验证
function checkPushTime(_this){
	if (parseInt(_this.value) == _this.value && parseInt(_this.value) >= 0 && parseInt(_this.value) <= 23) {
        return true
    } else {
        // tipBoxJ.msg({
        //     title: "请输入正确的时间格式",
        //     time: 1000,
        //     icon: 2
        // })
        _this.value = "";
    }
}
//赏金输入限制
function rewardInputLimit(_this) {
    var val = Number(_this.value);
    if (val < 1 || val > 50) {
        // tipBoxJ.msg({
        //     title: "请输入1-50之间的数字",
        //     time: 1000,
        //     icon: 2
        // })
        _this.value = "";
    } else {
        var reg = new RegExp(/^\d{1,2}(\.\d)?$/);
        if (reg.test(val)) {
            _this.value = _this.value.replace(/^0*/g, '')
            return true;
        } else {
            _this.value = "";
            return false;
        }
    }
}
//千人千面列表显示与隐藏  先根据平台号判断是那个
function openOtherSet(){
	var plan_id = GetQueryString("PLANID");//平台类型
	var otherSet_ul=document.getElementById("otherSet_ul");//千人千面ul
	var arrowIcon=document.getElementById("arrowIcon");//箭头
	if(otherSet_ul.style.display=="none"){//默认关闭
		 var data = {
            PlanID: plan_id
        };
        // tipBoxJ.loadNew();
        SubmitData("/api/server/getIncrementService", "POST", data, false, function (e) {
        	 // tipBoxJ.closeNew();
        	if(e!==null){
        		var res = JSON.parse(e);
        		var otherStr = '';
        		console.log(res)
                otherSetList.style.display = "block";
                arrowIcon.style.webkitTransform = 'rotate(90deg)';
                arrowIcon.style.mozTransform = 'rotate(90deg)';
                arrowIcon.style.msTransform = 'rotate(90deg)';
                arrowIcon.style.oTransform = 'rotate(90deg)';
                arrowIcon.style.transform = 'rotate(90deg)';
                if(res.rCode=="0000"){
                	cityStr="";
                	var data = res.rData.IncrementServices;
                	console.log(data)
                	var otherLen  = data.length;
                	for (var i = 0; i < otherLen; i++) {
                		if(data[i].ServiceType==0){//花呗
                			otherStr+='<li><label><input type="checkbox" value="'+data[i].ServiceID+'" id="'+data[i].ServiceID+'" /><span class="tagSpan">'+data[i].ServiceName+'</span>'
                       				+'</label><span class="commonTip">（'+data[i].Description+',+2金/单）</span></li>'
                		}else if(data[i].ServiceType==1){//年龄
                			var ageStr = "";
                			var ageArr = data[i].ServiceKeys.split(";");
                			for (var i = 0; i < ageArr.length; i++) {
                				ageStr+='<label class="ageLabel"><input type="radio" name="age" value="'+ageArr[i]+'" checked onclick="openAgeList(this)"/>'+ageArr[i]+'</label>';
                			}
                			otherStr+=' <label><input type="checkbox" value="'+data[i].ServiceID+'" id="'+data[i].ServiceID+'"/>'
                            +'<span class="tagSpan">'+data[i].ServiceName+'</span></label><span class="commonTip">（'+data[i].Description+',+0.5金/单）</span>'
                        	+'<div id="ageList" style="display:none;">'+ageStr+'</div></li>';
                		}else if(data[i].ServiceType==2){//类目
                			var classStr="";
                			var classArr=data[i].ServiceKeys.split(";");
                			for (var i = 0; i < classArr.length; i++) {
                				classStr +='<label class="classLabel"><input type="checkbox"  name="Category" onclick="openClassList(this)" value="'+classArr[i]+'" />'+classArr[i]+'</label>';
                			}
                			otherStr+='<li><label><input type="checkbox" value="'+data[i].ServiceID+'" id="'+data[i].ServiceID+'"/>'
                            +'<span class="tagSpan">'+data[i].ServiceName+'</span></label><span class="commonTip">（'+data[i].Description+'+0.5金/单）</span>'
                            +'<div id="classList" style="display:none;"> '+classStr+'</div></li>'
                		}
                	}
                	//性别
                	var sexStr ='<li><label><input type="checkbox" onclick="openSexList(this)" /><span class="tagSpan">性别</span></label>'
                        +'<span class="commonTip">（限制性别，+1金/单）</span><div id="sexList" style="display:none;"><label class="ageLabel">'
                        +'<input type="radio" name="sex" value="男" checked />男</label><label class="ageLabel">'
                        +'<input type="radio" name="sex" value="女" />女</label></div></li>';
                        otherStr+=sexStr;
                    //买号等级
                    if(plan_id=="taobao"){
                    	otherStr +='<li><label><input type="checkbox" /><span class="tagSpan">买号等级</span></label>'
                                 +'<span class="commonTip">（钻石以上等级可接该任务,+1金/单）</span></li>';
                    } else{
                    	otherStr +='<li><label><input type="checkbox" /><span class="tagSpan">买号等级</span></label>'
                                 +'<span class="commonTip">（金牌会员以上等级可接该任务,+1金/单）</span></li>';
                    }
                    //地域范围
                    // getProvince();
                    var areaStr='<li><label><input type="checkbox" onclick="openAreaList(this)" /><span class="tagSpan">地域范围</span></label>'
                        +'<span class="commonTip">（勾选后可接该任务,+1金/单）</span><div id="areaList" style="display:none;">'+cityStr+'</div></li>';
                	otherStr+=areaStr;
                	document.getElementById("otherSet_ul").innerHTML = otherStr;
                	cityStr="";
                }else if(res.rCode=="0002"||res.rCode=="0001"){
                	// tipBoxJ.msg({title:res.msg,time:2000,icon:2});
                }else{
                	// tipBoxJ.msg({title:res.msg,time:2000,icon:2});
                }
        	}
        },function(readyState,Status){})
	}else{
		otherSetList.style.display = "none";
        otherSetList.innerHTML = "";
        arrowIcon.style.webkitTransform = 'rotate(0deg)';
        arrowIcon.style.mozTransform = 'rotate(0deg)';
        arrowIcon.style.msTransform = 'rotate(0deg)';
        arrowIcon.style.oTransform = 'rotate(0deg)';
        arrowIcon.style.transform = 'rotate(0deg)';
	}
}
//打开类目选项
function openClassList(_this){
	if(_this.checked){
		document.getElementById("classList").style.display="block";
	}else{
		document.getElementById("classList").style.display="none";
	}
}
//打开年龄选项
function openAgeList(_this){
	if(_this.checked){
		document.getElementById("ageList").style.display="block";
	}else{
		document.getElementById("ageList").style.display="none";
	}
}
//打开性别选项
function openSexList(_this){
	if(_this.checked){
		document.getElementById("sexList").style.display="block";
	}else{
		document.getElementById("sexList").style.display="none";
	}
}
//打开地域范围选项
function openAreaList(_this){
	if(_this.checked){
		document.getElementById("areaList").style.display="block";
	}else{
		document.getElementById("areaList").style.display="none";
	}
}
//总任务数量
function totalTaskCount(){
    var totalCount =0;
	var count = document.querySelectorAll("input[name=searchCount]");
	for (var i = 0; i < count.length; i++) {
		 totalCount +=Number(count[i].value);
	}
    document.getElementById("allTaskCount").innerText=totalCount;
}
//商品每单总金额
function totalMoney(){
    var price = document.getElementById("goodPrice").value;
    var count = document.getElementById("goodCount").value;
    var totalMoney=Number(price*count).toFixed(2);
    if(count==0){
        document.getElementById("allMoney").innerText="0.00";
    }else{
        document.getElementById("allMoney").innerText=totalMoney;
    }
    //附加商品
}
//上一步
function goBack(){
     window.location.href = "/web/server/sCreateTask.aspx";
}
//判断必填项
function isRequire(){
    var goodName=document.getElementById("goodName").value;
    var goodUrl=document.getElementById("goodUrl").value;
    var goodPrice=document.getElementById("goodPrice").value;
    var goodCount=document.getElementById("goodCount").value;
    var displayPrice=document.getElementById("displayPrice").value;
    var goodPostage=document.getElementById("goodPostage").value;
    var skuValue=document.getElementById("skuValue").value;
    var imgBackNull = document.getElementById("imgBackNull");
    if(goodName==""||godName==null){
        tipBoxJ.msg({title:"请填写商品名称",time:2000,icon:2});
        return false;
    }
    if(goodUrl==""||goodUrl==null){
        tipBoxJ.msg({title:"请填写商品链接",time:2000,icon:2});
        return false;
    }
    if(goodPrice==""||goodPrice==null){
        tipBoxJ.msg({title:"请填写商品名称",time:2000,icon:2});
        return false;
    }
    if(goodCount==""||goodCount==null){
        tipBoxJ.msg({title:"请填写商品名称",time:2000,icon:2});
        return false;
    }
    if(displayPrice==""||displayPrice==null){
        tipBoxJ.msg({title:"请填写商品名称",time:2000,icon:2});
        return false;
    }
    if(goodPostage==""||goodPostage==null){
        tipBoxJ.msg({title:"请填写商品名称",time:2000,icon:2});
        return false;
    }
    if(goodName==""||godName==null){
        tipBoxJ.msg({title:"请填写商品名称",time:2000,icon:2});
        return false;
    }
    //商品主图必须上传一张
    if (imgBackNull) {
        tipBoxJ.msg({ title: "请至少上传一张商品主图", time: 1000, icon: 2 });
        window.location.href = "#editTaskInfo";
        return false
    }

}
//跳转到支付页面
function goToPayment(){

}
document.ready=function(){

}
