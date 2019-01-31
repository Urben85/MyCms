// ADMIN

// Libraries
import $ from 'jquery';
require('datatables.net')();

// Common
import Utilities from '../../commonjs/utilities';

// Document Ready Event
$(document).ready(() => {
    // Init Navigation
    Navigation();
    // Init UI Events
    UiEvents();
    // Load Updates on load
    $('#UPDATES').click();
})
// Context
var ctx = {
    DataTable: null,
    Update: {
        ID: null,
        Title: null,
        Description: null,
        PublishDate: null,
        Public: null,
        Folder: null
    },
    Model: {
        ID: null,
        Name: null,
        About: null,
        Customs: null,
        Avatar: null
    },
    Paths: {
        Models: '../../models/'
    }
}
// General Functions
function Navigation() {
    $(document).on('click','.w3-bar-item',(e) => {
        var navId = ($(e.target).attr('id')) ? $(e.target).attr('id') : $(e.target).parent().attr('id');
        var areaId = navId + '_Area';
        // Handle NavItem
        $('#' + navId).removeClass('w3-hover-black').addClass('w3-black');
        if ($('#' + navId).hasClass('MainNav')) {
            $('.MainNav').removeClass('w3-black');
            $('#' + navId).addClass('w3-black');
        }
        // Handle Content
        $('.w3-content').hide();
        $('#' + areaId).fadeIn(500);
        // Load Areas
        switch(navId) {
            case 'UPDATES': {
                break;
            }
            case 'MODELS': {
                ModelNewForm();
                ModelsListView();
                break;
            }
            case 'SETTINGS': {
                break;
            }
        }
    })
}
function UiEvents() {
    // ListView
    $(document).on('click','.ListView tbody tr',(e) => {
        var data = ctx.DataTable.row($(e.target).parents('tr')).data();
        ctx.Model.ID = data.ID;
        
        if (data.Type === 'Model') 
            ModelEditForm();
    } );
    // UploadControl
    $(document).on('dragenter','.UploadControl_DragDropArea',(e) => {         
        e.preventDefault();
        $(e.target).css('border','3px dashed #1BA1E2'); 
        return false; 
    })
    $(document).on('dragover','.UploadControl_DragDropArea',(e) => {
        e.preventDefault();
        return false;
    })
    $(document).on('dragleave','.UploadControl_DragDropArea',(e) => {
        e.preventDefault();
        $(e.target).css('border','3px dashed #FFF'); 
        return false; 
    })
    $(document).on('drop','.UploadControl_DragDropArea',(e) => {
        e.preventDefault();
        $(e.target).css('border','3px dashed #FFF'); 
        FileUploadHandler(e);
    })
    $(document).on('click','.UploadControl_DeleteFile',(e) => {
        var FileList = $(e.target).parent().parent().parent();
        var li = $(e.target).parent().parent();
        var Folder = $(e.target).parent().parent().parent().parent().attr('folder');
        var File = $(e.target).parent().attr('file');
        // Delete File
        $.when(Utilities.PostData('DeleteFile',encodeURIComponent(Folder + '/' + File))).then((result) => {
            if (result.startsWith('ERROR')) {
                console.log(result);
                Utilities.GeneralError();
            }
            else
                li.fadeOut(500,() => { 
                    li.remove();
                    if (FileList.children().length === 0)
                        FileList.fadeOut(500); 
                });
        }).fail(() => {
            Utilities.GeneralError();
        });
    })
    // Save Buttons on Click
    $(document).on('click','.myButton',(e) => {
        var id = $(e.target).attr('id');
        switch(id) {
            case 'UpdateSaveBtn': {
                console.log('Update Saved');
                break;
            }
            case 'ModelSaveBtn': {
                SaveModel();
                break;
            }
            case 'ModelNewBtn': {
                ModelNewForm();
                break;
            }
            case 'SettingsSaveBtn': {
                console.log('Settings Saved');
                break;
            }
        }
    })
}
// ListView
function InitListView(table,data,columns,order) {
    ctx.DataTable = $(table).DataTable({
        data: data,
        order: order,
        columns: columns,
        buttons: ['Delete']
    });
}
function CreateAndReturnTableForListView(selector,columns) {
    var table = $('<table>');
    var thead = $('<thead>');
    var tr = $('<tr>');
    $(columns.split(';')).each((index,column) => {
        tr.append(
            $('<th>').html(column)
        );
    })
    tr.append('<th>');
    table.append(thead.append(tr));
    var tbody = $('<tbody>');
    table.append(tbody);
    $(selector).empty().append(table);
    return $(selector).find('table');
}
// Upload Control
function InitUploadControl(container,path,types,max,thumbs,text) {
    var Control = $(container).attr({'folder':path,'types':types,'max':max,'thumbs':thumbs});
    var Loading = $('<div>').addClass('UploadControl_Loading');
    var FilesList = $('<ul>').addClass('UploadControl_FilesList');
    // Render Control
    if ($(container).find('.UploadControl_DragDropArea').length === 0) {
        var DragDropArea = $('<div>').addClass('UploadControl_DragDropArea').html(text);
        var ProgressBar = $('<progress>').addClass('UploadControl_ProgressBar').attr({'value':'0','max':'100'});  
        var Status = $('<div>').addClass('UploadControl_Status');
        Control.append(DragDropArea,ProgressBar,Loading,Status,FilesList);
    }
    Control.parent().fadeIn(500);
    GetAndRenderFiles(Control);
}
function ControlLoading(selector,show) {
    var control = $(selector).empty();
    if (show)
        control.append('<i class="fas fa-circle-notch fa-spin ControlLoading">');
}
function GetAndRenderFiles(Control) {
    // Get and Render Files
    var path = Control.attr('folder');
    var FilesList = Control.find('.UploadControl_FilesList').empty().fadeOut(500);
    var Loading = Control.find('.UploadControl_Loading');
    ControlLoading(Loading,true);
    $.when(Utilities.GetData('GetFilesByPath',encodeURIComponent(path))).then((result) => {
        ControlLoading(Loading,false);

        if (result.startsWith('ERROR')) {
            console.log(result);
            Utilities.GeneralError();
        }
        else { // Render Files
            if (result.split(';').length != 0 && result != 'false') {
                $(result.split(';')).each((index,file) => {
                    var filepath = path + '/' + file;
                    var li = $('<li>');
                    var a = $('<a>').attr({'href':filepath,'target':'_blank'}).html(file);
                    var del = $('<span>').addClass('UploadControl_DeleteFile').attr({file:file}).html('<i class="far fa-trash-alt"></i>');
                    li.append(a,del);
                    FilesList.append(li);
                });
                FilesList.fadeIn(500);
            }
        }
    }).fail(() => {
        ControlLoading(Loading,false);
        Utilities.GeneralError();
    });
}
function FileUploadHandler(e) {
    // Get Control Properties
    var Control = $(e.target).parent();
    var Folder = Control.attr('folder');
    var Types = Control.attr('types');
    var Max = parseInt(Control.attr('max'));
    var Thumbs = (Control.attr('thumbs') === 'true') ? true : false;
    // Get Files
    var Files = e.originalEvent.dataTransfer.files;
    if (CheckFiles()) {
        // Get Control Elements
        var DropArea = Control.find('.UploadControl_DragDropArea').fadeOut(500);
        var FileList = Control.find('.UploadControl_FilesList').empty().fadeOut(500);
        var ProgressBar = Control.find('progress').fadeIn(500);
        var Loading = Control.find('.UploadControl_Loading');
        var Status = Control.find('.UploadControl_Status').fadeIn(500);
        // Form Data
        var MyFormData = new FormData();
        // Append Files to FormData
        for (var i = 0; i < Files.length; i++) {
            var file = Files[i];
            MyFormData.append('files[]',file);
        }
        // Build Ajax Object
        var url = 'php/upload.php?Folder=' + Folder;
        var ajax = new XMLHttpRequest();
        ajax.upload.addEventListener('progress',ProgressHandler,false);
        ajax.addEventListener('load',CompleteHandler,false);
        ajax.addEventListener('error',ErrorHandler,false);
        ajax.addEventListener('abort',AbortHandler,false);
        ajax.open('POST',url,true);
        // Send Ajax Request
        ajax.send(MyFormData);
        // EventListeners
        function ProgressHandler(e) {
            var percent = Math.round((e.loaded / e.total) * 100);
            ProgressBar.val(percent);
            Status.html(percent + '% uploaded...please wait');
        }
        function CompleteHandler(e) {
            ProgressBar.val(0).fadeOut(500);
            Status.fadeOut(500,() => {
                DropArea.fadeIn(500);
                GetAndRenderFiles(Control);
            });
        }
        function ErrorHandler(e) {
            Status.empty().html('Upload failed :-(');
        }
        function AbortHandler(e) {
            Status.empty().html('Upload aborted')
        }
    }
    // Tools
    function CheckFiles() {
        var FileList = Control.find('.UploadControl_FilesList');
        if (FileTypesAllowed()) {
            var UploadedFileCount = FileList.children().length;
            var FilesCount = Files.length;
            
            if (UploadedFileCount >= Max || FilesCount > Max) {
                alert('Sorry you only upload ' + Max + ' file(s) here :-(');
                return false;
            }
            else
                return true;
        }
        else {
            alert('Sorry this filetype is not allowed here :-(');
            return false;
        }

        function FileTypesAllowed() {
            var allowed = false;
            if (Types != '*') {
                $(Files).each((fileIndex,file) => {
                    $(Types.split(';')).each((typeIndex,type) => {
                        if (file.type == type)
                            allowed = true;
                    });
                });
                return allowed;
            }
            else
                return true;
        }
    }
}
// Models Functions
function ModelNewForm() {
    ctx.Model.ID = null;
    $('#MODEL_Form').find('.EditFormOnly').fadeOut(500);
    $('#MODEL_Area_Title').html('NEW MODEL');
    $('#Model_Name').val('');
    $('#Model_About').val('');
    $('#Model_Avatar').empty();
}
function ModelEditForm() {
    if (ctx.Model.ID) {
        Utilities.ShowLoading(true);
        $.when(Utilities.GetData('GetModelByID',ctx.Model.ID)).then((result) => {
            Utilities.ShowLoading(false);

            if (result.startsWith('ERROR')) {
                console.log(result);
                Utilities.GeneralError();
            }
            else {
                ctx.Model = JSON.parse(result);
                // Fill out Form
                $('#MODEL_Form').find('.EditFormOnly').fadeIn(500);
                $('#MODEL_Area_Title').html('EDIT: ' + ctx.Model.Name);
                $('#Model_Name').val(ctx.Model.Name);
                $('#Model_About').val(ctx.Model.About);
                InitUploadControl(
                    $('#Model_Avatar'),
                    ctx.Paths.Models + ctx.Model.ID,
                    'image/jpg;image/jpeg;image/png',
                    1,
                    false,
                    'Drag & Drop here (JPG or PNG)'
                );
            }
        }).fail(() => {
            Utilities.ShowLoading(false);
            Utilities.GeneralError();
        }); 
    }
    else
        ModelNewForm();
}
function SaveModel() {
    if($('#Model_Name').val().trim() != '') {
        ctx.Model.Name = $('#Model_Name').val();
        ctx.Model.About = $('#Model_About').val();
        var method = (ctx.Model.ID) ? 'UpdateModel' : 'CreateModel';

        Utilities.ShowLoading(true);
        $.when(Utilities.PostData(method,JSON.stringify(ctx.Model))).then((result) => {

            if (result.startsWith('ERROR')) {
                console.log(result);
                Utilities.GeneralError();
            }
            else if (!ctx.Model.ID)
                ctx.Model.ID = result;

            ModelEditForm();
            ModelsListView();
        }).fail(() => {
            Utilities.ShowLoading(false);
            Utilities.GeneralError();
        }); 
    }
    else
        alert('A Model must at least have a name.');
}
function ModelsListView() {
    $.when(Utilities.GetData('GetAllModels')).then((result) => {
        if (result.startsWith('ERROR')) {
            console.log(result);
            Utilities.GeneralError();
        }
        else {
            var Table = CreateAndReturnTableForListView($('#MODELS_ListView').empty(),'Avatar;Name');
            var Models = JSON.parse(result);
            var Order = [[ 1, "asc" ]];
            var Columns = [
                { 
                    data: null,
                    orderable: false,
                    render: (data,type,row) => {
                        if (data.Avatar)
                            return $('<img>').addClass('w3-image').attr('src',ctx.Paths.Models + data.ID + '/' + data.Avatar)[0].outerHTML;
                        else
                            return $('<i>').css('font-size','50px').addClass('fas fa-user')[0].outerHTML;

                    } 
                },
                { data: 'Name' },
                { 
                    data: null,                             
                    orderable: false,
                    render: () => {
                        return $('<div>').addClass('DeleteModel').html('<i class="far fa-trash-alt"></i>')[0].outerHTML;
                    }
                }
            ];
            InitListView(Table,Models,Columns,Order);
        }
    }).fail(() => {
        Utilities.GeneralError();
    }); 
}