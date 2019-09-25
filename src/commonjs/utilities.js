// GENERAL-UTILITIES

// Libraries
import $ from 'jquery';

export default class {
    static ShowLoading(show) {
        show ? $('#Loading').fadeIn(500) : $('#Loading').fadeOut(500);
    }

    static GeneralError() {
        alert('Sorry something went wrong :-(');
    }

    static GetData(method, param1) {
        return $.ajax({
            type: "GET",
            dataType: "text",
            url: "php/services.php",
            data: { function:method, param1:param1 }
        });
    }

    static PostData(method, param1) {
        return $.ajax({
            type: "POST",
            dataType: "text",
            url: "php/services.php",
            data: { function:method, param1:param1 }
        });
    }

    static CreateThumbnails(folder) {
        return $.ajax({
            type: "POST",
            dataType: "text",
            url: `php/upload.php?Folder=${folder}&Thumbs=true`
        });
    }
}