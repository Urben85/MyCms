
<?php
// FILE UPLOAD
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['files'])) {
    $folder = $_GET['Folder'];
    try {
        $all_files = count($_FILES['files']['tmp_name']);
        for ($i = 0; $i < $all_files; $i++) {  
            $file_name = $_FILES['files']['name'][$i];
            $file_tmp = $_FILES['files']['tmp_name'][$i];
            $dest = $folder.'/'.$file_name;
            move_uploaded_file($file_tmp, $dest);
        }
    }
    catch (Exception $ex) {
        echo "ERROR: ".$ex->getMessage();
    }
}
?>