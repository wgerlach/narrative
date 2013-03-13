/*


*/

(function( $, undefined ) {


    $.kbWidget("kbasePrompt", 'kbaseWidget', {
        version: "1.0.0",
        options: {
            controls : ['cancelButton', 'okayButton']
        },

        init: function(options) {

            this._super(options);

            return this;

        },

        openPrompt : function() {
            this.dialogModal().modal({'keyboard' : true});
        },
        closePrompt : function() {
            this.dialogModal().modal('hide');
        },

        cancelButton : function() {
            return {
                name: 'Cancel',
                callback : function (e, $prompt) {
                    $prompt.closePrompt();
                }
            }
        },
        okayButton : function() {
            return {
                name: 'Okay',
                callback : function (e, $prompt) {
                    $prompt.closePrompt();
                }
            }
        },

        dialogModal : function () {

            if (this.data('dialogModal') != undefined) {
                return this.data('dialogModal');
            }

            var $dialogModal =
                $('<div></div>')
                    .attr('class', 'modal hide fade')
                    .attr('tabindex', '-1')
                    .append(
                        $('<div></div>')
                            .attr('class', 'modal-header')
                            .append(
                                $('<button></button>')
                                    .attr('type', 'button')
                                    .attr('class', 'close')
                                    .attr('data-dismiss', 'modal')
                                    .attr('aria-hidden', 'true')
                                    .append('x\n')
                            )
                            .append(
                                $('<h3></h3>')
                                    .attr('id', 'title')
                            )
                    )
                    .append(
                        $('<div></div>')
                            .attr('class', 'modal-body')
                            .attr('id', 'body')
                    )
                .append(
                    $('<div></div>')
                        .attr('class', 'modal-footer')
                        .append(
                            $('<div></div>')
                                .addClass('row-fluid')
                                .addClass('form-horizontal')
                                .append(
                                    $('<div></div>')
                                    .addClass('span6')
                                    .addClass('text-left')
                                    .attr('id', 'footer')
                                )
                                .append(
                                    $('<div></div>')
                                        .addClass('span4 offset2')
                                        .attr('id', 'controls')
                                )
                        )
                )
            ;

            $dialogModal.unbind('keypress');
            $dialogModal.keypress(function(e) {
                if (e.keyCode == 13) {
                    e.stopPropagation();
                    e.preventDefault();
                    $('a:last', $dialogModal).trigger("click");
                }
            });

            //$deleteModal.modal({'keyboard' : true});

            this._rewireIds($dialogModal, $dialogModal);

            if (this.options.title) {
                $dialogModal.data('title').append(this.options.title);
            }

            if (this.options.body) {
                $dialogModal.data('body').append(this.options.body);
            }

            if (this.options.footer) {
                $dialogModal.data('footer').append(this.options.footer);
            }

            var $prompt = this;

            $.each(
                this.options.controls,
                function (idx, val) {
                    if (typeof val == 'string') {
                        val = $prompt[val]();
                    }
                    var btnClass = 'btn';
                    if (val.primary) {
                        btnClass = btnClass + ' btn-primary';
                    }

                    var $button =
                        $('<a></a>')
                            .attr('href', '#')
                            .attr('class', btnClass)
                            .append(val.name)
                            .bind('click',
                                function(e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    val.callback.call(this, e, $prompt);
                                }
                            )
                    ;

                    if (val.id) {
                        $button.attr('id', val.id);
                    }

                    $dialogModal.data('controls').append($button);
                }
            )

            this._rewireIds($dialogModal, $dialogModal);


            this.data('dialogModal', $dialogModal);

            return $dialogModal;

        },

    });

}( jQuery ) );
