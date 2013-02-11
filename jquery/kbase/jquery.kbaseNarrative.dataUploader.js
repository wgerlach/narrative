/*


*/


(function( $, undefined ) {


    $.widget("kbaseNarrative.dataUploader", $.kbase.widget, {
        version: "1.0.0",
        options: {
            action : function (file) {
                alert("ACTION " + file);
            }
        },

        _create : function() {

            this.client = this.options.client;
        },

        makeNarrativeDataDirCallback : function (results) {
            this.listUploadedFiles();
        },

        listUploadedFiles : function () {
            this.client.list_files_async(
                this.user_id,
                '/',
                'narrative_data',
                jQuery.proxy(this.listNarrativeDataCallback, this),
                jQuery.proxy(this.errorCallback, this)
            );
        },

        viewUploadedFile: function(file) {

            this.client.get_file_async(
                this.sessionid,
                file,
                '/narrative_data',
                $.proxy(
                    function (res) {

                        try {
                            var obj = JSON.parse(res);
                            res = JSON.stringify(obj, undefined, 2);
                        }
                        catch(e) {}

                        res = res.replace(/</g, '&lt;');
                        res = res.replace(/>/g, '&gt;');

                        var boxContent = $('<div></div>')
                            .css('white-space', 'pre')
                            .css('padding', '3px')
                            .css('min-width', '400px')
                            .html(res);

                        this.data('panel').fancybox({
                            openEffect  : 'elastic',
                            closeEffect : 'elastic',
                            content : boxContent,
                        });
                        this.data('panel').trigger('click');
                    },
                    this
                ),
                function (err) { console.log("FILE FAILURE"); console.log(err) }
            );
        },

        listNarrativeDataCallback : function (res) {

            this.client.list_files_async(
                this.user_id,
                '/',
                'narrative_data',
                jQuery.proxy(
                    function (filelist) {
                        var dirs = filelist[0];
                        var files = filelist[1];

                        this.data('uploadedDataList').empty();

                        jQuery.each(
                            files,
                            jQuery.proxy(
                                function (idx, val) {
                                    this.data('uploadedDataList').append(
                                        $('<li></li>')
                                            .css('height', '18px')
                                            .css('margin-top', '1px')
                                            .css('margin-bottom', '1px')
                                            .append(
                                                $('<a></a>')
                                                    .attr('href', '#')
                                                    .text(val['name'])
                                                    .bind(
                                                        'click',
                                                        jQuery.proxy(
                                                            function (e) {
                                                                this.options.action(val['name']);
                                                            },
                                                            this
                                                        )
                                                    )
                                                )
                                            .append(
                                                $('<span></span>')
                                                    .css('float', 'right')
                                                    .append(
                                                        $('<button></button>')
                                                            .attr('id', 'inspectbutton')
                                                            .append('Inspect\n')
                                                            .css({width : '19px', height : '18px'})
                                                            .button({text : false, icons : {primary : 'ui-icon-search'}})
                                                            .bind(
                                                                'click',
                                                                jQuery.proxy(
                                                                    function(e) {
                                                                        this.viewUploadedFile(val['name']);
                                                                    },
                                                                    this
                                                                )
                                                            )
                                                        )
                                                    .append(
                                                        $('<button></button>')
                                                            .attr('id', 'deletebutton')
                                                            .append('Delete\n')
                                                            .css({width : '19px', height : '18px'})
                                                            .button({text : false, icons : {primary : 'ui-icon-closethick'}})
                                                            .bind(
                                                                'click',
                                                                jQuery.proxy(
                                                                    function(e) {
                                                                        this.data('deleteFile', val['name']);
                                                                        this.$deleteDialog.dialog('open');
                                                                        e.stopPropagation();
                                                                    },
                                                                    this
                                                                )
                                                            )
                                                        )
                                                )
                                        )
                                },
                                this
                            )
                        );
                     },
                     this
                 ),
                jQuery.proxy(this.errorCallback, this)
            );

        },

        errorCallback : function (e) {
            console.log(e);
        },

        _init: function() {

            // we only use this widget if we have the client side file uploading objects
            if (window.File && window.FileReader && window.FileList && window.Blob) {

                this.appendUI( $( this.element ) );

                $(window).bind(
                    'resize',
                    $.proxy(
                        function(evt) {
                            this.reposition(evt);
                        },
                        this
                    )
                );

                this.client.make_directory_async(
                    this.user_id,
                    '/',
                    'narrative_data',
                    jQuery.proxy(this.makeNarrativeDataDirCallback, this),
                    jQuery.proxy(this.makeNarrativeDataDirCallback, this)
                );

                this.reposition();
            }

            return this;

        },

        appendUI : function($elem) {

            var $block = $('<div></div>')
                .attr('id', 'block')
                .attr('class', 'ui-widget ui-widget-content ui-corner-all')
                .attr('style', 'padding : 5px; overflow : hidden; margin-bottom : 5px')
                .append(
                    $('<div></div>')
                        .attr('id', 'command-header')
                        .attr('class', 'ui-widget-header ui-corner-all')
                        .attr('style', 'padding : 5px; margin-top : 0px; height : 18px')
                        .append(
                            $('<h3></h3>')
                                .attr('style', 'position : absolute;')
                                .attr('id', 'command-name')
                                .text('Upload data')
                        )

                    )
                .append(
                    $('<ul></ul>')
                        .attr('id', 'uploadedDataList')
                        .css('height', '100px')
                        .css('overflow', 'scroll')
                    )
                .append(
                    $('<div></div>')
                        .css('text-align', 'right')
                        .append(
                            $('<input></input>')
                                .attr('type', 'file')
                                .attr('id', 'fileInput')
                                .css('visibility', 'hidden')
                                .button()
                        )
                        .append(
                            $('<button></button>')
                                .attr('id', 'uploadDataButton')
                                .text('Upload data')
                                .button()
                        )
                    )
                .append(
                    $('<div></div>')
                        .attr('id', 'panel')
                        .css('display', 'none')
                    )

/*                .append(
                    $('<div></div>')
                        .attr('id', 'command-header')
                        .attr('class', 'ui-widget-header ui-corner-all')
                        .attr('style', 'padding : 5px; margin-top : 0px; height : 18px')
                        .append(
                            $('<h3></h3>')
                                .attr('style', 'position : absolute;')
                                .attr('id', 'command-name')
                        )
                        .append(
                            $('<div></div>')
                                .attr('style', 'position : absolute; height : 18px; text-align : right; white-space : nowrap')
                                .attr('id', 'command-controls')
                                /*.append(
                                    $('<button></button>')
                                        .attr('id', 'noticebutton')
                                        .append('Drop\n')
                                        .css({width : '19px', height : '18px'})
                                        .button({text : false, icons : {primary : 'ui-icon-notice'}})
                                )
                                .append(
                                    $('<button></button>')
                                        .attr('id', 'stopbutton')
                                        .append('Stop\n')
                                        .css({width : '19px', height : '18px'})
                                        .button({text : false, icons : {primary : 'ui-icon-pause'}})
                                )* /
                                .append(
                                    $('<button></button>')
                                        .attr('id', 'linkbutton')
                                        .append('Link to narrative\n')
                                        .css({width : '19px', height : '18px'})
                                        .button({text : false, icons : {primary : 'ui-icon-link'}})
                                )
                                .append(
                                    $('<button></button>')
                                        .attr('id', 'gobutton')
                                        .append('Go\n')
                                        .css({width : '19px', height : '18px'})
                                        .button({text : false, icons : {primary : 'ui-icon-play'}})
                                )
                                .append(
                                    $('<button></button>')
                                        .attr('id', 'closebutton')
                                        .append('Close\n')
                                        .css({width : '19px', height : '18px'})
                                        .button({text : false, icons : {primary : 'ui-icon-closethick'}})
                                )
                        )
                        .append(
                            $('<time></time>')
                                .attr('style', 'text-align : right; font-size : 25%; position : absolute')
                                .attr('id', 'command-lastrun')
                                .attr('datetime', this.options.lastRun)
                                .css('width', '159px')  //hardwired cuz this is crazy
                                .css('height', '11px')  //hardwired cuz this is crazy
                        )
                )
                .append(
                    $('<div></div>')
                        .attr('style', 'margin-top : 5px;min-height : 150px; float : left; width : 100%;')
                        .attr('id', 'command-interface')
                )
                .append($('<div></div>')
                    .attr('style', 'font-size : 50%; text-align : right; color : gray; clear : both')
                    .attr('id', 'output-type')
                    .append(this.options.outputType.join(' '))
                )*/
            ;

            this._rewireIds($block, this);

            this.data('fileInput').bind('change', jQuery.proxy(this.handleFileSelect, this));

            this.data('uploadDataButton').bind(
                'click',
                jQuery.proxy(
                    function (evt) {
                        this.data('fileInput').trigger('click');
                    },
                    this
                )
            );

            this.$deleteDialog = $('<div></div>')
                .append('Really delete file?')
                .dialog(
                    {
                        title : 'Confirmation',
                        autoOpen : false,
                        modal : true,
                        resizable: false,
                        buttons : {
                            Cancel : function () {
                                $( this ).dialog('close');
                            },
                            Delete :
                                $.proxy(
                                    function() {

                                        this.$deleteDialog.dialog('close');

                                        this.client.remove_files_async(
                                            this.sessionId,
                                            '/narrative_data',
                                            this.data('deleteFile'),
                                            jQuery.proxy( function (res) { this.listUploadedFiles() }, this),
                                            this.errorCallback
                                            );


                                    },
                                    this
                                )
                        },
                        open :  function () {
                            $('button:last', $(this).parent()).focus();
                        }
                    }
                );

            //this.data('stopbutton').bind('click', $.proxy( function(evt) { this.data('gobutton').trigger('click'); evt.stopPropagation(); }, this) );
            //this.data('noticebutton').bind('click', $.proxy( function(evt) { this.data('gobutton').trigger('click'); evt.stopPropagation(); }, this) );

            $elem.append($block);

        },

        handleFileSelect : function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var files = evt.target.files
                || evt.originalEvent.dataTransfer.files
                || evt.dataTransfer.files;

            $.each(
                files,
                jQuery.proxy(
                    function (idx, file) {

                        var reader = new FileReader();

                        reader.onload = jQuery.proxy(
                            function(e) {

                                this.client.put_file_async(
                                    this.sessionId,
                                    file.name,
                                    e.target.result,
                                    '/narrative_data',
                                    jQuery.proxy( function (res) { this.listUploadedFiles() }, this),
                                    this.errorCallback
                                );
                            },
                            this
                        );

                        reader.readAsText(file);

                    },
                    this
                )
            );

        },

        reposition : function() {

            this.data('command-name').position({of : this.data('command-header'), my : 'center', at : 'center center'});

        }


    });

}( jQuery ) );
