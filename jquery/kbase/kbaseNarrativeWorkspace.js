/*


*/

(function( $, undefined ) {


    $.kbWidget("kbaseNarrativeWorkspace", 'kbaseTabs', {
        version: "1.0.0",
        options: {
            workspacetitle : 'd',
            narrativeRoot : '/narratives/',
        },

        init : function (options) {

            this._super(options);

            if (options.client) {
                this.client = options.client;
            }

            if (options.$loginbox) {
                this.$loginbox = options.$loginbox;
            }

            return this;
        },

        sessionId : function() {
            return this.$loginbox.sessionId();
        },

        listNarratives : function(callback) {

            var $that = this;

            this.client.list_files_async(
                this.sessionId,
                '/',
                this.options.narrativeRoot,
                $.proxy( function (files) {
                    var narratives = [];
                    try {
                        $.each(
                            files[0],
                            function (idx, val) {
                                narratives.push(val.name);
                            }
                        );
                    }
                    catch (e) {};

                    narratives = narratives.sort(this.sortCaseInsensitively);

                    if (callback != undefined) {
                        callback.call($that, narratives);
                    }
                }, this)
            );
        },

        appendUI : function ($elem, elements) {

            $elem.append(
                $('<div></div>')
                    .css('border', '1px solid lightgray')
                    .css('padding', '2px')
                    .append(
                        $('<h5></h5>')
                            .addClass('text-left')
                            .html('&nbsp;')
                            .css('background-color', 'lightgray')
                            .css('padding', '2px')
                            .css('margin', '0px')
                            .css('position', 'relative')
                            .bind('click',
                                function(e) {
                                    $(this).parent().children().last().collapse('toggle');
                                    if (that.options.fileBrowser) {
                                        that.options.fileBrowser.toggleNavHeight();
                                    }
                                }
                            )
                            .append(
                                $('<div></div>')
                                .css('right', '0px')
                                .css('top', '0px')
                                .css('position', 'absolute')
                                .append(
                                    $('<button></button>')
                                        .addClass('btn btn-mini')
                                        .append($('<i></i>').addClass('icon-plus'))
                                        .css('padding-top', '1px')
                                        .css('padding-bottom', '1px')
                                        .attr('title', 'Add a new narrative')
                                        .tooltip()
                                        .bind('click', $.proxy(function (e) {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            this.openNarrativeDialog();
                                        },this))
                                )
                        )
                    )
            );

            this._super($elem, elements);

        },

        showNarrative : function (tab) {
            this.showTab(tab);
        },

        openNarrativeDialog : function(narratives) {

        	if (this.data('openNarrativeDialog') == undefined) {
        	    this._createOpenNarrativeDialog();
        	}

        	if (narratives == undefined) {
        	    this.listNarratives ( this.openNarrativeDialog );
        	    return;
        	}

        	console.log('display narratives :'); console.log(narratives);

            $ond = this.data('openNarrativeDialog');

            $ond.data('select_narrative').empty();

            $.each(
                narratives,
                function (idx, val) {
                    $ond.data('select_narrative')
                        .append(
                            $('<option></option>')
                                .attr('value', val)
                                .text(val)
                        )
                }
            );

            $('form', $ond).get(0).reset();

            this.data('openNarrativeDialog').modal('show');
        },

        _createOpenNarrativeDialog : function () {

            var $elem = this.$elem;

            var $ond = $('<div></div>')
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
                                .append(' \n')
                        )
                        .append(
                            $('<h3></h3>')
                                .append('Open narrative\n')
                        )
                )
                .append(
                    $('<div></div>')
                        .attr('class', 'modal-body')
                        .append(
                            $('<p></p>')
                                .append(
                                    $('<form></form>')
                                        .attr('name', 'form')
                                        .attr('id', 'form')
                                        .addClass('form-horizontal')
                                        .append(
                                            $('<fieldset></fieldset>')
                                                .append(
                                                    $('<div></div>')
                                                        .attr('class', 'control-group')
                                                        .append(
                                                            $('<label></label>')
                                                                .addClass('control-label')
                                                                .attr('for', 'user_id')
                                                                .css('margin-right', '10px')
                                                                .append('New narrative:\n')
                                                        )
                                                        .append(
                                                            $('<input/>')
                                                                .attr('type', 'text')
                                                                .attr('name', 'new_narrative')
                                                                .attr('id', 'new_narrative')
                                                                .attr('size', '20')
                                                        )
                                                )
                                                .append(
                                                    $('<div></div>')
                                                        .addClass('text-center')
                                                        .text(' - or - ')
                                                )
                                                .append(
                                                    $('<div></div>')
                                                        .attr('class', 'control-group')
                                                        .append(
                                                            $('<label></label>')
                                                                .addClass('control-label')
                                                                .attr('for', 'user_id')
                                                                .css('margin-right', '10px')
                                                                .append('Select narrative:\n')
                                                        )
                                                        .append(
                                                            $('<select/>')
                                                                .attr('name', 'select_narrative')
                                                                .attr('id', 'select_narrative')
                                                        )
                                                )
                                                .append(
                                                    $('<div></div>')
                                                        .text(' - or - ')
                                                        .addClass('text-center')
                                                )
                                                .append(
                                                    $('<div></div>')
                                                        .attr('class', 'inputbox control-group')
                                                        .append(
                                                            $('<label></label>')
                                                                .addClass('control-label')
                                                                .attr('for', 'password')
                                                                .css('margin-right', '10px')
                                                                .append('Upload narrative:\n')
                                                        )
                                                        .append(
                                                            $('<input/>')
                                                                .attr('type', 'file')
                                                                .attr('name', 'upload')
                                                                .attr('id', 'upload')
                                                                .attr('size', '20')
                                                        )
                                                )
                                        )
                                )
                        )
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
                                )
                                .append(
                                    $('<div></div>')
                                        .addClass('span4 offset2')
                                    .append(
                                        $('<a></a>')
                                            .attr('href', '#')
                                            .attr('class', 'btn')
                                            .append('Cancel\n')
                                            .bind('click',
                                                function(e) {
                                                    $(this).closest('.modal').modal('hide');
                                                }
                                            )
                                    )
                                    .append(
                                        $('<a></a>')
                                            .attr('href', '#')
                                            .attr('id', 'addbutton')
                                            .attr('class', 'btn btn-primary')
                                            .append('Login\n')
                                            .bind('click',
                                                $.proxy( function(e) {
                                                    var user_id  = this.data('openNarrativeDialog').data('user_id').val();
                                                    var password = this.data('openNarrativeDialog').data('password').val();

                                                    this.data('openNarrativeDialog').trigger('message', user_id);

                                                    this.login(user_id, password, function(args) {

                                                        if (this.registerLogin) {
                                                            this.registerLogin(args);
                                                        }

                                                        if (this.options.login_callback) {
                                                            this.options.login_callback.call(this, args);
                                                        }
                                                    });

                                                },this)
                                            )
                                    )
                                )
                        )
                )
            ;
console.log('c1');
            this._rewireIds($ond, $ond);
console.log('c1');
            this.data('openNarrativeDialog', $ond);

            $ond.modal({'keyboard' : true, 'show' : false});
console.log('c2');
            $ond.on('shown',
                $.proxy(
                    function () {
                        var $ond = this.data('openNarrativeDialog');
                        $ond.data("user_id").focus();
                        if ($ond.data('user_id').val()) {
                            $ond.data('password').focus();
                        }
                    },
                    this
                )
            );
console.log('c3');
            return $ond;

        },


    });

}( jQuery ) );
