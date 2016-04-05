/**
 * Created by wx_h0001 on 2015/12/26.
 */

//页面初始化
$(document).ready(function () {
    freshMyPage();


    var today = new Date();
    $("#leaveNoteTime").text(today.getFullYear() + "年" + (today.getMonth()+1) + "月" + today.getDate() + "日");
    $("#leaveNoteName").text($("#name").text());
    $("#leaveNoteUid").text($("#uid").text());
    $("#leaveNoteDepartment").text($("#department").text());
    $("#leaveNoteTitle").text($("#title").text());
});

//var startDateChange = 0;
//var endDateChange = 0;
var leaveRemainer = 0;
$("#startTime").change(function () {
    if (($("#startTime").val() != "") && ($("#endTime").val() != "")){
        showLeaveNoteTip();
        if (!$("#leaveRemaindTip").is(":hidden"))
        {
            showLeaveRemainTip();
        }
    }
});

$("#endTime").change(function () {
    if (($("#startTime").val() != "") && ($("#endTime").val() != "")){
        showLeaveNoteTip();
        if (!$("#leaveRemaindTip").is(":hidden"))
        {
            showLeaveRemainTip();
        }

    }
});

//年休假提示业务
$("#reason").change(function () {
    if ($("#reason").val() == "年休假")
    {
        $.ajax({
            url: "../../php/leaveRemaind.php",
            success: function(data){
                if (data >= 0)
                {
                    leaveRemainer = data;
                }
                else
                {
                    $("#leaveRemaindTip").text("提示错误，请与管理员联系");
                }
                if (($("#startTime").val() != "") && ($("#endTime").val() != "")){
                    showLeaveRemainTip();
                }

            }
        });
    }
    else
    {
        if($("#leaveRemaindTip").text() != "")
        {
            $("#leaveRemaindTip").text("");
            $("#overstep").hide();
        }
    }
});

function showLeaveRemainTip(){
    $("#leaveRemaindTip").text("提示：您的年休假余额为 " + leaveRemainer + " 天");
    if ($("#leaveNoteTip").find("span:eq(0)").text() > leaveRemainer)
    {
        $("#overstep").show();
    }
    else
    {
        $("#overstep").hide();
    }

}

function showLeaveNoteTip(){
    var startDate =new Date($("#startTime").val().split("-"));
    var endDate = new Date($("#endTime").val().split("-"));
    var cc = (endDate - startDate)/(24 * 60 * 60 * 1000);
    if(cc <= 0){
        $("#leaveNoteTip").text("结束日期必须大于开始日期！")
    }
    else{

        $("#leaveNoteTip").find("span:eq(0)").text(cc);
    }
    $("#leaveNoteTip").show();
}

//点击“新建请假单”中的“提交”按钮，提交请假单
$("#btnSubmitLeave").click(function(){
    // alert($("#formLeave").serialize());
    var form_date = new FormData(document.getElementById("formLeave"));

    $.ajax({
        url : "../../php/submitLeave.php",
        type : "POST",
        cache : false,
        data : form_date ,
        async : false,
        processData : false,  // 告诉jQuery不要去处理发送的数据
        contentType : false,   // 告诉jQuery不要去设置Content-Type请求头
        success : function(data){
            if(data == "0")
            {
                alert("提交成功!");
                $("#guide a[href='#leave_history']").tab("show");
            }
            else
            {
                alert("提交失败，请重试...");
            }

        }
    })
});


//datetimepicker部件的设置
$('.form_date').datetimepicker({
    weekStart: 1,
    todayBtn: 1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    minView: 2,
    forceParse: 0
});


//$(".form_date").datetimepicker({
//    weekStart: 1,
//    todayBtn: 1,
//    autoclose: 1,
//    todayHighlight: 1,
//    startView:2,
//    minView: 2,
//    forceParse: 0
//});
