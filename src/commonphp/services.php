<?php 
$config = include('config.php');
$pdo = new PDO(
    "mysql:host=".$config['host'].";dbname=".$config['DB_Name'], 
    $config['DB_User'], 
    $config['DB_Pw']
);

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
        case 'DeleteFile' : DeleteFile();break;
    }
}
function GetEventHandler() {
    $function = $_GET['function'];
    switch($function) {
        case 'GetModelByID' : GetModelByID();break;
        case 'GetAllModels' : GetAllModels();break;
        case 'GetFilesByPath' : GetFilesByPath();break;
    }
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
    global $config,$pdo;
    $model = json_decode($_POST['param1'],true);

    try {
        $cmd = $pdo->prepare("INSERT INTO ".$config['TBL_Models']." (Name,About) VALUES (?,?,?)");
        $cmd->execute(array($model['Name'],$model['About'],$model['Customs']));
        $id = $pdo->lastInsertId();
        mkdir("../../models/".$id,0777,true);
        echo $id;
    }
    catch (Exception $ex) {
        echo "ERROR: ".$ex->getMessage();
    }
}
function UpdateModel() {
    global $config,$pdo;
    $model = json_decode($_POST['param1'],true);

    try {
        $cmd = $pdo->prepare("UPDATE ".$config['TBL_Models']." SET Name = :New_Name, About = :New_About, Customs = :New_Customs WHERE ID = :id");
        $cmd->execute(array('id' => $model['ID'], 'New_Name' => $model['Name'], 'New_About' => $model['About'], 'New_Customs' => $model['Customs']));
    }
    catch (Exception $ex) {
        echo "ERROR: ".$ex->getMessage();
    }
}
function GetModelByID() {
    global $config,$pdo;
    $modelID = $_GET['param1'];

    try {  
        $sql = "SELECT * FROM ".$config['TBL_Models']." WHERE ID = ".$modelID;
        $models = array();
        foreach ($pdo->query($sql) as $row) {
            $models[] = array(
                "Type" => 'Model',
                "ID" => $row['ID'], 
                "Name" => $row['Name'],
                "About" => $row['About'],
                "Customs" => $row['Customs'],
                "Avatar" => ReturnFilesByPath("../../models/".$row['ID'])
            );
        }
        $myJSON = json_encode($models[0]);
        echo $myJSON;
    }
    catch (Exception $ex) {
        echo "ERROR: ".$ex->getMessage();
    }
}
function GetAllModels() {
    global $config,$pdo;

    try {
        $sql = "SELECT * FROM ".$config['TBL_Models'];
        $models = array();
        foreach ($pdo->query($sql) as $row) {
            $models[] = array(
                "Type" => 'Model',
                "ID" => $row['ID'], 
                "Name" => $row['Name'],
                "About" => $row['About'],
                "Customs" => $row['Customs'],
                "Avatar" => ReturnFilesByPath("../../models/".$row['ID'])
            );
        }
        $myJSON = json_encode($models);
        echo $myJSON;
    }
    catch (Exception $ex) {
        echo "ERROR: ".$ex->getMessage();
    }
}
#endregion Models

#region File Management
function GetFilesByPath() {
    $path = urldecode($_GET['param1']);

    try {
        $files = ReturnFilesByPath($path);
        if ($files)
            echo $files;
        else
            echo json_encode($files);
    }
    catch (Exception $ex) {
        echo "ERROR: ".$ex->getMessage();
    }
}
function ReturnFilesByPath($path) {
    try {
        $files = array_diff(scandir($path),array('..', '.'));
        if (count($files) !== 0) {
            $arraystring = '';
            foreach($files as $file) {
                $arraystring .= $file.';';
            }
            return substr($arraystring, 0, -1);
        }
        else
            return false;
    }
    catch (Exception $ex) {
        echo "ERROR: ".$ex->getMessage();
    }
}
function DeleteFile() {
    $path = urldecode($_POST['param1']);

    try {
        unlink($path);
    }
    catch (Exception $ex) {
        echo "ERROR: ".$ex->getMessage();
    }
}
#endregion File Management
?>