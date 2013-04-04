/*


*/

(function( $, undefined ) {


    $.kbWidget("kbaseNarrativeDataBrowser", 'kbaseIrisFileBrowser', {
        version: "1.0.0",
        options: {
            'name' : 'Uploaded data',
            'root' : '/',
            'controls' : true,
            'externalControls' : true,
            'height' : '110px',
            'tallHeight' : '450px',
            'shouldToggleNavHeight' : true,
            'controlButtons' : ['deleteButton', 'viewButton', 'uploadButton', 'addDataButton','addDirectoryButton' ],
        },

        addDataButton : function() {
            return this.data('addDirectoryButton') != undefined
                ? this.data('addDirectoryButton')
                : $('<a></a>')
                    .attr('id', 'addDirectoryButton')
                    .addClass('btn btn-mini')
                    .append($('<i></i>').addClass('icon-arrow-right'))
                    .attr('title', 'Add data to narrative')
                    .tooltip()
                    .bind('click',
                        $.proxy( function(e) {
                            e.preventDefault();
                            if (! this.addDirectoryButton().hasClass('disabled')) {
                                this.addDirectory();
                            }
                        }, this)
                    )
        },

    });

}( jQuery ) );
