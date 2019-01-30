<?php
$config = [];
$config['host'] = '127.0.0.1:3306';
$config['DB_Name'] = 'd02d4189';
$config['DB_User'] = 'd02d4189';
$config['DB_Pw'] = 'HNwb9aCmBLGQK5pg';
$config['TBL_Settings'] = 'settings';
$config['TBL_Updates'] = 'updates';
$config['TBL_Models'] = 'models';

if (DBConnectionSuccessfull($config['host']) || DBConnectionSuccessfull('localhost:3306')) {
    GetConfigValues();
    return $config;
}
else {
    echo 'ERROR: DB Connection failed!';
    die;
}

function DBConnectionSuccessfull($host) {
    global $config;
    try {
        $pdo = new PDO('mysql:host='.$host.';dbname='.$config['DB_Name'],
            $config['DB_User'],
            $config['DB_Pw']
        );
        $config['host'] = $host;
        return true;
    }
    catch (Exception $ex) {
        return false;
    }
}
function GetConfigValues() {
    global $config;
    $pdo = new PDO('mysql:host='.$config['host'].';dbname='.$config['DB_Name'],
        $config['DB_User'],
        $config['DB_Pw']
    );
    $sql = "SELECT * FROM ".$config['TBL_Settings'];

    foreach($pdo->query($sql) as $row) {
        $config[$row['Code']] = $row['Value'];
    }
}
?>