<?php
/**
 * Created by IntelliJ IDEA.
 * User: admin
 * Date: 2016/5/30
 * Time: 21:47
 */
include "comm.php";
include "conn.php";



if(isset($_POST['quote_id']))
{
    $quote_id = $_POST['quote_id'];
}
else
{
    exit("Get Quote ID Error");
}

if(isset($_POST['action']))
{
    $action = $_POST['action'];
}
else
{
    exit("Get Action Error");
}


switch ($action)
{
    case 'edit':
        if(isset($_POST['editList']))
        {
            $editList = json_decode($_POST['editList']);
        }
        else
        {
            echo "Get editList Error";
        }
        $data = new stdClass();
        $data -> tag = 'ok';
        $data -> errorList = array();
        foreach($editList as $id => $product)
        {
            $new_id = $product -> product_id;
            $new_name = $product -> name;
            $new_price = $product -> price;
            $new_discount = $product -> discount;
            $new_ps = $product -> ps;
            $new_tax = $product -> tax_rate;
            $new_amount = $product -> amount;

            $sql = "UPDATE `db_platform`.`quote_products` SET `product_id` = '{$new_id}', `name` = '{$new_name}', `price` = '{$new_price}', `discount` = '{$new_discount}', `tax_rate` = '{$new_tax}', `amount` = '{$new_amount}', `ps` = '{$new_ps}' WHERE `quote_products`.`id` = '{$id}' AND `quote_products`.`quote_id` = '{$quote_id}'";
            $mysqli -> query($sql);
            if(mysqli_affected_rows($mysqli) <= 0)
            {
                $data -> tag = 'error';
                $data -> errorList[] = $new_id;
            }
        }
        echo json_encode($data);
        break;

    case 'add':
//        $new_id = $_POST['id'];
//        $new_name = $_POST['name'];
//        $new_price = $_POST['price'];
//        $new_discount = $_POST['discount'];
//        $new_ps = $_POST['ps'];
//        $new_tax = $_POST['tax'];
//        $new_amount = $_POST['amount'];

        $rs_sql = $mysqli -> query("SELECT max(id) FROM quote_products WHERE quote_id = '{$quote_id}'");
        if($rs = mysqli_fetch_array($rs_sql))
        {
            $number = $rs[0] + 1;
        }
        else
        {
            exit("Search Error");
        }
        $sql = "INSERT INTO `db_platform`.`quote_products` (`id`, `product_id`, `quote_id`, `name`, `price`, `discount`, `tax_rate`, `amount`, `ps`) VALUES ('{$number}', '', '{$quote_id}', '', '0', '100', '0', '0', '')";
        $mysqli -> query($sql);
        if(mysqli_affected_rows($mysqli) <= 0)
        {
            exit("Add Quote's Product Error");
        }
        echo json_encode(array('tag' => 'ok', 'id' => $number));
        break;

    case 'delete':
        $id = $_POST['productID'];
        $sql = "DELETE FROM `db_platform`.`quote_products` WHERE `quote_products`.`id` = '{$id}' AND `quote_products`.`quote_id` = '{$quote_id}'";
        $mysqli -> query($sql);
        if(mysqli_affected_rows($mysqli) <= 0)
        {
            exit("Delete Quote Product Error");
        }
        echo '0';
        break;

    case 'add_list':
        if(isset($_POST['addList']))
        {
            $addList = json_decode($_POST['addList']);
        }
        else
        {
            echo "Get addList Error";
        }
        $data = new stdClass();
        $data -> tag = 'ok';
        $data -> errorList = array();
        foreach($addList as $id => $product)
        {
            $new_id = $product -> product_id;
            $new_name = $product -> name;
            $new_price = $product -> price;
            $new_discount = $product -> discount;
            $new_ps = $product -> ps;
            $new_tax = $product -> tax_rate;
            $new_amount = $product -> amount;

            $sql = "INSERT INTO `db_platform`.`quote_products` (`id`, `product_id`, `quote_id`, `name`, `price`, `discount`, `tax_rate`, `amount`, `ps`) VALUES ('{$id}', '{$new_id}', '{$quote_id}', '{$new_name}', '{$new_price}', '{$new_discount}', '{$new_tax}', '{$new_amount}', '{$new_ps}')";
            $mysqli -> query($sql);
            if(mysqli_affected_rows($mysqli) <= 0)
            {
                $data -> tag = 'error';
                $data -> errorList[] = $new_id;
            }
        }
        echo json_encode($data);
        break;

    case 'delete_list':
        if(isset($_POST['deleteList']))
        {
            $deleteList = json_decode($_POST['deleteList']);
        }
        else
        {
            echo "Get deleteList Error";
        }
        $data = new stdClass();
        $data -> tag = 'ok';
        $data -> errorList = array();
        foreach($deleteList as  $id)
        {
            $sql = "DELETE FROM `db_platform`.`quote_products` WHERE `quote_products`.`id` = '{$id}' AND `quote_products`.`quote_id` = '{$quote_id}'";
            $mysqli -> query($sql);
            if(mysqli_affected_rows($mysqli) <= 0)
            {
                $data -> tag = 'error';
                $data -> errorList[] = $id;
            }
        }
        break;

    default:
        break;



}
