/**
 * Created by wx_h0001 on 2016/5/27.
 */

(function () {
    freshMyPage();

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
                    $("<td class='hidden'>" +
                        "<a type='button' class='badge bg-light-blue'><i class='fa fa-pencil'></i></a>" +
                        "</td>")
                        .find("a").click(data.products[i], function (e) {
                        editProductItem(e.data);
                    }).end().appendTo("#" + trID);
                    $("<td class='hidden'>" +
                        "<a type='button' class='badge bg-red'><i class='fa fa-trash-o'></i></a>" +
                        "</td>")
                        .find("a").click(data.products[i].id, function (e) {
                        deleteProductItem(e.data);
                    }).end().appendTo("#" + trID);
                    $("<td></td>").text((parseInt(i) + 1) + ".").appendTo("#" + trID);
                    $("<td></td>").text(data.products[i].product_id).appendTo("#" + trID);
                    $("<td></td>").text(data.products[i].name).appendTo("#" + trID);
                    $("<td></td>").text(data.products[i].price).appendTo("#" + trID);
                    var taxRate = new Number(data.products[i].tax_rate);
                    $("<td></td>").text(data.products[i].discount + "%").appendTo("#" + trID);
                    $("<td></td>").text((taxRate * 100) + "%").appendTo("#" + trID);
                    //var price = new Number(data.products[i].orig_price) * (taxRate + 1);
                    var price = new Number(data.products[i].price) * (new Number(data.products[i].discount) / 100) * (taxRate + 1);
                    $("<td></td>").text(price.toFixed(2)).appendTo("#" + trID);
                    $("<td></td>").text(data.products[i].amount).appendTo("#" + trID);
                    var totalPrice = price * (new Number(data.products[i].amount));
                    $("<td></td>").text(totalPrice.toFixed(2)).appendTo("#" + trID);
                    $("<td><a type='button' class='badge bg-light-blue' data-placement='bottom' data-toggle='popover'><i class='fa fa-building-o'></i></a></td>")
                        .find('a').popover({
                        title: "备注",
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
            url: "../../php/auto_customer.php",
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

        $("#saveQuote").unbind('click').click({v: $("#validity").val(), c: $("#currency").val()}, function () {
            var _v = $("#validity").val();
            var _c = $("#currency").val().val();
            if(_v != v || _c != c){
                var validity = _v.split(" - ");
                $.ajax({
                    url: "../../php/quote_edit_quote.php",
                    type: "POST",
                    data: {'v': validity, 'c': _c, 'quote': number},
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
    $("#editProduct").click(function () {
        $("#table_products").find(".hidden").removeClass("hidden").addClass("editing");
        $("#btnAddProduct").removeClass("hidden").addClass("editing");
        $(this).addClass("disabled");
        $("#saveProduct").removeClass("disabled");
    });

    //保存产品信息修改
    $("#saveProduct").click(function () {
        $("#btnAddProduct").removeClass("editing").addClass("hidden");
        $("#table_products").find(".editing").removeClass("editing").addClass("hidden");
        $(this).addClass("disabled");
        $("#editProduct").removeClass("disabled");
    });

    //修改产品条目
    function editProductItem(data) {
        var taxRate = new Number(data.tax_rate);
        var price = new Number(data.price) * (new Number(data.discount) / 100) * (taxRate + 1);
        var totalPrice = price * (new Number(data.amount));

        $("#edit_item_id").val(data.product_id);
        $("#edit_item_name").val(data.name);
        $("#edit_item_oprice").val(data.price);
        $("#edit_item_discount").val(data.discount);
        $("#edit_item_tax").val(function(val){
            var rate = {
                '0': function () {
                    return 0;
                },
                '0.06': function () {
                    return 1;
                },
                '0.17': function () {
                    return 2;
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
        }(data.tax_rate));
        $("#edit_item_price").val(price.toFixed(2));
        $("#edit_item_amount").val(data.amount);
        $("#edit_item_tprice").val(totalPrice);
        $("#edit_item_ps").val(data.ps);
        
        $("#btnProductItemSubmit").click(data, function (e) {
            if($("#edit_item_id").val() !== e.data.product_id
                || $("#edit_item_disc").val() !== e.data.disc
                || $("#edit_item_oprice").val() !== e.data.orig_price
                || $("#edit_item_discount").val() !== e.data.discount
                || $("#edit_item_tax").val() !== (new Number(e.data.tax_rate) * 100)
                || $("#edit_item_amount").val() !== data.amount
                || $("#edit_item_ps").val() !== data.ps){

                $.ajax({
                    url: "../../php/quote_edit_product.php",
                    type: "POST",
                    data: $("#formProductItem").serialize() + "&productID=" + e.data.id + "&quote=" + number,
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
            $("#modalEditProductItem").modal('hide');
            setTimeout("location.reload();", 1000);

    });

        $("#modalEditProductItem").modal('show');
    }

    //添加一行产品
    $("#btnAddProduct").click(function () {
        $("#edit_item_id").val('');
        $("#edit_item_name").val('');
        $("#edit_item_oprice").val('0.00');
        $("#edit_item_discount").val('100');
        $("#edit_item_tax").val(0);
        $("#edit_item_price").val('0.00');
        $("#edit_item_amount").val(0);
        $("#edit_item_tprice").val('0.00');
        $("#edit_item_ps").val('');
        $("#btnProductItemSubmit").unbind().click(function () {
            $.ajax({
                url: "../../php/quote_edit_product.php",
                type: "POST",
                data: $("#formProductItem").serialize() + "&quote=" + number,
                success: function(data){
                    if (data === "0"){
                        alertMsg("已保存，添加成功", "success");
                    }
                    else{
                        alertMsg("添加失败", "danger");
                    }
                }
            });
        });
        $("#modalEditProductItem").modal('hide');
        setTimeout("location.reload();", 1000);
    });


    //打印
    $("#btnPrint").click(function () {
        window.open("quote_print.html?x=" + number + "&c=" + contact);
    });


    //自动计算
    $("#edit_item_oprice").change(autoCalculate);
    $("#edit_item_discount").change(autoCalculate);
    $("#edit_item_tax").change(autoCalculate);
    function autoCalculate() {
        var originalPrice = new Number($("#edit_item_oprice").val());
        var discount = new Number($("#edit_item_discount").val());
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
        }($("#edit_item_tax").val());
        var amount = new Number($("#edit_item_amount").val());
        var price = originalPrice * (discount / 100) * taxRate;
        $("#edit_item_price").val(price.toFixed(2));
        $("#edit_item_tprice").val((price * amount).toFixed(2));
    }

    //删除产品条目
    function deleteProductItem(id) {
        var okay = confirm('是否确定删除，删除后将无法恢复！');
        if (okay) {
            // 用户按下“确定”
            $.ajax({
                url: "../../php/quote_edit_product.php",
                type : "POST",
                data : {'delete': 1, 'productID': id, 'quote': number},
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

})();
