/*


*/


(function( $, undefined ) {


    $.kbWidget("kbaseNarrativeInvocationBlock", 'kbaseNarrativeBlock', {
        version: "1.0.0",
        options: {
            type : 'invocation',
            outputTruncate : 2000,
            fields :
                [
                    {
                        name    : 'args',
                        key     : 'args',
                        label   : 'args',
                        type    : 'string',
                        valOnly : 1,
                    },
                ],
            inputType   : ['*'],
            outputType  : ['*'],
            links : [],
            lastRun : (new Date).toJSON(),
        },

        init : function (options) {

            var metaFunc = MetaToolInfo(options.command);

            if (metaFunc != undefined) {
                //console.log(options);
                //console.log(metaFunc);
                var meta = metaFunc(options.command);
                for (key in meta) {
                    options[key] = meta[key];
                }
            }

            if (options.label == undefined) {
                options.label = options.command;
            }

console.log("I HAZ OPTIONS");console.log(options);

            return this._super(options);
        },

        commandString : function() {
            var args = this.data('command-interface').formBuilder('getFormValuesAsString');

            return [this.options.name, args].join(' ');
        },

        appendUI : function ($elem) {

            var $interface = $('<div></div>').kbaseFormBuilder(
                {
                    elements                : this.options.fields,
                    values                  : this.options.values,
                    returnArrayStructure    : this.options.returnArrayStructure
                }
            );

            $interface.$elem.attr('id', 'command-interface');

            var $content = $('<div></div>')
                .append(
                    $('<div></div>')
                        .css('width', '100%')
                        .css('font-size', '75%')
                        .css('color', 'gray')
                        .addClass('text-right')
                        .append('Last run : ')
                        .append(
                            $('<time></time>')
                                .attr('id', 'command-lastrun')
                                .attr('datetime', this.options.lastRun)
                                .css('width', '159px')  //hardwired cuz this is crazy
                                .css('height', '11px')  //hardwired cuz this is crazy
                                .append(this.options.lastRun)
                        )
                )
                .append(
                    $interface.$elem
                )
            ;

            var $box = $('<div></div>').kbaseBox(
                {
                    title : this.options.label,
                    canCollapse: false,
                    content: $content,
                    controls : [
                        {
                            icon : 'icon-link',
                            callback : function(e) {
                                console.log("clicked on link");
                            },
                            id : 'link'
                        },
                        {
                            icon : 'icon-play',
                            callback : function(e, $box) {
                                console.log("clicked on run");
                                $box.startThinking();
                            },
                            id : 'run'
                        },
                        {
                            icon : 'icon-remove',
                            callback : $.proxy(function(evt) {
                                    evt.stopPropagation();
                                    evt.preventDefault();
                                    console.log("CLICKED BUTTON");

                                    var $deleteModal = $('<div></div>').kbaseDeletePrompt(
                                        {
                                            name     : this.options.label,
                                            callback : $.proxy( function (e, $prompt) {
                                                $prompt.closePrompt();
                                                this.$elem.remove();
                                                this.narrative.save();
                                            }, this)
                                        }
                                    );
                                    $deleteModal.openPrompt();

                                }, this),
                            id : 'remove'
                        },
                    ],
                }
            );

            this._rewireIds($box.$elem, this);

            $elem.append($box.$elem);

            return this;
        },

        blockDefinition : function() {
            return {
                command : this.options.command,
                type    : this.options.type,
                id      : this.options.id,
                values  : this.data('command-interface').kbaseFormBuilder('getFormValues'),
                fields  : this.options.fields,
                name    : this.options.name,
                outputTruncate : this.options.outputTruncate,
                inputType : this.options.inputType,
                outputType : this.options.outputType,
                //links : this.options.links,
                //lastRun : this.data('state') == 'error'
                //    ? undefined
                //    : this.data('command-lastrun').attr('datetime')
            };
        },

    });

}( jQuery ) );

/*
        ui : function(opts) {

            var $block = $('<div></div>')
                .attr('id', 'block')
                .attr('class', 'ui-widget-content ui-widget-content ui-corner-all')
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
                .append(
                    $('<div></div>')
                        .attr('style', 'margin-top : 1px;margin-bottom : 1px; width : 100%')
                        .append(
                            $('<ul></ul>')
                                .attr('id', 'cross-links')
                            )
                )
                .append($('<div></div>')
                    .attr('style', 'font-size : 50%; text-align : right; color : gray; clear : both')
                    .attr('id', 'output-type')
                    .append(this.options.outputType.join(' '))
                )
            ;

            this._rewireIds($block, this);

            this.appendInputUI();

            if (this.options.label == undefined) {
                this.options.label = this.options.name.replace(/_/g,' ');
            }

            this.data('command-name').text(this.options.label || this.options.name);

            $.timeago.settings.strings.prefixAgo = 'Last run: ';
            this.data('command-lastrun').timeago();

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

                                        if (this.data('running')) {
                                            this.data('command-name').spinner('remove');
                                        };
                                        $block.parent().remove();
                                        $deleteDialog.dialog('close');
                                        if (this.narrative != undefined) {
                                            this.narrative.save();
                                            this.narrative.reposition();
                                            // XXX temprary hack. Fix me!
                                            $('#commandcontext').commandcontext('refresh');
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

            this.data('gobutton').bind(
                'click',
                $.proxy(
                    function (evt) {

                        if (! this.data('running')) {

                            if (this.narrative != undefined) {
                                this.narrative.save();
                            }

                            this.run();
                        }

                        evt.stopPropagation();
                    },
                    this
                )
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

            var $linkDialog = $('<div></div>')
                .append(
                    $('<div></div>')
                        .attr('id', 'linkDialogContent')
                )
                .dialog(
                    {
                        title : 'Link to narrative',
                        autoOpen : false,
                        modal : true,
                        resizable: false,
                        buttons : {
                            Cancel : function () {
                                $( this ).dialog('close');
                            },
                            Link :
                                $.proxy(
                                    function() {

                                        var values = this.data('linkDialogContent').formBuilder('getFormValues');

                                        this.addLink(values[0][1], values[1][1]);

                                        $linkDialog.dialog('close');
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
            ;

            this._rewireIds($linkDialog, this);

            this.data('linkbutton').bind(
                'click',
                jQuery.proxy(function (evt) {

                    this.narrative.listNarratives(
                        jQuery.proxy(
                            function (filelist) {
                                var dirs = filelist[0];
                                var files = filelist[1];

                                this.data('linkDialogContent').empty();

                                var elements = [];

                                jQuery.each(
                                    dirs,
                                    function (idx, val) {
                                        elements.push(val['name']);
                                    }
                                );

                                this.data('linkDialogContent').formBuilder(
                                    {
                                            elements : [
                                                {
                                                    name : 'narrative',
                                                    key : 'narrative',
                                                    label : 'Narrative',
                                                    type : 'enum',
                                                    values : elements,
                                                    valOnly : 0,
                                                    multi : 0,
                                                },
                                                {
                                                    name : 'reason',
                                                    key : 'reason',
                                                    label : 'Reason',
                                                    type : 'text',
                                                },
                                            ]
                                    }
                                );
                            },
                            this
                        )

                    );

                    $linkDialog.dialog('open');
                }, this)
            );

            this.$deleteLinkDialog = $('<div></div>')
                .append(
                    $('<div></div>')
                        .text('Really delete link?')
                )
                .dialog(
                    {
                        title : 'Delete link to narrative',
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

                                        this.options.links.splice(this.data('deleteLinkIndex'), 1);

                                        var narrative = this.data('deleteLink');

                                        this.data('link-' + narrative).remove();

                                        jQuery.each(
                                            this.options.links,
                                            function (idx, val) {
                                                if (val == narrative) {
                                                    this.options.links.splice(idx, 1);
                                                    return;
                                                }
                                            }
                                        )

                                        this.$deleteLinkDialog.dialog('close');
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
            ;

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

        addLink : function(narrative, reason, previouslyLinked, idx) {
            if (! previouslyLinked) {
                this.options.links.push([narrative, reason]);
            }

            this.data('link-' + narrative, $('<li></li>')
                    .append(
                        $('<button></button>')
                            .append('Close\n')
                            .css({width : '19px', height : '18px'})
                            .button({text : false, icons : {primary : 'ui-icon-closethick'}})
                            .bind('click',
                                jQuery.proxy(function (e) {
                                    this.data('deleteLink', narrative);
                                    this.$deleteLinkDialog.dialog('open');
                                }, this)
                            )
                        )
                    .append(
                        $('<b></b>')
                            .text(' References: ')
                        )
                    .append(
                        $('<a></a>')
                            .attr('href', '#')
                            .text(narrative)
                            .bind('click',
                                jQuery.proxy( function(e) {
                                    //XXX this is hardwired to an assumed function. Refactor this!
                                    var f = $("#workspaces").data("addTab");

                                    var res = f(narrative);
                                }, this)
                            )
                        )
                    .append($('<br></br>'))
                    .append(
                        $('<i></i>')
                            .text(reason)
                        )
            );

            this.data('cross-links').append(this.data('link-' + narrative));


        },

        prompt : function() {

            var $promptDialog = $('<div></div>')
                //.append('Really delete block?')
                .append(this.data('command-interface'))
                .dialog(
                    {
                        title : this.options.label || this.options.name,
                        autoOpen : false,
                        modal : true,
                        resizable: false,
                        minWidth : 500,
                        buttons : {
                            Cancel :
                                $.proxy(
                                    function () {
                                        console.log(this);
                                        this.data('promptDialog').dialog('close');
                                    },
                                    this
                                ),
                            Add :
                                $.proxy(
                                    function() {
                                        this.data('promptDialog')._addedCommand = 1;

                                        this.data('output-type').before(this.data('command-interface'));
                                        this.data('promptDialog').dialog('close');
                                    },
                                    this
                                ),
                            'Add and Run' :
                                $.proxy(
                                    function () {
                                        this.data('promptDialog')._addedCommand = 1;
                                        this.data('output-type').before(this.data('command-interface'));
                                        this.data('promptDialog').dialog('close');
                                        this.run();
                                    },
                                    this
                                ),
                        },
                        open :  function () {
                            this._addedCommand = 0;
                            $('button:last', $(this).parent()).focus();
                        },
                        close : $.proxy( function() {
                            if (! this.data('promptDialog')._addedCommand) {
                                this.data('block').parent().remove();
                                this.data('promptDialog')._addedCommand = 0;
                            }
                            this.narrative.reposition();
                        }, this)

                    }
            );

            this.data('promptDialog', $promptDialog)
            $(".ui-dialog-titlebar-close", $promptDialog).hide();

            $promptDialog.dialog('open');

        },

        run : function() {

            if (this.narrative) {

                this.leaveErrorState();

                this.data('command-lastrun').removeData('timeago');
                this.data('command-lastrun').attr('datetime', (new Date).toJSON())
                this.data('command-lastrun').timeago('refresh');

                this.appendRunningUI();

                var command = this.commandString();


                if (this.options.inputType.length) {
                    var $before = $(this.element).prev();

                    while ($before.length) {
                        if ($before.data('blockType') == 'narrativeBlock') {
                            if ($before.narrativeBlock('data', 'state') == 'error') {
                                this.enterErrorState();
                                this.appendOutputUI("Cannot run - input block is in error condition");
                                return;
                            }
                            command += ' < ' + $before.narrativeBlock('id') + ' ';
                            break;
                        }
                        else if ($before.data('blockType') == 'dataBlock') {
                            command += ' < ' + $before.dataBlock('filePath') + ' ';
                            break;
                        }
                        else {
                            $before = $before.prev();
                        }
                    }
                }

                if (this.options.id) {
                    command += ' > ' + this.options.id + ' ';
                }
                //console.log("RUNS COMMAND " + command);
                this.narrative.client.run_pipeline_async(
                    this.narrative.user_id,
                    command,
                    [],
                    undefined,
                    this.narrative.wd,
                    $.proxy(
                        function (res) {
                            //console.log(res);
                            if (res[1][0] != undefined && ! res[1][0].match(/ 0$/)) {
                                var errorMsg = res[1].join("");
                                this.appendOutputUI(errorMsg);
                                this.enterErrorState();
                                this.narrative.save();
                            }
                            else {

                                if (res[1].length > 1) {
                                    this.appendOutputUI(res[1][1]);
                                }
                                else {

                                    this.narrative.client.get_file_async(
                                        this.narrative.user_id,
                                        this.options.id,
                                        this.narrative.wd,
                                        $.proxy(
                                            function (res) {
                                                this.appendOutputUI(res);
                                                this.narrative.save();
                                            },
                                            this
                                        ),
                                        function (err) { console.log("FILE FAILURE"); console.log(err) }
                                    );
                                }
                            }

                        },
                        this
                    ),
                    function (err) { console.log("RUN FAILURE"); console.log(err) }
                );


            }

        },
        inputType : function () {
            return this.options.inputType;
        },

        outputType : function () {
            return this.options.outputType;
        },

*/
