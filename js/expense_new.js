/**
 * Created by wx_h0001 on 2015/12/26.
 */

$(document).ready(function () {
    freshMyPage();

    var today = new Date();
    $("#expenseTime").text(today.getFullYear() + "年" + (today.getMonth()+1) + "月" + today.getDate() + "日");
    $("#expenseName").text($("#name").text());
    $("#expenseUid").text($("#uid").text());
    $("#expenseDepartment").text($("#department").text());
    $("#expenseTitle").text($("#title").text());
})

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


var column = 1;     //报销单的行数

//检查输入是否符合规范
$("#expenseAmount").blur(function (){
    var value = $(this).val();
    //alert(value);
    if (!isNaN(value) && value >= 0){
        //alert("YES");
        $("#expenseAmountTip").text("");
        $(this).val((Math.round(value * 100) / 100).toFixed(2));
    }
    else {
        //alert("NO");
        $("#expenseAmountTip").text("请正确输入金额数字！");
        $(this).focus().select();
    }
})

//添加一行报销单
$("#btnAddExpenseAccount").click(function () {
    var newColume = $("#trNewExpenseAccount_0").clone().attr('id', 'trNewExpenseAccount_' + column);
    newColume.find("#expenseAmount").val("");
    newColume.find("#expenseDate").val("");
    newColume.find("#expenseAttachment").val("");
    newColume.find("#expenseRemark").val("");

    $("#tbodyNewExpenseAccount").append(newColume);
    ++column;
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

})


$("#btnSubmitExpenseAccount").click(function(){
    //处理数据
    var expenseList = new Array();
    var expenseAccount = $("#trNewExpenseAccount_0").find("#expenseAmount").val();
    var expenseType = $("#trNewExpenseAccount_0").find("#expenseType").val();
    var expenseDate = $("#trNewExpenseAccount_0").find("#expenseDate").val();
    var expenseAttachment = $("#trNewExpenseAccount_0").find("#expenseAttachment").val();
    var expenseRemark = $("#trNewExpenseAccount_0").find("#expenseRemark").val();

    if (expenseAccount == 0){
        alert("请至少填写一个有效报销单条目后提交");
    }
    else
    {
        var i = 0;
        while(expenseAccount != 0 && i < column)
        {
            expenseList[i] = {'type' : expenseType, 'date' : expenseDate, 'account' : expenseAccount, 'attachment' : expenseAttachment, 'remark' : expenseRemark};
            ++i;
            var expenseAccount = $("#trNewExpenseAccount_" + i).find("#expenseAmount").val();
            var expenseType = $("#trNewExpenseAccount_" + i).find("#expenseType").val();
            var expenseDate = $("#trNewExpenseAccount_" + i).find("#expenseDate").val();
            var expenseAttachment = $("#trNewExpenseAccount_" + i).find("#expenseAttachment").val();
            var expenseRemark = $("#trNewExpenseAccount_" + i).find("#expenseRemark").val();
        }

        alert(expenseList);

        $.ajax({
            url : "../../php/submitExpenseAccount.php",
            type : "POST",
            cache : false,
            data : expenseList,
            async : false,
            dataType : 'json',
            //processData : false,  // 告诉jQuery不要去处理发送的数据
            //contentType : false,   // 告诉jQuery不要去设置Content-Type请求头
            success : function(data){
                if(data == "0")
                {
                    alert("提交成功!");
                }
                else
                {
                    alert("提交失败，请重试...");
                }

            }
        })
    }

})