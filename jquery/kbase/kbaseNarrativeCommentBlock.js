/*


*/


(function( $, undefined ) {


    $.kbWidget("kbaseNarrativeCommentBlock", 'kbaseNarrativeBlock', {
        version: "1.0.0",
        options: {
            blockType : 'comment',
            value : 'Type your comment here',
        },

        init: function(options) {
            this._super(options);

            return this;
        },

        appendUI : function ($elem) {

            var $block = $('<div></div>')
                .css('border', '1px dashed gray')
                .css('min-height', '50px')
                .css('margin-bottom', '5px')
                .append(
                    $('<div></div>')
                        .css('width', '100%')
                        .css('position', 'relative')
                        .css('height', '22px')
                        .append(
                            $('<button></button>')
                                .css('display', 'none')
                                .css('position', 'absolute')
                                .css('top', '0px')
                                .css('right', '0px')
                                .css('margin', '3px')
                                .addClass('btn btn-mini')
                                .append($('<i></i>').addClass('icon-remove'))
                                .bind('click',
                                    $.proxy(function(evt) {
                                        evt.stopPropagation();
                                        evt.preventDefault();
                                        console.log("CLICKED BUTTON");

                                        var $deleteModal = $('<div></div>').kbaseDeletePrompt(
                                            {
                                                name     : 'comment',
                                                callback : $.proxy( function (e, $prompt) {
                                                    $prompt.closePrompt();
                                                    this.$elem.remove();
                                                    this.narrative.save();
                                                }, this)
                                            }
                                        );
                                        $deleteModal.openPrompt();

                                    }, this)
                                )
                        )
                )
                .append(
                    $('<div></div>')
                        .css('padding', '3px')
                        .css('margin', '10px 10px 10px 10px')
                        .css('white-space', 'pre')
                        .attr('contenteditable', 'true')
                        .append(this.options.value)
                        .addClass('editor')
                        .css('color', 'gray')
                        .bind('blur', $.proxy(
                            function(evt) {
                                this.narrative.save();
                            },
                            this
                        ))
                )
                .mouseover(
                    function(e) {
                        $(this).children().first().children().first().show();
                    }
                )
                .mouseout(
                    function(e) {
                        $(this).children().first().children().first().hide();
                    }
                )

            $elem.append($block);

            return this;

        },

        comment : function() {
            return $('.editor', this.$elem).html();
        },

        blockDefinition : function() {
            return {
                value   : this.comment(),
                type    : this.options.type,
                id      : this.options.id,
            };
        },

    });

}( jQuery ) );
