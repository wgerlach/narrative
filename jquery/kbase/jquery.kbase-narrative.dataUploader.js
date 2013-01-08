/*


*/


(function( $, undefined ) {


    $.widget("kbase-narrative.dataUploader", {
        version: "1.0.0",
        options: {
            link : function (evt) {
                alert("clicked on " + $(evt.target).text());
            }
        },

        _init: function() {

            this.appendUI( $( this.element ) );

            return this;

        },

        _rewireIds : function($elem, $target) {

            if ($target == undefined) {
                $target = $elem;
            }

            if ($elem.attr('id')) {
                $target.data($elem.attr('id'), $elem);
                $elem.removeAttr('id');
            }

            $.each(
                $elem.find('[id]'),
                function(idx) {
                    $target.data($(this).attr('id'), $(this));
                    $(this).removeAttr('id');
                    }
            );

            return $elem;
        },

        appendUI : function($elem) {

            var $block = $('<div></div>')
                .attr('id', 'block')
                .attr('class', 'ui-widget ui-widget-content ui-corner-all')
                .attr('style', 'padding : 5px; overflow : hidden; margin-bottom : 5px')
                .append($('<div></div>')
                    .attr('style', 'font-size : 50%; text-align : left; color : gray')
                    .attr('id', 'input-type')
                    .append(this.options.inputType.join(' '))
                )
                .append(
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
                                )*/
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
                )
            ;

            this._rewireIds($block, this);

            $elem.append($block);

        },


    });

}( jQuery ) );
