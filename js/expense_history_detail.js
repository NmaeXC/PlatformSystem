/**
 * Created by wx_h0001 on 2016/6/3.
 */

(function () {
    freshMyPage();

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
                $("#number").text(number);
                $("#submitDate").text(submitDate);
                $("#name").text(data.userInfo.name);
                $("#uid").text(data.userInfo.uid);
                $("#department").text(data.userInfo.department);
                $("#title").text(data.userInfo.title);
                //var today = new Date();
                //$("#today").text(today.getFullYear() + "年" + (today.getMonth()+1) + "月" + today.getDate() + "日");

                var sum = new Number(0);

                for(var i in data.item)
                {
                    var trID = "tr" + i;
                    $("<tr>").attr('id', trID).appendTo("#tbodyExpenseItem");
                    $("<td class='hidden'>" +
                        "<a type='button' class='badge bg-light-blue'><i class='fa fa-pencil'></i></a>" +
                        "</td>")
                        .find("a").click(data.item[i], function (e) {
                        editItem(e.data);
                    }).end().appendTo("#" + trID);
                    $("<td class='hidden'>" +
                        "<a type='button' class='badge bg-red'><i class='fa fa-trash-o'></i></a>" +
                        "</td>")
                        .find("a").click(data.item[i], function (e) {
                        deleteItem(e.data);
                    }).end().appendTo("#" + trID);
                    $("<td></td>").text((parseInt(i) + 1) + ".").appendTo("#" + trID);
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
        $(this).addClass("disabled");
        $("#saveItem").removeClass("disabled");
    });

    //保存条目修改
    $("#saveItem").click(function () {
        $("#table_item").find(".editing").removeClass("editing").addClass("hidden");
        $(this).addClass("disabled");
        $("#editItem").removeClass("disabled");
    });

    //编辑报销单条目
    function editItem(item){
        $("#edit_item_date").val(item.date);
        $("#edit_item_site").val(item.site);
        $("#edit_item_type").val(item.type_id);
        $("#edit_item_amount").val(item.amount);
        $("#edit_item_attachment").val(item.attachment);
        $("#edit_item_remark").val(item.remark);

        $("#btnItemSubmit").click(item, function (e) {
            if($("#edit_item_date").val() !== item.date
                || $("#edit_item_site").val() !== item.site
                || $("#edit_item_type").val() !== item.type_id
                || $("#edit_item_amount").val() !== item.amount
                || $("#edit_item_attachment").val() !== item.attachment
                || $("#edit_item_remark").val() !== item.remark){

                $.ajax({
                    url: "../../php/expense_edit_item.php",
                    type: "POST",
                    data: $("#formItem").serialize() + "&expenseID=" + number
                        + "&odate=" + item.date
                        + "&osite=" + item.site
                        + "&otype=" + item.type_id
                        + "&oamount=" + item.amount
                        + "&oattachment=" + item.attachment
                        + "&oremark=" + item.remark,
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

            }
            else {
                alertMsg("已保存，并无修改", "success");
            }
        });

        $("#modalEditItem").modal('show');
    }

    //删除报销单条目
    function deleteItem(item){
        var okay = confirm('是否确定删除，删除后将无法恢复！');
        if (okay) {
            // 用户按下“确定”
            $.ajax({
                url: "../../php/expense_edit_item.php",
                type : "POST",
                data : {'delete': 1, 'odate': item.date, 'osite': item.site, 'otype': item.type_id,'oamount': item.amount,'oattachment': item.attachment,'oremark': item.remark},
                cache : false,
                success: function(data){
                    if(data === "0")
                    {
                        alertMsg("删除成功", "success");
                        location.reload();
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

    //点击打印按钮
    $("#btnPrint").click(function(){
        window.open("expense_print.html?x=" + number + "&d=" + submitDate);
    });

    //获取页面参数name
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

})();