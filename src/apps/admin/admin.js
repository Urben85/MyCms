// ADMIN

// Libraries
import $ from 'jquery';

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
    Update: {
        ID: null,
        Title: null
    },
    Model: {
        ID: null,
        Name: null,
        About: null
    }
}

// Functions
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
                ModelForm();
                ModelsViewer();
                break;
            }
            case 'SETTINGS': {
                break;
            }
        }
    })
}

function UiEvents() {
    // UploadControl
    $(document).on('dragenter', '.UploadControl_DragDropArea', (e) => {         
        e.preventDefault();
        $(e.target).css('border','5px dashed #1BA1E2'); 
        return false; 
    })
    $(document).on('dragover', '.UploadControl_DragDropArea', (e) => {
        e.preventDefault();
        return false;
    })
    $(document).on('dragleave', '.UploadControl_DragDropArea', (e) => {
        e.preventDefault();
        $(e.target).css('border','5px dashed #FFF'); 
        return false; 
    })
    $(document).on('drop', '.UploadControl_DragDropArea', (e) => {
        e.preventDefault();
        $(e.target).css('border','5px dashed #FFF'); 
        return false; 
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
            case 'SettingsSaveBtn': {
                console.log('Settings Saved');
                break;
            }
        }
    })
}

function ModelForm() {
    if (ctx.Model.ID) {
        InitUploadControl($('div[type=Model_Avatar]'),'Drag & Drop here (JPG or PNG)');
    }
}

function ModelsViewer() {

}

function SaveModel() {
    Utilities.ShowLoading(true);

    if($('#Model_Name').val().trim() != '') {
        ctx.Model.Name = $('#Model_Name').val();
        ctx.Model.About = $('#Model_About').val();
        var method = (ctx.Model.ID) ? 'UpdateModel' : 'CreateModel';

        $.when(Utilities.PostData(method,JSON.stringify(ctx.Model))).then((result) => {
            Utilities.ShowLoading(false);

            if (result.startsWith('ERROR')) {
                console.log(result);
                Utilities.GeneralError();
            }
            else if (!ctx.Model.ID) {
                ctx.Model.ID = result;
                ModelForm();
            }
        }).fail(() => {
            Utilities.ShowLoading(false);
            Utilities.GeneralError();
        }); 
    }
    else
        alert('A Model must at least have a name.');
}

function InitUploadControl(container,text) {
    $(container).parent().fadeIn(500);
    if ($(container).find('.UploadControl_DragDropArea').length === 0) {
        var DragDropArea = $('<div>').addClass('UploadControl_DragDropArea').html(text);
        var ProgressBar = $('<progress>').addClass('UploadControl_ProgressBar').attr({'value':'0','max':'100'});
        var Loading = $('<div>').addClass('UploadControl_Loading');
        var Status = $('<div>').addClass('UploadControl_Status');
        var FilesList = $('<ul>').addClass('UploadControl_FilesList');
        $(container).append(DragDropArea,ProgressBar,Loading,Status,FilesList);
    }
    else {
        // Load Files
    }
}