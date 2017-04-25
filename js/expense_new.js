var columnIndex = 1;
var oldList = new Array();
var newList = new Array();
var number = '';

$(document).ready(function () {
    freshMyPage();

    var today = new Date();
    $("#expenseTime").text(today.getFullYear() + "年" + (today.getMonth()+1) + "月" + today.getDate() + "日");
    addColumn();
    //$("#expenseName").text($("#name").text());
    //$("#expenseUid").text($("#uid").text());
    //$("#expenseDepartment").text($("#department").text());
    //$("#expenseTitle").text($("#title").text());

    //恢复草稿内容

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
$("#btnAddExpenseAccount").click(addColumn);

function addColumn(){
    var newColume = $("#trNewExpenseAccount_0").clone().attr('id', 'trNewExpenseAccount_' + columnIndex);
    columnIndex += 1;
    newColume.find(".expenseAmount").val("0");
    newColume.find(".expenseDate").val("");
    newColume.find(".expenseAttachment").val("");
    newColume.find(".expenseRemark").val("");

    newColume.appendTo("#tbodyNewExpenseAccount").removeClass('hidden');

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
}

//删除一行
function removeColumn(ele){
    $(ele).parent().parent().remove();
}


$("#btnSubmitExpenseAccount").click(function(){
    if (error != 0)
    {
        $("#expenseTip").text("输入有误！请更正后重新提交。");
    }
    else
    {
        $(this).attr("disabled", "disabled");

        newList = new Array();
        $("#tbodyNewExpenseAccount").children().each(function(){
            if (!$(this).hasClass('hidden')){
                var expenseAmount = $(this).find(".expenseAmount").val() === ''? 0 : $(this).find(".expenseAmount").val();
                var expenseType = $(this).find(".expenseType").val();
                var expenseDate = $(this).find(".expenseDate").val() === ''? '0000-00-00' : $(this).find(".expenseDate").val();
                var expenseAttachment = $(this).find(".expenseAttachment").val() === ''? 0 : $(this).find(".expenseAttachment").val();
                var expenseRemark = $(this).find(".expenseRemark").val();
                var expenseSite = $(this).find(".expenseSite").val();
                newList.push({'type_id' : expenseType, 'date' : expenseDate, 'site' : expenseSite, 'amount' : expenseAmount, 'attachment' : expenseAttachment, 'remark' : expenseRemark});
            }
        });

        $.ajax({
            url : "../../php/submitExpenseAccount.php",
            type : "POST",
            cache : false,
            data : {'expenseList' : JSON.stringify(newList)},
            async : false,
            dataType : 'json',
            //processData : false,  // 告诉jQuery不要去处理发送的数据
            //contentType : false,   // 告诉jQuery不要去设置Content-Type请求头
            success : function(data){
                if(data == "0")
                {
                    alert("提交成功!");
                    window.location.href = 'expense_history.html';
                }
                else
                {
                    alert("提交失败，请重试...");
                }

            }
        });
    }


});

//打印





//保存草稿
$("#btnSaveDraft").click(function(){
    if (error != 0)
    {
        $("#expenseTip").text("输入有误！请更正后重新提交。");
    }
    else
    {
        $(this).attr("disabled", "disabled");

        newList = new Array();
        $("#tbodyNewExpenseAccount").children().each(function(){
            if (!$(this).hasClass('hidden')){
                var expenseAmount = $(this).find(".expenseAmount").val() === ''? 0 : $(this).find(".expenseAmount").val();
                var expenseType = $(this).find(".expenseType").val();
                var expenseDate = $(this).find(".expenseDate").val() === ''? '0000-00-00' : $(this).find(".expenseDate").val();
                var expenseAttachment = $(this).find(".expenseAttachment").val() === ''? 0 : $(this).find(".expenseAttachment").val();
                var expenseRemark = $(this).find(".expenseRemark").val();
                var expenseSite = $(this).find(".expenseSite").val();
                newList.push({'type_id' : expenseType, 'date' : expenseDate, 'site' : expenseSite, 'amount' : expenseAmount, 'attachment' : expenseAttachment, 'remark' : expenseRemark});
            }
        });

        $.ajax({
            url : "../../php/expenseSaveDraft.php",
            type : "POST",
            cache : false,
            data : {'expenseList' : JSON.stringify(newList)},
            async : false,
            dataType : 'json',
            success : function(data){
                if(data.state == "ok")
                {
                    alert("保存成功!");
                    number = data.number;
                    switchMode();
                }
                else
                {
                    alert("保存失败，请重试...");
                }

            }
        });
    }
});

//将页面调整为可多次保存的编辑草稿模式
function switchMode(){

    oldList = newList.concat();

    //修改提交和保存两个按钮的绑定事件
    $("#btnSaveDraft").unbind('click').click(function () {
        if (error != 0)
        {
            $("#expenseTip").text("输入有误！请更正后重新提交。");
        }
        else
        {
            $(this).attr("disabled", "disabled");

            newList = [];
            $("#tbodyNewExpenseAccount").children().each(function(){
                if (!$(this).hasClass('hidden')){
                    var expenseAmount = $(this).find(".expenseAmount").val() === ''? 0 : $(this).find(".expenseAmount").val();
                    var expenseType = $(this).find(".expenseType").val();
                    var expenseDate = $(this).find(".expenseDate").val() === ''? '0000-00-00' : $(this).find(".expenseDate").val();
                    var expenseAttachment = $(this).find(".expenseAttachment").val() === ''? 0 : $(this).find(".expenseAttachment").val();
                    var expenseRemark = $(this).find(".expenseRemark").val();
                    var expenseSite = $(this).find(".expenseSite").val();
                    newList.push({'type_id' : expenseType, 'date' : expenseDate, 'site' : expenseSite, 'amount' : expenseAmount, 'attachment' : expenseAttachment, 'remark' : expenseRemark});
                }
            });

            if(JSON.stringify(oldList) == JSON.stringify(newList)){
                alertMsg("信息未修改", 'danger');
            }else{
                //比较
                var editList = [];
                var addList = [];
                var deleteList = [];

                for (var i = 0; i < (oldList.length > newList.length? oldList.length: newList.length); i++){
                    if (i >= oldList.length){
                        //新增项
                        addList.push(newList[i]);

                    }else if (i >= newList.length){
                        //删除项
                        deleteList.push(oldList[i]);

                    }else{
                        //修改项
                        if (JSON.stringify(newList[i]) != JSON.stringify(oldList[i])){
                            editList.push({'item': oldList[i], '_item': newList[i]});
                        }
                    }
                }

                $.ajax({
                    url: "../../php/expense_edit_item.php",
                    type: "POST",
                    data: {
                        expenseID : number,
                        delete : JSON.stringify(deleteList),
                        edit : JSON.stringify(editList),
                        add : JSON.stringify(addList)
                    },
                    success: function(data){
                        if (data === "0"){
                            alertMsg("修改成功", "success");
                            $("#btnSaveDraft").removeAttr("disabled");
                            oldList = newList.concat();
                        }
                        else{
                            alertMsg("保存失败", "danger");
                        }
                    }
                });
            }


        }

    }).removeAttr('disabled');

    $("#btnSubmitExpenseAccount").unbind('click').click(function () {
        if (error != 0)
        {
            $("#expenseTip").text("输入有误！请更正后重新提交。");
        }

        else
        {
            $(this).attr("disabled", "disabled");

            newList = new Array();
            $("#tbodyNewExpenseAccount").children().each(function(){
                if (!$(this).hasClass('hidden')){
                    var expenseAmount = $(this).find(".expenseAmount").val() === ''? 0 : $(this).find(".expenseAmount").val();
                    var expenseType = $(this).find(".expenseType").val();
                    var expenseDate = $(this).find(".expenseDate").val() === ''? '0000-00-00' : $(this).find(".expenseDate").val();
                    var expenseAttachment = $(this).find(".expenseAttachment").val() === ''? 0 : $(this).find(".expenseAttachment").val();
                    var expenseRemark = $(this).find(".expenseRemark").val();
                    var expenseSite = $(this).find(".expenseSite").val();
                    newList.push({'type_id' : expenseType, 'date' : expenseDate, 'site' : expenseSite, 'amount' : expenseAmount, 'attachment' : expenseAttachment, 'remark' : expenseRemark});
                }
            });

            if(JSON.stringify(oldList) != JSON.stringify(newList)){
                $("#expenseTip").text("信息有更改，如需保留请点击保存按钮后再行提交。");
            }else{
                $.ajax({
                    url : "../../php/expenseSaveDraft.php",
                    type : "POST",
                    cache : false,
                    data : {'submit': true, 'expenseID': number},
                    async : false,
                    dataType : 'json',
                    success : function(data){
                        if(data == "0")
                        {
                            alertMsg("提交成功!", "success");
                            window.location.href = 'expense_history.html';
                        }
                        else
                        {
                            alertMsg("提交失败，请重试...", "warning");
                        }
                    }
                });
            }
        }
    });


}