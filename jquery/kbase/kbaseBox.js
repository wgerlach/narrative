/*

    Easy widget to serve as a container with a title.

    var $box = $('#box').kbaseBox(
        {
            title : 'This is a box',
            canCollapse: true,  //boolean. Whether or not clicking the title bar collapses the box
            content: 'Moo. We are a box.',  //The content within the box. Any HTML string or jquery element
            //optional list of controls to populate buttons on the right end of the title bar. Give it an icon
            //and a callback function.
            controls : [
                {
                    icon : 'icon-search',
                    callback : function(e) {
                        console.log("clicked on search");
                    }
                },
                {
                    icon : 'icon-minus',
                    callback : function(e) {
                        console.log("clicked on delete");
                    }
                },
            ],
        }
    );

    alternatively, set it up or change it after the fact.

    $('#tabs').kbaseTabs('setTitle', 'New box title');
    $('#tabs').kbaseTabs('setContent', "I'm a big billy goat, so you'd better beat it, sister");
    $('#tabs').kbaseTabs('setControls', newControls);  //the tabObject defined up above

*/

(function( $, undefined ) {


    $.kbWidget("kbaseBox", 'kbaseWidget', {
        version: "1.0.0",
        options: {
            canCollapse : true,
            controls : [],
        },

        init: function(options) {

            this._super(options);

            this.appendUI( $( this.$elem ) );

            return this;

        },

        appendUI : function ($elem) {
            var canCollapse = this.options.canCollapse;
            var $div = $('<div></div>')
                .css('border', '1px solid lightgray')
                .css('padding', '2px')
                .append(
                    $('<h5></h5>')
                        .addClass('text-left')
                        .css('background-color', 'lightgray')
                        .css('padding', '2px')
                        .css('margin', '0px')
                        .css('position', 'relative')
                        .bind('click',
                            function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                if (canCollapse) {
                                    $(this).parent().children().last().collapse('toggle');
                                }
                            }
                        )
                        .append(
                            $('<span></span>')
                                .attr('id', 'title')
                        )
                        .append(
                            $('<div></div>')
                            .addClass('btn-group')
                            .attr('id', 'control-buttons')
                            .css('right', '0px')
                            .css('top', '0px')
                            .css('position', 'absolute')
                            .append('foo, bar, baz')
                        )
                )
                .append(
                    $('<div></div>')
                        .attr('id', 'content')
                )

            ;

            this._rewireIds($div, this);

            this.setControls(this.options.controls);
            this.setTitle(this.options.title);
            this.setContent(this.options.content);

            $elem.append($div);

            return this;

        },

        setTitle : function (title) {
            this.data('title').empty();
            this.data('title').append(title);
        },

        setContent : function (content) {
            this.data('content').empty();
            this.data('content').append(content);
        },

        setControls : function (controls) {
            this.data('control-buttons').empty();

            $.each(
                controls,
                $.proxy(function (idx, val) {

                    var btnClass = 'btn btn-mini';
                    if (val.type) {
                        btnClass = btnClass + ' btn-' + val.type;
                    }

                    var $button =
                        $('<button></button>')
                            .attr('href', '#')
                            .css('padding-top', '1px')
                            .css('padding-bottom', '1px')
                            .attr('class', btnClass)
                            .append($('<i></i>').addClass(val.icon))
                            .bind('click',
                                function(e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    val.callback.call(this, e);
                                }
                            )
                    ;
                    this.data('control-buttons').append($button);
                },this)
            );

        },


    });

}( jQuery ) );
