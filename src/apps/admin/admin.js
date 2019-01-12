// ADMIN

// Libraries
import $ from 'jquery';

// Common
//import DomEvents from '../../../common/domevents';

// Document Ready Event
$(document).ready(() => {
    // Init Navigation
    Navigation();
    // Load Updates on load
    $('#UPDATES').click();
})

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
                break;
            }
            case 'SETTINGS': {
                break;
            }
        }
    })
}