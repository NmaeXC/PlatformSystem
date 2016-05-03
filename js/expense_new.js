/**
 * Created by wx_h0001 on 2015/12/26.
 */

$(document).ready(function () {
    freshMyPage();

    var today = new Date();
    $("#expenseTime").text(today.getFullYear() + "年" + (today.getMonth()+1) + "月" + today.getDate() + "日");
    //$("#expenseName").text($("#name").text());
    //$("#expenseUid").text($("#uid").text());
    //$("#expenseDepartment").text($("#department").text());
    //$("#expenseTitle").text($("#title").text());

    //恢复草稿内容

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
var error = 0;      //标记是否有输入错误
function amountCheak(element){
    var value = $(element).val();
    var tip = $(element).parent().find("small");
    if(!isNaN(value) && value >= 0)
    {
        $(element).val((Math.round(value * 100) / 100).toFixed(2));
        if (tip.text() != "")
        {
            tip.text("");
            --error;
        }
    }
    else
    {
        if (tip.text() == "")
        {
            tip.text("请正确输入金额数字！");
            ++error;
        }
    }

}

function attachmentCheak(element){
    var value = $(element).val();
    var tip = $(element).parent().find("small");
    if(!isNaN(value) && value >= 0)
    {
        if (tip.text() != "")
        {
            tip.text("");
            --error;
        }
    }
    else
    {
        if (tip.text() == "")
        {
            tip.text("请正确输入附件个数!(大于等于0)");
            ++error;
        }
    }
}

function amountTip(){
    var sum = new Number(0);
    $(".expenseAmount").each(function () {
        sum += new Number($(this).val());
    });
    if(!isNaN(sum))
    {
        $("#sumOfAmount").text(sum.toFixed(2));
    }
    else
    {
        $("#sumOfAmount").text("等待修改...");
    }

}

//添加一行报销单
$("#btnAddExpenseAccount").click(function () {
    var newColume = $("#trNewExpenseAccount_0").clone().attr('id', 'trNewExpenseAccount_' + column);
    newColume.find(".expenseAmount").val("0");
    newColume.find(".expenseDate").val("");
    newColume.find(".expenseAttachment").val("");
    newColume.find(".expenseRemark").val("");

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

    if (error != 0)
    {
        $("#expenseTip").text("输入有误！请更正后重新提交。");
    }
    else
    {
        //处理数据
        var expenseList = new Array();
        var expenseAmount = $("#trNewExpenseAccount_0").find(".expenseAmount").val();
        var expenseType = $("#trNewExpenseAccount_0").find(".expenseType").val();
        var expenseDate = $("#trNewExpenseAccount_0").find(".expenseDate").val();
        var expenseAttachment = $("#trNewExpenseAccount_0").find(".expenseAttachment").val();
        var expenseRemark = $("#trNewExpenseAccount_0").find(".expenseRemark").val();
        var expenseSite = $("#trNewExpenseAccount_0").find(".expenseSite").val();

        if (expenseAmount == 0){
            alert("请至少填写一个有效报销单条目后提交");
        }
        else
        {
            var i = 0;
            while(expenseAmount != 0 && i < column)
            {
                expenseList[i] = {'type' : expenseType, 'date' : expenseDate, 'site' : expenseSite, 'amount' : expenseAmount, 'attachment' : expenseAttachment, 'remark' : expenseRemark};
                ++i;
                var expenseAmount = $("#trNewExpenseAccount_" + i).find(".expenseAmount").val();
                var expenseType = $("#trNewExpenseAccount_" + i).find(".expenseType").val();
                var expenseDate = $("#trNewExpenseAccount_" + i).find(".expenseDate").val();
                var expenseAttachment = $("#trNewExpenseAccount_" + i).find(".expenseAttachment").val();
                var expenseRemark = $("#trNewExpenseAccount_" + i).find(".expenseRemark").val();
                var expenseSite = $("#trNewExpenseAccount_" + i).find(".expenseSite").val();
            }

            //for (var a in expenseList)
            //{
            //    for(var b in expenseList[a])
            //    {
            //        alert(expenseList[a][b]);
            //    }
            //}

            $.ajax({
                url : "../../php/submitExpenseAccount.php",
                type : "POST",
                cache : false,
                data : {'expenseList' : JSON.stringify(expenseList)},
                async : false,
                dataType : 'json',
                //processData : false,  // 告诉jQuery不要去处理发送的数据
                //contentType : false,   // 告诉jQuery不要去设置Content-Type请求头
                success : function(data){
                    if(data == "0")
                    {
                        alert("提交成功!");
                        window.location('expense_history.html');
                    }
                    else
                    {
                        alert("提交失败，请重试...");
                    }

                }
            })
        }
    }


})

//打印





//保存草稿
//$("#btnSaveDraft").click(function(){
//    if (error != 0)
//    {
//        $("#expenseTip").text("输入有误！请更正后重新保存。");
//    }
//    else
//    {
//        //处理数据
//        var expenseList = new Array();
//        var expenseAmount = $("#trNewExpenseAccount_0").find(".expenseAmount").val();
//        var expenseType = $("#trNewExpenseAccount_0").find(".expenseType").val();
//        var expenseDate = $("#trNewExpenseAccount_0").find(".expenseDate").val();
//        var expenseAttachment = $("#trNewExpenseAccount_0").find(".expenseAttachment").val();
//        var expenseRemark = $("#trNewExpenseAccount_0").find(".expenseRemark").val();
//
//        var i = 0;
//        while(i < column)
//        {
//            expenseList[i] = {'type' : expenseType, 'date' : expenseDate, 'amount' : expenseAmount, 'attachment' : expenseAttachment, 'remark' : expenseRemark};
//            ++i;
//            var expenseAmount = $("#trNewExpenseAccount_" + i).find(".expenseAmount").val();
//            var expenseType = $("#trNewExpenseAccount_" + i).find(".expenseType").val();
//            var expenseDate = $("#trNewExpenseAccount_" + i).find(".expenseDate").val();
//            var expenseAttachment = $("#trNewExpenseAccount_" + i).find(".expenseAttachment").val();
//            var expenseRemark = $("#trNewExpenseAccount_" + i).find(".expenseRemark").val();
//        }
//
//
//        $.ajax({
//            url : "../../php/expenseSaveDraft.php",
//            type : "POST",
//            cache : false,
//            data : {'expenseList' : JSON.stringify(expenseList)},
//            //async : false,
//            dataType : 'json',
//            success : function(data){
//                if(data == "0")
//                {
//                    alert("保存成功!");
//                }
//                else
//                {
//                    alert("保存失败，请重试...");
//                }
//
//            }
//        })
//
//    }
//});
