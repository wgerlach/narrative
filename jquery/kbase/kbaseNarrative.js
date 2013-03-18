/*


*/


(function( $, undefined ) {


    $.kbWidget("kbaseNarrative", 'kbaseAuthenticatedWidget', {
        version: "1.0.0",
        options: {
            blockCounter : 0,
        },

        loadNarrative : function(instructions) {
console.log("LOADS NARRATIVE WITH");console.log(instructions);
            this.options.blockCounter = instructions.blockCounter;
            this.options.name = instructions.name;
            this.user_id = instructions.owner;
            this.wd = instructions.wd;

            $.each(
                instructions.elements,
                $.proxy(
                    function(idx, val) {
                        this.addBlock(val);
                        /*val.noSave = true;
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

                        }*/
                    },
                    this
                )
            );
        },

        name : function() {
            return this.options.name;
        },

        init : function(options) {
            this._super(options);

            if (this.options.name == undefined) {
                throw 'Cannot create narrative w/o name';
            }

            if (this.options.workspace == undefined) {
                throw 'Cannot create narrative w/o workspace';
            }

            if (this.options.client) {
                this.client = this.options.client;
            }

            this.wd = this.options.workspace.options.narrativeRoot + this.options.name;

            this.client.make_directory_async(
                this.user_id,
                '/',
                this.wd,
                $.proxy(this.makeDirectoryCallback, this),
                $.proxy(this.makeDirectoryCallback, this)
            );

            return this;
        },

        makeDirectoryCallback : function(r) {

            if (this.options.instructions) {
                this.loadNarrative(instructions);
            }
            else {

                this.client.get_file_async(
                    this.user_id,
                    'narrative.data',
                    this.wd,
                    //has one. Load it up
                    jQuery.proxy(
                        function (savedNarrative) {
                            var instructions = JSON.parse(savedNarrative);
                            this.loadNarrative(instructions);
                        },
                       this
                    ),
                    //doesn't have one. Create new.
                    $.proxy(function(e) {
                        this.addBlock(
                            {
                                'type'  : 'comment',
                                'value' : 'Click on a command on the left to add it to the queue.\nDrag and drop to re-arrange if you forgot something!'
                            }
                        );

                    }, this)
                );
            }

            if (this.options.output) {
                this.appendOutputUI(this.options.output);
            }

            $(this.element).data('isNarrative', 1);

            //THIS IS A TEMPORARY HACK!
            //setTimeout(function() {$('#commandcontext').commandcontext('refresh')}, 500);

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
                this.$elem.children(),
                $.proxy(function (idx, val) {
                    var blockType = $(val).data('blockType');
                    console.log(this);
                    console.log(val);
                    console.log(blockType);
                    var blockClass = this.classForBlockType(blockType);
                    console.log(blockClass);
                    if ($(val)[blockClass]) {
                        output.elements.push($(val)[blockClass]('blockDefinition'));
                    }
                }, this)
            );

            var json = JSON.stringify(output);
console.log(json);
            this.client.put_file_async(
                this.user_id,
                'narrative.data',
                json,
                this.wd,
                function (e) {},
                function (e) {console.log(e)}
            );
        },

        generateBlockID: function () {
            return this.options.name + '-' + this.options.blockCounter++;
        },

        classForBlockType : function (type) {
            return 'kbaseNarrative' + type.charAt(0).toUpperCase() + type.slice(1) + 'Block';
        },

        addBlock : function (options) {

            var type = this.classForBlockType(options.type);

            options.narrative = this;
            if (options.id == undefined) {
                options.id = this.generateBlockID();
            }
console.log('adding block with options : ' + options);
            var $block = $('<div></div>')[type](options);
            console.log("APPEND");console.log(this);console.log($block);
            this.$elem.append($block.$elem);
            console.log(this.$elem);
            console.log(this.$elem.get(0));
            return $block;
        },

        XXXaddBlock : function(options) {

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

            var metaFunc = MetaToolInfo(options.name);

            if (metaFunc != undefined) {
                //console.log(options);
                //console.log(metaFunc);
                var meta = metaFunc(options.name);
                for (key in meta) {
                    options[key] = meta[key];
                }
            }

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
console.log("AUTORUN : "); console.log($block.data('autorun'));
            if ($block.data('autorun')) {
                $block.run();
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



    });

}( jQuery ) );
