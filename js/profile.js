/**
 * Created by hopoo on 2016/3/27.
 */

$(document).ready(function () {
   freshMyPage();
});
//点击“修改个人资料”按钮，显示修改信息界面
$("#btnAlterMsg").click(function(){

    var tele = $("#divTele").text();
    var email = $("#divEmail").text();
    $("#divTele").html("<input type='text' id='inputTele'  class='form-control' value='" + tele + "'>");
    $("#divEmail").html("<input type='text' id='inputEmail'  class='form-control' value='" + email + "'>");
    (function(element){
        var height = element.height();
        var width = element.width();
        element.height(height);
        element.width(width);
    })($("#msgBoxFoot"));
    $("#divDefaultButtons").fadeOut();
    setTimeout(function(){
        $("#divAlertMsgButtons").fadeIn();
    }, 500)

});

//修改完成后点击“保存”按钮，保存并提交资料的修改
$("#btnSaveAlterMsg").click(function(){
    var newTele = $("#inputTele").val();
    var newEmail = $("#inputEmail").val();
    var newAvatar = $("#imgAlertAvatar").attr("src");
    var base64_reg = new RegExp("^data:.*;base64");
    if(!base64_reg.test(newAvatar)){
        newAvatar = null;
    }
    $.ajax({
        url : "/" + projectName + "/php/updatemyinfo.php",
        type : "POST",
        cache : false,
        data : {'newTele': newTele, 'newEmail': newEmail, 'newAvatar': newAvatar},
        //async : false,
        success : function(data){
            if (data == "0") {
                alertMsg("保存成功！", "success");
            }
            else
            {
                alertMsg("头像保存失败，请重试...", "warning");
            }

            window.location.reload();
        }
    })
});

//修改时点击“取消”按钮
$("#btnAlertCancel").click(function(){
    window.location.reload();
});

//修改头像功能模块
$(window).load(function() {
    var options =
    {
        thumbBox: '.thumbBox',
        spinner: '.spinner',
        imgSrc: '/platformsystem/img/easy.jpg'
    }
    var cropper = $('.imageBox').cropbox(options);
    $('#inputImg').on('change', function(){
        var reader = new FileReader();
        reader.onload = function(e) {
            options.imgSrc = e.target.result;
            cropper = $('.imageBox').cropbox(options);
        }
        reader.readAsDataURL(this.files[0]);
        this.files = [];
    })
    $('#btnCrop').on('click', function(){
        var img = cropper.getDataURL();
        $("#imgAlertAvatar").attr('src', img);
        $("#inputAvatar").val(img);
        //$('.cropped').html('');
//            $('.cropped').append('<img src="'+img+'" align="absmiddle" style="width:64px;margin-top:4px;border-radius:64px;box-shadow:0px 0px 12px #7E7E7E;" ><p>64px*64px</p>');
//        $('.cropped').append('<img src="'+img+'" align="absmiddle" style="width:128px;margin-top:4px;border-radius:128px;box-shadow:0px 0px 12px #7E7E7E;">');
//            $('.cropped').append('<img src="'+img+'" align="absmiddle" style="width:180px;margin-top:4px;border-radius:180px;box-shadow:0px 0px 12px #7E7E7E;"><p>180px*180px</p>');
    })
    $('#btnZoomIn').on('click', function(){
        cropper.zoomIn();
    })
    $('#btnZoomOut').on('click', function(){
        cropper.zoomOut();
    })
});