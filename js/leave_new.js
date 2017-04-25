/**
 * Created by wx_h0001 on 2015/12/26.
 */

(function(){
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
    var leaveRemainer = 0;      //剩余年休假
    var leavetime = 0;          //请求假期时间



    $("#time_interval").change(function () {
        showLeaveNoteTip();
        if (!$("#leaveRemaindTip").is(":hidden"))
        {
            showLeaveRemainTip();
        }
    });

//年休假提示
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
        $("#leaveRemaindTip").text("提示：您的年休假余额为 " + Math.floor(leaveRemainer / 8) +  " 天 " + Math.floor(leaveRemainer % 8) + " 小时");
        if (leavetime > leaveRemainer)
        {
            $("#overstep").show();
        }
        else
        {
            $("#overstep").hide();
        }

    }

    function showLeaveNoteTip(){
        var time_interval = $("#time_interval").val().split(" - ");
        var startDate =new Date(time_interval[0]);
        var endDate = new Date(time_interval[1]);
        var m1 = startDate.getHours() * 60 + startDate.getMinutes();
        var m2 = endDate.getHours() * 60 + endDate.getMinutes();
        //确定与工作时间相交的时间区间
        if (m1 <= (8 * 60 + 30)){
            m1 = 0;
        }else if (m1 >= (12 * 60) && m1 <= (13 * 60 + 30)){
            m1 = 3.5;
        }else if(m1 <= (12 * 60)){
            m1 = (m1 - (8 * 60 + 30)) / 60;
        }else if(m1 >= 18 * 60){
            m1 = 8;
        }else{
            m1 = (m1 - (8 * 60 + 30) - (1.5 * 60)) / 60;
        }

        if (m2 <= (8 * 60 + 30)){
            m2 = 0;
        }else if (m2 >= (12 * 60) && m2 <= (13 * 60 + 30)){
            m2 = 3.5;
        }else if(m2 <= (12 * 60)){
            m2 = (m2 - (8 * 60 + 30)) / 60;
        }else if(m2 >= 18 * 60){
            m2 = 8;
        }else{
            m2 = (m2 - (8 * 60 + 30) - (1.5 * 60)) / 60;
        }

        var t = (m2 - m1) < 0? (m2 - m1 + 8) : (m2 - m1);

        //if((m1 <= (12 * 60) && m1 >= (8 * 60 + 30) && m2 <= (12 * 60) && m2 >= (8 * 60 + 30)) || (m1 <= (18 * 60) && m1 >= (13 * 60 + 30) && m2 <= (18 * 60) && m2 >= (13 * 60 + 30))){
        //    var t = (m2 - m1) % (8 * 60) / 60;
        //}else{
        //    if(m1 < m2){
        //        var t = (m2 - m1 - (60 + 30)) % (8 * 60) / 60;
        //    }
        //    else {
        //        var t = (m2 - m1 + (60 + 30)) % (8 * 60) / 60;
        //    }
        //}

        var d = (endDate - startDate)/(24 * 60 * 60 * 1000);
        leavetime = parseInt(d) * 8 + t;
        if(d <= 0){
            $("#tip1").text("结束日期必须大于开始日期！")
        }
        else{

            $("#tip1").text("共计：" + parseInt(d) + "天" + t + "小时");
        }
        $("#leaveNoteTip").show();
    }

//点击“新建请假单”中的“提交”按钮，提交请假单
    $("#btnSubmitLeave").click(function(){
        //验证表单填写是否合法
        if ($("#time_interval").val() == "")
        {
            //没有填写时间区间
            alertMsg("请填写时间区间", "danger");
            $("#time_interval").focus();
        }
        else if($("#reason").val() == "")
        {
            //没有填写请假原因
            alertMsg("请填写请假原因", "danger");
            $("#reason").focus();
        }
        else if ($("#LeaveFile").val() == "")
        {
            //没有上传附加
            alertMsg("请上传附件", "danger");
            $("#LeaveFile").focus();
        }else if ($("#tip1").text() == "结束日期必须大于开始日期！")
        {
            //结束日期必须大于开始日期
            alertMsg("结束日期必须大于开始日期, 请正确填写！", "danger");
        }else if($("#overstep").css('display') != 'none')
        {
            //年休假超出限额
            alertMsg("年休假超出限额", "danger");
        }
        else
        {
            $(this).attr("disabled", "disabled");

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
                        alertMsg("提交成功!", "success");
                        window.location.href = "leave_history.html";
                    }
                    else
                    {
                        alertMsg("提交失败，请重试...", "warning");
                    }

                }
            })
        }



    });

//时间选择控件初始化
    $('#time_interval').daterangepicker({timePicker: true, timePickerIncrement: 30, format: 'YYYY-MM-DD HH:mm:ss'},null, function () {
        showLeaveNoteTip();
        if (!$("#leaveRemaindTip").is(":hidden"))
        {
            showLeaveRemainTip();
        }
    });
})();


//$(".applyBtn").click(function () {
//    showLeaveNoteTip();
//    if (!$("#leaveRemaindTip").is(":hidden"))
//    {
//        showLeaveRemainTip();
//    }
//});
//
////datetimepicker部件的设置
//$('.form_date').datetimepicker({
//    weekStart: 1,
//    todayBtn: 1,
//    autoclose: 1,
//    todayHighlight: 1,
//    startView: 2,
//    minView: 2,
//    forceParse: 0
//});


//$(".form_date").datetimepicker({
//    weekStart: 1,
//    todayBtn: 1,
//    autoclose: 1,
//    todayHighlight: 1,
//    startView:2,
//    minView: 2,
//    forceParse: 0
//});
