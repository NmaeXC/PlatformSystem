/**
 * Created by wx_h0001 on 2016/5/27.
 */

(function () {
    var editList = {};  //产品修改列表
    var preList = {};   //产品原信息列表

    freshMyPage();

    window.onbeforeunload = function(){
        var editList_json = JSON.stringify(editList);
        if (editList_json != JSON.stringify(preList)){
            return "您的信息修改尚未保存";
        }
    };

    var number = getQueryString("x");
    var contact = getQueryString("c");
    if (number !== null)
    {
        //初始化页面
        initPage(number, contact);
        $('#validity').daterangepicker();
    }
    else
    {
        console.log("No Detail Number");
    }

    function initPage(number, contact) {
        $.ajax({
            url: "../../php/quote_detail.php",
            type: "POST",
            dataType: "json",
            data : {'detailNumber' : number, 'contact': contact},
            success: function (data) {
                $("#id").text(number);
                //var today = new Date();
                //$("#print_date").text(today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate());
                if (data.quote.currency == 'RMB'){
                    $("#currency").val("RMB");
                    $(".currency").text("¥");
                }
                else{
                    $("#currency").val("USD");
                    $(".currency").text("$");
                }
                $("#customer_name").val(nullornot(data.quote.customer_name));
                $("#customer_id").text(nullornot(data.quote.customer_id));
                $("#contact_name").html("<option value='" + contact + "'>" + nullornot(data.quote.contact_name) + "</option>");
                $("#contact_tele").text(nullornot(data.quote.contact_tele));
                $("#contact_email").text(nullornot(data.quote.contact_email));
                $("#customer_addr").text(nullornot(data.quote.customer_addr));
                //$("#start").text(nullornot(data.quote.validity_start));
                //$("#end").text(nullornot(data.quote.validity_end));
                $("#validity").val(data.quote.validity_start + " - " + data.quote.validity_end);
                $(".nameUser").text(nullornot(data.userInfo.name));
                $(".teleUser").text(nullornot(data.userInfo.tele));
                $(".foxUser").text("-");
                $(".emailUser").text(nullornot(data.userInfo.email));
                var sum = 0;
                for(var i in data.products)
                {
                    var trID = "tr" + i;
                    $("<tr>").attr('id', trID).appendTo("#tbody_products");
                    $("<td>" +
                        "<a role='button' class='badge bg-light-blue'><i class='fa fa-pencil'></i></a>" +
                        "</td>")
                        .find("a").click(data.products[i], function (e) {
                        $(this).removeClass('bg-light-blue').html("<i class='fa fa-backward'></i></a>");
                        editProductItem(e.data, $(this).parent().parent());
                    }).end().appendTo("#" + trID);
                    $("<td>" +
                        "<a role='button' class='badge bg-red'><i class='fa fa-trash-o'></i></a>" +
                        "</td>")
                        .find("a").click(data.products[i].id, function (e) {
                        deleteProductItem(e.data, $(this).parent().parent());
                    }).end().appendTo("#" + trID);
                    $("<td class='pindex'></td>").text((parseInt(i) + 1) + ".").appendTo("#" + trID);
                    $("<td></td>").text(data.products[i].product_id).appendTo("#" + trID);
                    $("<td></td>").text(data.products[i].name).appendTo("#" + trID);
                    $("<td></td>").text(data.products[i].price).appendTo("#" + trID);
                    //var taxRate = new Number(data.products[i].tax_rate);
                    var taxRate = function(val){
                        var rate = {
                            '0': function () {
                                return 0;
                            },
                            '1': function () {
                                return 0.06;
                            },
                            '2': function () {
                                return 0.17;
                            }
                        };
                        if (typeof(rate[val]) === "function"){
                            return rate[val]();
                        }
                        else
                        {
                            return NaN;
                            console.log("taxRate Input Error");
                        }
                    }(data.products[i].tax_rate);
                    $("<td></td>").text(data.products[i].discount + "%").appendTo("#" + trID);
                    $("<td></td>").text((taxRate * 100) + "%").appendTo("#" + trID);
                    //var price = new Number(data.products[i].orig_price) * (taxRate + 1);
                    var price = new Number(data.products[i].price) * (new Number(data.products[i].discount) / 100) * (taxRate + 1);
                    $("<td></td>").text(price.toFixed(2)).appendTo("#" + trID);
                    $("<td></td>").text(data.products[i].amount).appendTo("#" + trID);
                    var totalPrice = price * (new Number(data.products[i].amount));
                    $("<td></td>").text(totalPrice.toFixed(2)).appendTo("#" + trID);
                    $("<td><a role='button' class='badge bg-light-blue' data-placement='bottom' data-toggle='popover'><i class='fa fa-building-o'></i></a></td>")
                        .find('a').popover({
                        trigger: "hover",
                        content: data.products[i].ps
                    }).end().appendTo("#" + trID);
                    sum += totalPrice;
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

    function nullornot(str){
        if(str === ""){
            return "-";
        }
        else {
            return str;
        }
    }

    //获取页面参数name
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

    //修改客户
    $("#editCustomer").click(function () {
        $("#customer_name").removeAttr("disabled");
        $("#contact_name").removeAttr("disabled");

        $("#customer_name").bigAutocomplete({
            url: "../../php/autocomplete.php?type=customer",
            callback: function(data){
                var customerId = data.id;
                $("#customer_id").text(customerId);
                showCustomerInfo(customerId);

            }
        });
        showCustomerInfo($("#customer_id").text());

        $(this).addClass("disabled");
        $("#saveCustomer").removeClass("disabled");

        //修改客户保存
        $("#saveCustomer").unbind("click").click({customer : $("#customer_id").text(), contact : contact},function (e) {
            var newCustomerID = $("#customer_id").text();
            var newContactID = $("#contact_name").val();
            if(newCustomerID != e.data.customer || newContactID != e.data.contact){
                $.ajax({
                    url: "../../php/quote_edit_customer.php",
                    type: "POST",
                    data: {'newCustomerId': newCustomerID, 'newContactId': newContactID, 'quote': number},
                    success: function(data){
                        if (data === "0"){
                            alertMsg("已保存，修改成功", "success");
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

            $(this).addClass("disabled");
            $("#editCustomer").removeClass("disabled");
            $("#customer_name").attr("disabled",true);
            $("#contact_name").attr("disabled",true);
        });
    });

    //修改联系人
    $("#contact_name").change(function () {
        showContactInfo($(this).val());
    });

    //显示选中客户的信息
    function showCustomerInfo(customerID){
        $.ajax({
            url: "../../php/quote_edit_customer.php",
            type: "POST",
            data: {'customerId': customerID},
            dataType: "json",
            success: function(data){
                $("#customer_addr").text(data.addr);
                $("#contact_name").empty();
                data.contact.forEach(function(ele){
                    this.append("<option value='" + ele.id + "'>" + ele.name + "</option>");
                }, $("#contact_name"));

                showContactInfo(data.contact[0].id);
            }
        });
    }

    //选中联系人信息
    function showContactInfo(contactID){
        $.ajax({
            url: "../../php/quote_edit_customer.php",
            type: "POST",
            data: {'contactId': contactID},
            dataType: "json",
            success: function(data){
                $("#contact_tele").text(data.tele);
                $("#contact_email").text(data.email);
            }
        });
    }

    //修改报价单信息
    $("#editQuote").click(function () {
        $("#validity").removeAttr("disabled");
        $("#currency").removeAttr("disabled");
        $(this).addClass("disabled");
        $("#saveQuote").removeClass("disabled");

        $("#saveQuote").unbind('click').click({v: $("#validity").val(), c: $("#currency").val()}, function (e) {
            var _v = $("#validity").val();
            var _c = $("#currency").val();
            if(_v != e.data.v || _c != e.data.c){
                var validity = _v.split(" - ");
                $.ajax({
                    url: "../../php/quote_edit_quote.php",
                    type: "POST",
                    data: {'validity': validity, 'c': _c, 'quote': number},
                    success: function(data){
                        if (data === "0"){
                            alertMsg("已保存，修改成功", "success");
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

            $(this).addClass("disabled");
            $("#editQuote").removeClass("disabled");
            $("#validity").attr("disabled", true);
            $("#currency").attr("disabled", true);
        });

    });
    
    //修改产品信息
    //$("#editProduct").click(function () {
    //    $("#table_products").find(".hidden").removeClass("hidden").addClass("editing");
    //    $("#btnAddProduct").removeClass("hidden").addClass("editing");
    //    $(this).addClass("disabled");
    //    $("#saveProduct").removeClass("disabled");
    //});

    //保存产品信息修改
    $("#saveProduct").click(function () {
        var changedList = {};
        for (var i in editList){
            if (JSON.stringify(editList[i]) != JSON.stringify(preList[i])){
                changedList[i] = editList[i];
            }
        }
        if ($.isEmptyObject(changedList)){
            alertMsg("内容未修改", "danger");
        }else{
            $.ajax({
                url: "../../php/quote_edit_product.php",
                type: "POST",
                dataType: 'json',
                data: {editList: JSON.stringify(changedList), quote_id: number, action: 'edit'},
                success: function(data){
                    if (data.tag === "ok"){
                        alertMsg("已保存，修改成功", "success");
                        preList = editList;
                        window.location.reload();
                    }
                    else{
                        alertMsg("产品号为：(" + data.errorList + ")保存失败!", "warning");
                    }
                }
            });
        }

        //$("#btnAddProduct").removeClass("editing").addClass("hidden");
        //$("#table_products").find(".editing").removeClass("editing").addClass("hidden");
        //$(this).addClass("disabled");
        //$("#editProduct").removeClass("disabled");
    });

    //修改产品条目
    function editProductItem(data, tr){
        var taxRate = new Number(data.tax_rate);
        var price = new Number(data.price) * (new Number(data.discount) / 100) * (taxRate + 1);
        var totalPrice = price * (new Number(data.amount));
        editList[data.id] = {
            product_id: data.product_id,
            name: data.name,
            price: data.price,
            amount: data.amount,
            discount: data.discount,
            tax_rate: data.tax_rate,
            ps: data.ps
        };
        if (typeof preList[data.id] === 'undefined'){
            preList[data.id] = {
                product_id: data.product_id,
                name: data.name,
                price: data.price,
                amount: data.amount,
                discount: data.discount,
                tax_rate: data. tax_rate,
                ps: data.ps
            };
        }
        var selectHTML = function(val){
            var rate = {
                '0': function () {
                    return "<select><option value='0' selected>0%</option><option value='1'>6%</option><option value='2'>17%</option></select>";
                },
                '1': function () {
                    return "<select><option value='0'>0%</option><option value='1' selected>6%</option><option value='2'>17%</option></select>";
                },
                '2': function () {
                    return "<select><option value='0'>0%</option><option value='1'>6%</option><option value='2' selected>17%</option></select>";
                }
            };
            if (typeof(rate[val]) === "function"){
                return rate[val]();
            }
            else
            {
                return NaN;
                console.log("taxRate Input Error");
            }
        }(data.tax_rate);
        tr.children().eq(3).empty().append($("<input type='text'>").change(data.id, function (e) {
            editList[e.data].product_id = $(this).val();
        }).val(data.product_id)).end()
            .eq(4).empty().append($("<input type='text'>").change(data.id, function (e) {
            editList[e.data].name = $(this).val();
        }).val(data.name)).end()
            .eq(5).empty().append($("<input type='text'>").change(data.id, function (e) {
            editList[e.data].price = $(this).val();
            autoCalculate(e.data);
        }).val(data.price)).end()
            .eq(6).empty().append($("<input type='text' style='width: 80%'>").change(data.id, function (e) {
            editList[e.data].discount = $(this).val();
            autoCalculate(e.data);
        }).val(data.discount), "<span>%</span>").end()
            .eq(7).empty().append($(selectHTML).change(data.id, function (e) {
            editList[e.data].tax_rate = $(this).find("option:selected").val();
            autoCalculate(e.data);
        })).end()
            .eq(8).attr("id", "autoPrice_" + data.id).end()
            .eq(9).empty().append($("<input type='number'>").change(data.id, function (e) {
            editList[e.data].amount = $(this).val();
            autoCalculate(e.data);
        }).val(data.amount)).end()
            .eq(10).attr("id", "autoTotalPrice_" + data.id).end()
            .eq(11).find('a').click(data.id, function (e) {
            var a = $(this);
            $("#textEditPs").val(editList[e.data].ps);
            $("#btnEditPsConform").unbind().click({index: e.data, a: a}, function (e) {
                editList[e.data.index].ps = $("#textEditPs").val();
                a.popover('destroy').popover({
                    trigger: "hover",
                    content: editList[e.data.index].ps
                });
                $("#modalEditPs").modal('hide');
            });
            $("#modalEditPs").modal('show');
        })
    }

    //添加一行产品
    $("#btnAddProduct").click(function () {
        $.ajax({
            url: "../../php/quote_edit_product.php",
            type: "POST",
            dataType: "json",
            data : {quote_id : number, action: 'add'},
            success: function (data) {
                if (data.tag == 'ok'){
                    editList[data.id] = {
                        product_id: "",
                        name: "",
                        price: '0',
                        amount: '0',
                        discount: '100',
                        tax_rate: '0',
                        ps: ""
                    };
                    if (typeof preList[data.id] === 'undefined'){
                        preList[data.id] = {
                            product_id: "",
                            name: "",
                            price: '0',
                            amount: '0',
                            discount: '100',
                            tax_rate: '0',
                            ps: ""
                        };
                    }
                    $("<tr></tr>").append(
                        $("<td></td>").append("<a role='button' class='badge' disabled><i class='fa fa-pencil'></i></a>"),
                        $("<td></td>").append($("<a role='button' class='badge bg-red'><i class='fa fa-trash-o'></i></a>").click(data.id, function (e) {
                            deleteProductItem(e.data, $(this).parent().parent());
                        })),
                        $("<td class='pindex'></td>").text($(".pindex").length + 1),
                        $("<td></td>").append($("<input type='text'>").change(data.id, function (e) {
                            editList[e.data].product_id = $(this).val();
                        }).val("")),
                        $("<td></td>").append($("<input type='text'>").change(data.id, function (e) {
                            editList[e.data].name = $(this).val();
                        }).val("")),
                        $("<td></td>").append($("<input type='text'>").change(data.id, function (e) {
                            editList[e.data].price = $(this).val();
                            autoCalculate(e.data);
                        }).val(0)),
                        $("<td></td>").append($("<input type='text' style='width: 80%'>").change(data.id, function (e) {
                            editList[e.data].discount = $(this).val();
                            autoCalculate(e.data);
                        }).val(100), "<span>%</span>"),
                        $("<td></td>").append($("<select><option value='0' selected>0%</option><option value='1'>6%</option><option value='2'>17%</option></select>").change(data.id, function (e) {
                            editList[e.data].tax_rate = $(this).find("option:selected").val();
                            autoCalculate(e.data);
                        })),
                        $("<td></td>").attr("id", "autoPrice_" + data.id),
                        $("<td></td>").append($("<input type='number'>").change(data.id, function (e) {
                            editList[e.data].amount = $(this).val();
                            autoCalculate(e.data);
                        }).val(0)),
                        $("<td></td>").attr("id", "autoTotalPrice_" + data.id),
                        $("<td></td>").append($("<a role='button' class='badge bg-light-blue' data-placement='bottom' data-toggle='popover'><i class='fa fa-building-o'></i></a>").popover({
                            trigger: "hover",
                            content: ""
                        }).click(data.id, function (e) {
                            var a = $(this);
                            $("#textEditPs").val(editList[e.data].ps);
                            $("#btnEditPsConform").unbind().click({index: e.data, a: a}, function (e) {
                                editList[e.data.index].ps = $("#textEditPs").val();
                                a.popover('destroy').popover({
                                    trigger: "hover",
                                    content: editList[e.data.index].ps
                                });
                                $("#modalEditPs").modal('hide');
                            });
                            $("#modalEditPs").modal('show');
                        }))
                    ).appendTo("#tbody_products");
                    productIndexFresh();
                }else{
                    alertMsg('添加新产品出错', 'warning');
                }

            }
        });
    });


    //打印
    $("#btnPrint").click(function () {
        window.open("quote_print.html?x=" + number + "&c=" + contact);
    });

    function autoCalculate(id){
        var originalPrice = new Number(editList[id].price);
        var discount = new Number(editList[id].discount);
        var taxRate = function(val){
            var rate = {
                '0': function () {
                    return 1;
                },
                '1': function () {
                    return 1.06;
                },
                '2': function () {
                    return 1.17;
                }
            };
            if (typeof(rate[val]) === "function"){
                return rate[val]();
            }
            else
            {
                return NaN;
                console.log("taxRate Input Error");
            }
        }(editList[id].tax_rate);
        var amount = new Number(editList[id].amount);
        var price = originalPrice * (discount / 100) * taxRate;
        $("#sum").text((new Number($("#sum").text()) - new Number($("#autoTotalPrice_" + id).text()) + (price * amount)).toFixed(2));
        $("#autoPrice_" + id).text(price.toFixed(2));
        $("#autoTotalPrice_" + id).text((price * amount).toFixed(2));
    }

    //删除产品条目
    function deleteProductItem(id, tr) {
        var okay = confirm('是否确定删除，删除后将无法恢复！');
        if (okay) {
            // 用户按下“确定”
            if (typeof editList[id] !== 'undefined'){
                delete editList[id];
                delete preList[id];
            }
            $.ajax({
                url: "../../php/quote_edit_product.php",
                type : "POST",
                data : {action: 'delete', 'productID': id, 'quote_id': number},
                cache : false,
                product_tr: tr,
                success: function(data){
                    if(data === "0")
                    {
                        alertMsg("删除成功", "success");
                        //location.reload();
                        this.product_tr.remove();
                        productIndexFresh();
                    }
                    else
                    {
                        alertMsg("删除失败", "warning");
                    }
                }
            });
        } else {
            // 用户按下“取消”
        }
    }

    //更新产品列表index标签
    function productIndexFresh(){
        $(".pindex").each(function(index, element){
            $(element).text((parseInt(index) + 1) + ".");
        });
    }

})();
