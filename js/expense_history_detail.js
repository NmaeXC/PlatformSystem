/**
 * Created by wx_h0001 on 2016/6/3.
 */

(function () {
    freshMyPage();

    var EditList = new Array();       //记录条目修改项信息
    var SumOfItem = 0;  //记录条目的总数

    //$('.form_date').datetimepicker({
    //    weekStart: 1,
    //    todayBtn: 1,
    //    autoclose: 1,
    //    todayHighlight: 1,
    //    startView: 2,
    //    minView: 2,
    //    forceParse: 0
    //});

    var number = getQueryString("x");
    var submitDate = getQueryString("d");
    if (number !== null)
    {
        //初始化页面
        initPage(number, submitDate);
    }
    else
    {
        console.log("No Detail Number");
    }

    function initPage(number, submitDate) {
        $.ajax({
            url: "../../php/expense_detail.php",
            type: "POST",
            dataType: "json",
            data : {'detailNumber' : number},
            success: function (data) {
                switch (data.userInfo.state){
                    case "1" :
                        //编辑中
                        $("#btnSubmit").removeClass('hidden');
                        break;
                    case "2" :
                        //待审核
                        $("#btnPrint").removeClass('hidden');
                        break;
                    case "3" :
                        //同意
                        $('#btnPrint').removeClass('hidden');
                        $("#editItem").addClass('hidden');
                        break;
                    case "4" :
                        //驳回
                        $('#btnPrint').removeClass('hidden');
                        $("#editItem").attr('disabled','disabled').attr('title', '欲重新编辑请点击下方重新编辑按钮');
                        $("#btnReedit").removeClass('hidden').click(function () {
                            $.ajax({
                                url: "../../php/expense_edit_item.php",
                                type: "POST",
                                data: {expenseID : number, action: 'reedit'}
                            }).done(function (data) {
                                if (data === '0'){
                                    window.location.reload();
                                }else{
                                    alertMsg('重新编辑申请失败，请刷新页面重新尝试或联系管理员');
                                }

                            });
                        });
                        break;
                    case "5" :
                        //已付款

                        break;
                    case "6" :
                        //已撤销

                        break;
                    default:
                        alert("报销单状态异常");
                        break;
                }

                $("#number").text(number);
                $("#submitDate").text(submitDate);
                $("#name").text(data.userInfo.name);
                $("#uid").text(data.userInfo.uid);
                $("#department").text(data.userInfo.department);
                $("#title").text(data.userInfo.title);
                //var today = new Date();
                //$("#today").text(today.getFullYear() + "年" + (today.getMonth()+1) + "月" + today.getDate() + "日");
                var sum = new Number(0);
                SumOfItem = data.item.length;
                for(var i in data.item)
                {
                    var trID = "tr" + i;
                    $("<tr>").attr('id', trID).appendTo("#tbodyExpenseItem");
                    $("<td class='hidden'>" +
                        "<a type='button' class='badge bg-light-blue'><i class='fa fa-pencil'></i></a>" +
                        "</td>")
                        .find("a").click({item : data.item[i], trID : trID}, function (e) {
                        editItem(e.data.item, e.data.trID);
                    }).end().appendTo("#" + trID);
                    $("<td class='hidden'>" +
                        "<a type='button' class='badge bg-red'><i class='fa fa-trash-o'></i></a>" +
                        "</td>")
                        .find("a").click({item : data.item[i], trID : trID}, function (e) {
                        deleteItem(e.data.item, e.data.trID);
                    }).end().appendTo("#" + trID);
                    $("<td></td>").addClass('index').text((parseInt(i) + 1) + ".").appendTo("#" + trID);
                    $("<td></td>").text(data.item[i].date).appendTo("#" + trID);
                    $("<td></td>").text(data.item[i].site).appendTo("#" + trID);
                    $("<td></td>").text(data.item[i].type).appendTo("#" + trID);
                    $("<td></td>").text(data.item[i].amount).appendTo("#" + trID);
                    $("<td></td>").text(data.item[i].attachment).appendTo("#" + trID);
                    $("<td></td>").text(data.item[i].remark).appendTo("#" + trID);
                    sum += new Number(data.item[i].amount);
                }
                if(!isNaN(sum))
                {
                    $("#sum").text(sum.toFixed(2));
                }
                else
                {
                    $("#sum").text("数据有误");
                }
            }
        });
    }

    //修改条目信息
    $("#editItem").click(function () {
        $("#table_item").find(".hidden").removeClass("hidden").addClass("editing");
        $("#btnAddItem").removeClass("hidden").addClass("editing");
        $(this).addClass("disabled").attr('disabled','disabled');
        $("#saveItem").removeClass("disabled").removeAttr('disabled');
    });

    //保存条目修改
    $("#saveItem").click(function () {
        for (var i in EditList){
            if($("#" + EditList[i].n).length > 0){
                EditList[i]._item = {
                    date : $("#" + EditList[i].n).find('input.date:first').val(),
                    site : $("#" + EditList[i].n).find('.site:first').val(),
                    type_id : $("#" + EditList[i].n).find('.type:first').val(),
                    amount : $("#" + EditList[i].n).find('.amount:first').val(),
                    attachment : $("#" + EditList[i].n).find('.attachment:first').val(),
                    remark : $("#" + EditList[i].n).find('.remark:first').val()
                }
            }
        }

        var addList = new Array();
        $.each($("tr.item-add"), function () {
            addList.push({
                date : $(this).find('input.date:first').val(),
                site : $(this).find('.site:first').val(),
                type_id : $(this).find('.type:first').val(),
                amount : $(this).find('.amount:first').val(),
                attachment : $(this).find('.attachment:first').val(),
                remark : $(this).find('.remark:first').val()
            });
        });

        $.ajax({
            url: "../../php/expense_edit_item.php",
            type: "POST",
            data: {
                expenseID : number,
                edit : JSON.stringify(EditList),
                add : JSON.stringify(addList)
            },
            success: function(data){
                if (data === "0"){
                    alert("修改成功");
                    window.location.reload();
                }
                else{
                    alertMsg("保存失败", "danger");
                }
            }
        });

        $("#btnAddItem").find(".editing").removeClass("editing").addClass("hidden");
        $("#table_item").find(".editing").removeClass("editing").addClass("hidden");
        $(this).addClass("disabled").attr('disabled','disabled');
        $("#editItem").removeClass("disabled").removeAttr('disabled');
    });

    //编辑报销单条目
    function editItem(item, trID){
        EditList.push({
            n : trID,
            item : item,
            _item : {}
        });
        $('#' + trID).addClass("item-edit");
        $('#' + trID).children().eq(3).text("").html("<div class='input-group date form_date col-md-12' data-date='' data-date-format='yyyy-mm-dd' data-link-field='dtp_input2' data-link-format='yyyy-mm-dd'> " +
                "<input value='" + item.date + "' class='form-control date expenseDate' size='16' type='text'>" +
                "<span class='input-group-addon'><span class='glyphicon glyphicon-calendar'>" +
                "</span></span></div>").end()
            .eq(4).text("").html("<input class='form-control site' type='text' value='" + item.site + "'>").end()
            .eq(5).text("").html("<select class='form-control type'>" +
                "<option value='1'>交通费</option> " +
                "<option value='2'>机票费</option> " +
                "<option value='3'>酒店费</option> " +
                "<option value='4'>差旅餐费</option> " +
                "<option value='5'>其他差旅相关费用</option> " +
                "<option value='6'>娱乐餐饮</option> " +
                "<option value='7'>培训课程、书籍</option> " +
                "<option value='8'>邮费</option> " +
                "<option value='9'>水电费</option> " +
                "<option value='10'>座机费</option> " +
                "<option value='11'>手机费</option> " +
                "<option value='12'>网费</option> " +
                "<option value='13'>仪器设备费用</option> " +
                "<option value='14'>办公室用品</option> " +
                "<option value='15'>会务费</option> " +
                "</select>").end()
            .eq(6).text("").html("<div class='input-group'> " +
                "<input class='form-control amount' type='text' value='" + item.amount + "'> " +
                "<span class='input-group-addon'>¥</span> " +
                "</div>").end()
            .eq(7).text("").html("<input type='number' class='form-control attachment'  value='" + item.attachment + "'>").end()
            .eq(8).text("").html("<input class='form-control remark' type='text'  value='" + item.remark + "'>").end()
            .end()
            .find('.form_date').datetimepicker({
                weekStart: 1,
                todayBtn: 1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0
            }).end()
            .find('option').each(function(){
                if($(this).val() == item.type_id){
                    $(this).attr('selected','selected')
                }
            });

    }

    //function editItem(item){
    //    $("#edit_item_date").val(item.date);
    //    $("#edit_item_site").val(item.site);
    //    $("#edit_item_type").val(item.type_id);
    //    $("#edit_item_amount").val(item.amount);
    //    $("#edit_item_attachment").val(item.attachment);
    //    $("#edit_item_remark").val(item.remark);
    //
    //    $("#btnItemSubmit").click(item, function (e) {
    //        if($("#edit_item_date").val() !== item.date
    //            || $("#edit_item_site").val() !== item.site
    //            || $("#edit_item_type").val() !== item.type_id
    //            || $("#edit_item_amount").val() !== item.amount
    //            || $("#edit_item_attachment").val() !== item.attachment
    //            || $("#edit_item_remark").val() !== item.remark){
    //
    //            $.ajax({
    //                url: "../../php/expense_edit_item.php",
    //                type: "POST",
    //                data: $("#formItem").serialize() + "&expenseID=" + number
    //                    + "&odate=" + item.date
    //                    + "&osite=" + item.site
    //                    + "&otype=" + item.type_id
    //                    + "&oamount=" + item.amount
    //                    + "&oattachment=" + item.attachment
    //                    + "&oremark=" + item.remark,
    //                success: function(data){
    //                    if (data === "0"){
    //                        alert("修改成功");
    //                        window.location.reload();
    //                    }
    //                    else{
    //                        alertMsg("保存失败", "danger");
    //                    }
    //                }
    //            });
    //
    //        }
    //        else {
    //            alertMsg("已保存，并无修改", "success");
    //        }
    //    });
    //
    //    $("#modalEditItem").modal('show');
    //}

    //删除报销单条目
    function deleteItem(item, trID){
        var okay = confirm('是否确定删除，删除后将无法恢复！');
        if (okay) {
            // 用户按下“确定”
            $.ajax({
                url: "../../php/expense_edit_item.php",
                type : "POST",
                data : {'delete_only': 1, 'expenseID': number, 'odate': item.date, 'osite': item.site, 'otype': item.type_id,'oamount': item.amount,'oattachment': item.attachment,'oremark': item.remark},
                cache : false,
                success: function(data){
                    if(data === "0")
                    {
                        alertMsg("删除成功", "success");
                        $.each($('#' + trID).nextAll(), function () {
                            var o = $(this).find(" .index").text();
                            $(this).find(".index").text((o - 1) + '.');
                        });
                        $('#' + trID).remove();
                        SumOfItem -= 1;
                    }
                    else
                    {
                        alertMsg("删除失败", "danger");
                    }
                }
            });
        } else {
            // 用户按下“取消”
        }
    }

    //添加一行
    $("#btnAddItem").click(function () {
        SumOfItem += 1;
        var tr = $("<tr>").addClass('item-add').appendTo("#tbodyExpenseItem");
            tr.append("<td class='editing'>" +
                "<a type='button' class='badge bg-light-blue' disabled='disabled'><i class='fa fa-pencil'></i></a>" +
                "</td>")
            .append("<td class='editing'>" +
                "<a type='button' class='badge bg-red'><i class='fa fa-trash-o'></i></a>" +
                "</td>")
            .append("<td class='index'>" + SumOfItem + ".</td>")
            .append("<td><div class='input-group date form_date col-md-12' data-date='' data-date-format='yyyy-mm-dd' data-link-field='dtp_input2' data-link-format='yyyy-mm-dd'> " +
                "<input class='form-control expenseDate date' size='16' type='text'>" +
                "<span class='input-group-addon'><span class='glyphicon glyphicon-calendar'>" +
                "</span></span></div></td>")
            .append("<td><input class='form-control site' type='text'></td>")
            .append("<td><select class='form-control type'> " +
                "<option value='1'>交通费</option> " +
                "<option value='2'>机票费</option> " +
                "<option value='3'>酒店费</option> " +
                "<option value='4'>差旅餐费</option> " +
                "<option value='5'>其他差旅相关费用</option> " +
                "<option value='6'>娱乐餐饮</option> " +
                "<option value='7'>培训课程、书籍</option> " +
                "<option value='8'>邮费</option> " +
                "<option value='9'>水电费</option> " +
                "<option value='10'>座机费</option> " +
                "<option value='11'>手机费</option> " +
                "<option value='12'>网费</option> " +
                "<option value='13'>仪器设备费用</option> " +
                "<option value='14'>办公室用品</option> " +
                "<option value='15'>会务费</option> " +
                "</select></td>")
            .append("<td><div class='input-group'> " +
                "<input class='form-control amount' type='text'> " +
                "<span class='input-group-addon'>¥</span> " +
                "</div></td>")
            .append("<td><input type='number' class='form-control attachment'></td>")
            .append("<td><input class='form-control remark' type='text'></td>")
            .find('.form_date').datetimepicker({
                weekStart: 1,
                todayBtn: 1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0
            }).end()
            .find('a').eq(1).click(tr, function (e) {
                $.each(e.data.nextAll(), function () {
                    var o = $(this).find(" .index").text();
                    $(this).find(".index").text((o - 1) + '.');
                });
                e.data.remove();
                SumOfItem -= 1;
        });

    });

    //function removeAddItem(){
    //    var i = 1;
    //    var b = 2;
    //    //$(para).parent().parent().remove();
    //}

    //$("#btnAddItem").click(function () {
    //    $("#edit_item_date").val('');
    //    $("#edit_item_site").val('');
    //    $("#edit_item_type").val(1);
    //    $("#edit_item_amount").val(0);
    //    $("#edit_item_attachment").val('');
    //    $("#edit_item_remark").val('');
    //
    //    $("#btnItemSubmit").unbind().click(function (e) {
    //        $.ajax({
    //            url: "../../php/expense_edit_item.php",
    //            type: "POST",
    //            data: $("#formItem").serialize() + "&expenseID=" + number
    //            + "&add=true",
    //            success: function(data){
    //                if (data === "0"){
    //                    alert("添加成功");
    //                    window.location.reload();
    //                }
    //                else{
    //                    alertMsg("添加失败", "danger");
    //                }
    //
    //                setTimeout("location.reload();", 1000);
    //            }
    //        });
    //        $("#modalEditItem").modal('hide');
    //
    //    });
    //
    //    $("#modalEditItem").modal('show');
    //});

    //点击打印按钮
    $("#btnPrint").click(function(){
        window.open("expense_print.html?x=" + number + "&d=" + submitDate);
    });

    //提交
    $("#btnSubmit").click(function () {
        $.ajax({
            url: "../../php/expenseSaveDraft.php",
            type: "POST",
            data: {'submit': true, 'expenseID': number},
            success: function(data){
                if (data === "0"){
                    alertMsg("提交成功", "success");
                    window.location('expense_history.html');
                }
                else{
                    alertMsg("提交失败", "danger");
                }
            }
        });
    });

    //获取页面参数name
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

})();