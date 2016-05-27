/**
 * Created by wx_h0001 on 2016/5/13.
 */

//页面初始化
$(document).ready(function () {
    freshMyPage();
});

var contact_colume = 0;     //联系人数

$("#key").bigAutocomplete({
    url: "../../php/auto_customer.php",
    callback: function(data){
        if(typeof(data.id) != "undefined"){
            $("#tbody_contact").empty();
            var customerId = data.id;
            $("#customerID").text(customerId);
            $.ajax({
                url: "../../php/customer_info.php",
                type: "POST",
                data: {'customerId': customerId},
                dataType: "json",
                success: function(data){
                    if (data.customer){
                        $("#customer_name").text(data.customer['name']);
                        $("#customer_id").text(data.customer['id']);
                        $("#customer_tele").text(data.customer['tele']);
                        $("#customer_email").text(data.customer['email']);
                        $("#customer_addr").text(data.customer['addr0'] + " " + data.customer['addr1']);

                        //for (var m in data.customer){
                        //    $("#customer_" + m).text(nullornot(data.customer[m]));
                        //}

                        //发送邮件
                        $("#sendMail").attr('href', 'mailto:' + data.customer['email']);

                        //编辑客户信息
                        $("#btnEditCustomer").click(function () {
                            $("#editCustomerName").val(data.customer['name']);
                            $("#editCustomerId").val(data.customer['id']);
                            $("#editCustomerTele").val(data.customer['tele']);
                            $("#editCustomerEmail").val(data.customer['email']);
                            $("#editCustomerAddr0").val(data.customer['addr0']);
                            $("#editCustomerAddr1").val(data.customer['addr1']);
                            $("#btnCustomerSubmit").click(function () {
                                if ($("#editCustomerName").val() !== data.customer['name']
                                || $("#editCustomerTele").val() !== data.customer['tele']
                                || $("#editCustomerEmail").val() !== data.customer['email']
                                || $("#editCustomerAddr1").val() !== data.customer['addr1']){

                                    $.ajax({
                                        url: "../../php/edit_customer.php",
                                        type : "POST",
                                        data : $("#formEditCustomer").serialize(),
                                        cache : false,
                                        success: function(data){
                                            if(data === "0"){
                                                alertMsg("修改客户信息成功", "success");
                                                $("#customer_name").text($("#editCustomerName").val());
                                                $("#customer_tele").text($("#editCustomerTele").val());
                                                $("#customer_email").text($("#editCustomerEmail").val());
                                                $("#customer_addr").text($("#editCustomerAddr0").val() + " " + $("#editCustomerAddr1").val());
                                                $("#modalEditCustomer").modal('hide');
                                            }
                                            else
                                            {
                                                alertMsg("修改客户信息失败", "danger");
                                            }
                                        }
                                    });
                                }
                                else {
                                    alertMsg("无修改项", "warning");
                                }
                            });
                            $("#modalEditCustomer").modal('show');

                        });

                        //删除客户
                        $("#btnDeleteCustomer").click(data.customer['id'], function (e) {
                            var okay = confirm('是否确定删除，删除后将无法恢复！');
                            if (okay) {
                                // 用户按下“确定”
                                $.ajax({
                                    url: "../../php/delete_customer.php",
                                    type : "POST",
                                    data : {'id': e.data},
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
                        });

                        for (contact_colume = 0; contact_colume < data.contact.length; contact_colume += 1)
                        {
                            var trID = "tr_contact_" + contact_colume;
                            $("<tr>").attr('id', trID).appendTo("#tbody_contact");
                            $("<td></td>").text((contact_colume+1) + '.').appendTo("#" + trID);
                            $("<td></td>").text(data.contact[contact_colume].name).appendTo("#" + trID);
                            $("<td></td>").text(data.contact[contact_colume].sex).appendTo("#" + trID);
                            $("<td></td>").text(data.contact[contact_colume].tele).appendTo("#" + trID);
                            $("<td></td>").text(data.contact[contact_colume].email).appendTo("#" + trID);
                            //$("<td></td>").text(data.contact[i].addr).appendTo("#" + trID);
                            $("<td><a class='badge bg-light-blue' onclick='editContact(" + data.contact[contact_colume].id + ", this)'><i class='fa fa-edit'></i></a></td>").appendTo("#" + trID);
                            $("<td><a class='badge bg-red' onclick='deleteContact(" + data.contact[contact_colume].id + ", this)'><i class='fa fa-times'></i></a></td>").appendTo("#" + trID);
                        }
                        $("#new_colume_index").text((contact_colume+1) + '.');
                        $("#divCustomerInfo").show();
                    }
                    else{
                        alertMsg("查询出错", "danger");
                    }
                }
            });
        }
        else{
            //提示不存在，询问是否创建新的客户
            var okay = confirm('该客户不存在，是否新建？');
            if (okay) {
                // 用户按下“确定”
                addCustomer();
            } else {
                // 用户按下“取消”
            }

        }

    }
});

function nullornot(str){
    if(str === ""){
        return "-";
    }
    else {
        return str;
    }
}


//编辑联系人
function editContact(id, ele){
    var tr = $(ele).parent().parent();
    var _name =tr.children().eq(1).text();
    var _sex = tr.children().eq(2).text();
    var _tele = tr.children().eq(3).text();
    var _email = tr.children().eq(4).text();
    $("#editIndex").text( tr.children().eq(0).text());
    $("#editName").val(_name);
    $("#editSex").val(_sex);
    $("#editTele").val(_tele);
    $("#editEmail").val(_email);
    $("#editSubmit").click(function () {
        if($("#editName").val() !== _name || $("#editSex").val() !== _sex || $("#editTele").val() !== _tele || $("#editEmail").val() !== _email){
            $.ajax({
                url: "../../php/edit_contact.php",
                type : "POST",
                data : {'id': id, 'name': $("#editName").val(), 'sex': $("#editSex").val(), 'tele': $("#editTele").val(), 'email': $("#editEmail").val()},
                cache : false,
                success: function(data){
                    if(data === "0"){
                        alertMsg("修改联系人成功", "success");
                        tr.children().eq(1).text($("#editName").val());
                        tr.children().eq(2).text($("#editSex").val());
                        tr.children().eq(3).text($("#editTele").val());
                        tr.children().eq(4).text($("#editEmail").val());
                        $("#modalEditContact").modal('hide');
                    }
                    else
                    {
                        alertMsg("修改联系人失败", "danger");
                    }
                }
            });
        }
        else{
            alertMsg("无修改项", "warning");
        }

    });
    $("#modalEditContact").modal('show');

}

//删除联系人
function deleteContact(id, ele){
    var okay = confirm('是否确定删除，删除后将无法恢复！');
    if (okay) {
        // 用户按下“确定”
        $.ajax({
            url: "../../php/delete_contact.php",
            type : "POST",
            data : {'id': id},
            cache : false,
            success: function(data){
                if(data === "0")
                {
                    alertMsg("删除成功", "success");
                    $(ele).parent().parent().remove();
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

function addCustomer(){
    window.location.href = "customer_new.html";
}

$("#btnCustomerSearch").click(addCustomer);

$("#btnAddContact").click(function () {
    var customer_id = $("#customer_id").text();
    var add_name = $("#add_name").val();
    var add_sex = $("#add_sex").val();
    var add_tele = $("#add_tele").val();
    var add_email = $("#add_email").val();
    if (add_name){
        $.ajax({
            url: "../../php/contact_new.php",
            type : "POST",
            data : {'customer_id': customer_id, 'add_name': add_name, 'add_sex': add_sex, 'add_tele': add_tele, 'add_email': add_email},
            cache : false,
            success: function(data){
                if (data === "0")
                {
                    alertMsg("新建联系人成功", "success");

                    var trID = "tr_contact_" + contact_colume;
                    $("<tr>").attr('id', trID).appendTo("#tbody_contact");
                    $("<td></td>").text((contact_colume+1) + '.').appendTo("#" + trID);
                    $("<td></td>").text(add_name).appendTo("#" + trID);
                    $("<td></td>").text(add_sex).appendTo("#" + trID);
                    $("<td></td>").text(add_tele).appendTo("#" + trID);
                    $("<td></td>").text(add_email).appendTo("#" + trID);
                    //$("<td></td>").text(data.contact[i].addr).appendTo("#" + trID);
                    $("<td><a class='badge bg-gray'><i class='fa fa-edit'></i></a></td>").appendTo("#" + trID);
                    $("<td><a class='badge bg-gray'><i class='fa fa-times'></i></a></td>").appendTo("#" + trID);
                    contact_colume += 1;
                    $("#new_colume_index").text((contact_colume+1) + '.');
                    $("input").val("");
                }
                else
                {
                    alertMsg("新建联系人失败", "danger");
                }
            }
        });
    }
    else {
        alertMsg("请务必填写联系人姓名", "warning");
    }

});