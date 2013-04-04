/*


*/


(function( $, undefined ) {


    $.kbWidget("kbaseNarrativeCommandBlock", 'kbaseNarrativeBlock', {
        version: "1.0.0",
        options: {
            type : 'invocation',
            outputTruncate : 2000,
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
            this._super(options);

            this.loadFile();

            return this;
        },

        linkButton : function() {
            return {
                icon : 'icon-link',
                id : 'link',
                callback : function(e) {
                    alert("clicked on link");
                },
            };
        },

        runButton : function() {
            return {
                icon : 'icon-play',
                id : 'run',
                callback : function(e) {
                    alert("clicked on run");
                },
            };
        },

        removeButton : function() {
            return {
                icon : 'icon-remove',
                id : 'remove',
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
            }
        },

        controls : function() {
            return [
                this.linkButton(),
                this.runButton(),
                this.removeButton()
            ];
        },

        appendUI : function ($elem) {

            var $interface = this.blockInterface();

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
                    $('<div></div>')
                        .addClass('row')
                        .append(
                            $('<div></div>')
                                .addClass('span10')
                                .append($interface.$elem)
                        )
                        .append(
                            $('<div></div>')
                                .addClass('span2')
                                .append(
                                    $('<div></div>')
                                        .attr('id', 'output')
                                        .css('width', '100%')
                                        .css('height', '100px')
                                        .css('border', '1px solid green')
                                        .css('display', 'none')
                                        .css('font-size', '4px')
                                        .css('overflow', 'hidden')
                                        .bind('click',
                                            $.proxy(function (e) {
                                                $("<div></div>").kbaseIrisFileBrowser(
                                                    {
                                                        client    : this.narrative.client,
                                                        $loginbox : this.narrative.$loginbox
                                                    }
                                                ).openFile(this.narrative.wd + '/' + this.outputFile());
                                            },this)
                                        )
                                )
                        )
                )
            ;

            var $box = $('<div></div>').kbaseBox(
                {
                    precontent : this.options.inputType,
                    postcontent : this.options.outputType,
                    title : this.options.label,
                    canCollapse: false,
                    content: $content,
                    controls : this.controls(),
                    bannerCallback : $.proxy( function($box) {
                        if (this.activeBlock) {
                            $box.setBoxColor('green');
                            this.activeBlock = false;
                        }
                        else {
                            $box.setBoxColor($box.options.boxColor);
                            this.activeBlock = true;

                        }
                    }, this),
                }
            );

            this._rewireIds($box.$elem, this);

            $elem.append($box.$elem);

            return this;
        },

        loadFile : function() {
            this.narrative.client.get_file_async(
                this.narrative.user_id,
                this.options.id,
                this.narrative.wd,
                $.proxy(
                    function (res) {
                        this.appendOutput(res);
                    },
                    this
                )
                //function (err) { this.dbg("FILE FAILURE"); this.dbg(err) }
            );
        },

        appendOutput : function (results) {

            this.data('output').empty();

            this.data('output').css('display', results == undefined ? 'none' : 'block');

            if (results != undefined) {
                this.data('output').text(results.substr(results, this.options.outputTruncate));
            }
            this.output = results;
        },

        outputFile : function () {
            return this.options.id;
        },

        output : function() {
            return this.output;
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
