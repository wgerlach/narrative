/*


*/


(function( $, undefined ) {


    $.widget("kbaseNarrative.narrative", $.kbase.widget, {
        version: "1.0.0",
        options: {
            name : 'New Narrative',
            blockCounter : 0,
        },

        makeNarrativesDirCallback : function (results) {
console.log("WD " + this.wd);
            this.client.list_files_async(
                this.user_id,
                '/',
                this.wd,
                jQuery.proxy(this.listNarrativesCallback, this),
                jQuery.proxy(this.listNarrativesErrorCallback, this)
            );

        },

        listNarrativesCallback : function (res) {

            var savedNarrative = this.client.get_file_async(
                this.user_id,
                'narrative.data',
                this.wd,
                jQuery.proxy(
                    function (savedNarrative) {
                        var instructions = JSON.parse(savedNarrative);

                        this.options.blockCounter = instructions.blockCounter;
                        this.options.name = instructions.name;
                        this.user_id = instructions.owner;
                        this.wd = instructions.wd;

                        $.each(
                            instructions.elements,
                            $.proxy(
                                function(idx, val) {
                                    val.noSave = true;
                                    if (val.blockType == 'comment') {
                                        this.addComment(
                                            {
                                                value   : val.comment,
                                                id      : val.id,
                                            }
                                        );
                                    }
                                    else if (val.blockType == 'dataBlock') {
                                        this.addDataBlock(
                                            {
                                                file   : val.file,
                                                id      : val.id,
                                            }
                                        );
                                    }
                                    else {

                                        var $block = this.addBlock(val);

                                        this.client.get_file_async(
                                            this.user_id,
                                            val.id,
                                            this.wd,
                                            $.proxy(
                                                function (res) {
                                                    this[val.blockType]('appendOutputUI', res);
                                                },
                                                $block
                                            ),
                                            function (err) { console.log("FILE FAILURE"); console.log(err) }
                                        );

                                    }
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

        listNarrativesErrorCallback : function (e) {
            this.client.make_directory_async(
                this.user_id,
                '/',
                this.wd,
                jQuery.proxy(
                    function (res) {
                        this.addComment(
                            {
                                'value' : 'Click on a command on the left to add it to the queue.\nDrag and drop to re-arrange if you forgot something!'
                            }
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

        _create : function() {
            this.client = this.options.client;

            this.user_id = window.$ld.login('session').user_id;
            this.wd = '/narratives/' + this.options.name;

            this.appendUI( $( this.element ) );

            if (this.options.output) {
                this.appendOutputUI(this.options.output);
            }
console.log(this.user_id);
            this.client.make_directory_async(
                this.user_id,
                '/',
                'narratives',
                jQuery.proxy(this.makeNarrativesDirCallback, this),
                jQuery.proxy(this.makeNarrativesDirCallback, this)
            );

            $(window).bind(
                'resize',
                $.proxy(
                    function(evt) {
                        this.reposition(evt);
                    },
                    this
                )
            );

            $(this.element).data('isNarrative', 1);

            //THIS IS A TEMPORARY HACK!
            setTimeout(function() {$('#commandcontext').commandcontext('refresh')}, 500);

            return this;
        },

        save : function() {
            var output = {
                name            : this.options.name,
                wd              : this.wd,
                owner           : this.user_id,
                blockCounter    : this.options.blockCounter,
                elements        : [],
            };

            $.each(
                this.data('workspace').children(),
                function (idx, val) {
                    var blockType = $(val).data('blockType');
                    if ($(val)[blockType]) {
                    console.log("BLOCK DEF" + blockType);
                        output.elements.push($(val)[blockType]('blockDefinition'));
                    }
                }
            );

            var json = JSON.stringify(output);
console.log("SAVES " + json);
            this.client.put_file_async(
                this.user_id,
                'narrative.data',
                json,
                this.wd,
                function (e) {console.log("SAVED");},
                jQuery.proxy(this.errorCallback, this)
            );
        },

        generateBlockID: function () {
            return this.options.name + '-' + this.options.blockCounter++;
        },

        addBlock : function(options) {

            if (options == undefined) {
                options = {};
            }

            if (options.activateCallback == undefined) {
                options.activateCallback = $.proxy( this.blockActivateCallback, this);
            }
            if (options.deactivateCallback == undefined) {
                options.deactivateCallback = $.proxy( this.blockDeactivateCallback, this);
            }

            if (options.id == undefined) {
                options.id = this.generateBlockID();
            }

            //if (options.blockType == undefined) {
            //    options.blockType = 'narrativeBlock';
            //}

            var $target = undefined;
            if (options.target) {
                $target = options.target;
                options.target = undefined;
            }

            var prompt = 0;
            if (options.prompt) {
                prompt = options.prompt;
                options.prompt = undefined;
            }

            if (options.blockOptions) {
                for (prop in options.blockOptions) {
                    options[prop] = options.blockOptions[prop];
                }
                options.blockOptions = undefined;
            }

            options.narrative = this;
console.log("OPTS");console.log(options);
            var metaFunc = MetaToolInfo(options.name);

            if (metaFunc != undefined) {
            console.log(options);
            console.log(metaFunc);
                var meta = metaFunc(options.name);
                for (key in meta) {
                    options[key] = meta[key];
                }
            }
console.log("ADDS WITH OPTIONS"); console.log(options);
            var $block = $('<div></div>')[options.blockType](options);

            if ($target) {
                $target.replaceWith($block);
            }
            else if (this.data('activeBlock')) {
                this.data('activeBlock').element.after($block);
            }
            else {
                this.data('workspace').append($block);
            }

            if (! options.noSave) {
                this.save();
            }

            $block[options.blockType]('reposition');

            //THIS IS A TEMPORARY HACK!
            $('#commandcontext').commandcontext('refresh');

            $('html, body').animate({
                scrollTop: $block.offset().top
            }, 450);

            if (prompt) {
                $block[options.blockType]('prompt');
            }

            return $block;
        },

        addComment : function(options) {

            if (options == undefined) {
                options = {};
            }

            if (options.id == undefined) {
                options.id = this.generateBlockID();
            }

            options.narrative = this;

            var $comment = $('<div></div>').comment(options);

            if (this.data('activeBlock')) {
                this.data('activeBlock').element.after($comment);
            }
            else {
                this.data('workspace').append($comment);
            }

            if (! options.noSave) {
                this.save();
            }

            return $comment;
        },

        addDataBlock : function(options) {

            if (options == undefined) {
                options = {};
            }

            if (options.id == undefined) {
                options.id = this.generateBlockID();
            }

            options.narrative = this;

            var $dataBlock = $('<div></div>').dataBlock(options);

            if (this.data('activeBlock')) {
                this.data('activeBlock').element.after($dataBlock);
            }
            else {
                this.data('workspace').append($dataBlock);
            }

            if (! options.noSave) {
                this.save();
            }

            return $dataBlock;
        },

        activeBlock : function () {
            if (this.data('activeBlock')) {
                return this.data('activeBlock');
            }
            else {
                return this.data('workspace').children().last();
            }
        },

        blockActivateCallback : function ($block) {

            if (this.data('activeBlock') != undefined) {
                this.data('activeBlock').deactivate();
            }

            this.data('activeBlock', $block);

            //THIS IS A TEMPORARY HACK!
            $('#commandcontext').commandcontext('refresh');

        },

        blockDeactivateCallback : function ($block) {
            this.data('activeBlock', undefined);

            //THIS IS A TEMPORARY HACK!
            $('#commandcontext').commandcontext('refresh');
        },

        appendUI : function($elem) {

            var $container = $elem
                .append(
                    $('<div></div>')
                        .attr('id', 'workspace')
                        .droppable(
                            {
                                accept : 'li',
                                activeClass : 'ui-state-hover',
                                hoverClass : 'ui-state-highlight',
                                tolerance : 'touch',
                            }
                        )
                        .sortable(
                            {
                                cancel: ':input,button,.editor',
                                sort :
                                    $.proxy (
                                        function(event, ui) {
                                            this.reposition();
                                        },
                                        this
                                    ),
                                stop :
                                    $.proxy(
                                        function (evt, ui) {
                                            var node = ui.item.get(0).nodeName.toLowerCase();
                                            if(node != 'div') {
                                                var command = $('a', ui.item).attr('title');
                                                this.addBlock({name : command, target : ui.item});
                                            };
                                            this.reposition();
                                        },
                                        this
                                    )
                            }
                        )
                        .addClass('kb-nar-narrative')
                        .css('padding', '5px')
                );

            this._rewireIds($container, this);

            return $container;

        },

        reposition : function(evt) {
            $.each(
                this.data('workspace').children(),
                function (idx, val) {
                    var blockType = $(val).data('blockType');
                    $(val)[blockType]('reposition');
                }
            );
        },


    });

}( jQuery ) );
