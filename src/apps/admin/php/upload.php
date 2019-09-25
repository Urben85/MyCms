
<?php
require_once './phpthumb/ThumbLib.inc.php';

// FILE UPLOAD
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['files']) && isset($_GET['Folder']) && !empty($_GET['Folder'])) {
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
// THUMBNAIL GENERATION
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['Thumbs']) && !empty($_GET['Thumbs']) && isset($_GET['Folder']) && !empty($_GET['Folder'])) {
    $folder = $_GET['Folder'];
    try {
            // Get all files of directory.
            $files = array_diff(scandir($folder),array('..', '.'));
            // Create thumbnails
            foreach ($files as $file) {
                $filePath = $folder.'/'.$file;
                // Create thumbnail
                $thumb = PhpThumbFactory::create($filePath);
                $thumb->resizePercent(intval(30));
                // Save thumbnail
                $dest = $folder.'_thumbs/'.$file;
                $thumb->save($dest);
            }
    }
    catch (Exception $ex) {
        echo "ERROR: ".$ex->getMessage();
    }
}
?>