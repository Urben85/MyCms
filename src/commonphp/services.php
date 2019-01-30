<?php 
$config = include('config.php');

// POST
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['function']) && !empty($_POST['function']))
    PostEventHandler();
// GET
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['function']) && !empty($_GET['function']))
    GetEventHandler();

#region Post-Get-Event-Handlers
function PostEventHandler() {
    $function = $_POST['function'];
    switch($function) {
        case 'CreateModel' : CreateModel();break;
        case 'UpdateModel' : UpdateModel();break;
    }
}
function GetEventHandler() {
    $function = $_GET['function'];
    //switch($function) {
    //    case 'FunctionName' : FunctionName();break;
    //}
}
#endregion Post-Get-Event-Handlers

/*function PrototypeFunction() {
    global $config;
    $PostParam = $_POST['param1'];
    $GetParam = $_GET['param1'];

    try {
        // Code
    }
    catch (Exception $ex) {
        echo "ERROR: ".$ex->getMessage();
    }
}*/

#region Models
function CreateModel() {
    global $config;
    $model = json_decode($_POST['param1'],true);

    try {
        $pdo = new PDO(
            "mysql:host=".$config['host'].";dbname=".$config['DB_Name'], 
            $config['DB_User'], 
            $config['DB_Pw']
        );

        $cmd = $pdo->prepare("INSERT INTO ".$config['TBL_Models']." (Name,About) VALUES (?,?)");
        $cmd->execute(array($model['Name'],$model['About']));
        $id = $pdo->lastInsertId();
        mkdir("../../models/".$id,0777,true);
        echo $id;
    }
    catch (Exception $ex) {
        echo "ERROR: ".$ex->getMessage();
    }
}
function UpdateModel() {
    global $config;
    $model = json_decode($_POST['param1'],true);

    try {
        $pdo = new PDO(
            "mysql:host=".$config['host'].";dbname=".$config['DB_Name'], 
            $config['DB_User'], 
            $config['DB_Pw']
        );

        $cmd = $pdo->prepare("UPDATE ".$config['TBL_Models']." SET Name = :New_Name, About = :New_About WHERE ID = :id");
        $cmd->execute(array('id' => $model['ID'], 'New_Name' => $model['Name'], 'New_About' => $model['About']));
    }
    catch (Exception $ex) {
        echo "ERROR: ".$ex->getMessage();
    }
}
#endregion Models
?>