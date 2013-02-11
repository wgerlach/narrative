/*


*/


(function( $, undefined ) {


    $.widget("kbaseNarrative.dataBlock", $.kbase.widget, {
        version: "1.0.0",
        options: {
            outputTruncate : 2000
        },

        _init: function() {

            this.narrative = this.options.narrative;

            this.element.append(this.ui(this.options.file));
            $(this.element).data('blockType', 'dataBlock');

            //$(window).trigger('resize');
            if (this.narrative) {
                this.narrative.reposition();
            }

            this.narrative.client.get_file_async(
                this.narrative.user_id,
                this.options.file,
                '/narrative_data',
                $.proxy(
                    function (res) {
                        if (res != undefined) {
                            this.data('output', res);
                            this.data('command-interface').slidingPanel({
                                content : res,
                                truncate : this.options.outputTruncate,
                                autoOpen : true
                            });
                        }
                        this.narrative.save();
                    },
                    this
                ),
                function (err) { console.log("FILE FAILURE"); console.log(err) }
            );

            return this;

        },

        output : function () {
            return this.data('output');
        },

        ui : function(file) {

            var $block = $('<div></div>')
                .attr('id', 'block')
                .attr('class', 'ui-widget-content ui-widget-content ui-corner-all')
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
                                .text('Data file')
                        )
                        .append(
                            $('<div></div>')
                                .attr('style', 'position : absolute; height : 18px; text-align : right; white-space : nowrap')
                                .attr('id', 'command-controls')
                                .append(
                                    $('<button></button>')
                                        .attr('id', 'closebutton')
                                        .append('Close\n')
                                        .css({width : '19px', height : '18px'})
                                        .button({text : false, icons : {primary : 'ui-icon-closethick'}})
                                )
                        )
                )
                .append(
                    $('<div></div>')
                        .attr('style', 'margin-top : 5px;min-height : 150px; float : left; width : 100%;')
                        .attr('id', 'command-interface')
                        .append(
                            $('<b></b>')
                                .text('Uploaded file: ')
                            )
                        .append(file)
                )
            ;

            this._rewireIds($block, this);

            //odd. Apparently I can't do this when the element isn't within the document. Moved down into re-position to set once
            //this.data('command-lastrun').css('width', this.data('command-lastrun').width());

            var $deleteDialog = $('<div></div>')
                .append('Really delete block?')
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

                                        $block.parent().remove();
                                        $deleteDialog.dialog('close');
                                        if (this.narrative != undefined) {
                                            this.narrative.save();
                                            this.narrative.reposition();
                                        }

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

            this.data('closebutton').bind(
                'click',
                function (evt) {
                    $deleteDialog.dialog('open');
                    evt.stopPropagation();
                }
            );

            this.data('command-header').bind('click',
                $.proxy(
                    function(evt) {
                        if (this.data('state') != 'active') {
                            this.activate();
                        }
                        else {
                            this.deactivate();
                        }

                    },
                    this
                )
            );

            return $block;


        },

        filePath : function() {
            return '/narrative_data/' + this.options.file;
        },

        blockDefinition : function() {
            return {
                file : this.options.file,
                blockType    : 'dataBlock',
                id      : this.options.id,
            };
        },

        reposition : function() {

            this.data('command-name').position({of : this.data('command-header'), my : 'left', at : 'left+5 center'});

            this.data('command-controls').position({of : this.data('command-header'), my : 'right', at : 'right-5 center'});

        },



    });

}( jQuery ) );
