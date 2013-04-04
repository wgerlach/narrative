/*


*/


(function( $, undefined ) {


    $.kbWidget("kbaseNarrativeInvocationBlock", 'kbaseNarrativeCommandBlock', {
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
        },

        commandString : function() {
            var args = this.data('command-interface').kbaseFormBuilder('getFormValuesAsString');
            return [this.options.command, args].join(' ');
        },

        blockInterface : function() {
            var $interface = $('<div></div>').kbaseFormBuilder(
                {
                    elements                : this.options.fields,
                    values                  : this.options.values,
                    returnArrayStructure    : this.options.returnArrayStructure
                }
            );

            $interface.$elem.attr('id', 'command-interface');

            return $interface;
        },

        runButton : function() {
            return {
                icon : 'icon-play',
                id : 'run',
                callback : $.proxy(function(e, $box) {
                    if (! this.running) {
                        this.appendOutput(undefined);
                        this.running = true;
                        console.log("clicked on run");
                        $box.startThinking();
                        this.data('command-lastrun').empty();
                        this.data('command-lastrun').append((new Date).toJSON());
                        console.log(this.commandString());

                        var command = this.commandString();

                        if (this.options.inputType.length) {
                            var $before = this.$elem.prev();

                            while ($before.length) {
                                if ($before.data('blockType') == 'invocation') {
                                    if ($before.kbaseNarrativeInvocationBlock('data', 'state') == 'error') {
                                        this.enterErrorState();
                                        this.appendOutputUI("Cannot run - input block is in error condition");
                                        return;
                                    }
                                    command += ' < ' + $before.kbaseNarrativeInvocationBlock('outputFile') + ' ';
                                    break;
                                }
                                else if ($before.data('blockType') == 'data') {
                                    command += ' < ' + $before.dataBlock('filePath') + ' ';
                                    break;
                                }
                                else {
                                    $before = $before.prev();
                                }
                            }
                        }


                        var command = command + ' > ' + this.outputFile();

                        console.log(command);

                        this.narrative.client.run_pipeline_async(
                            this.narrative.user_id,
                            command,
                            [],
                            undefined,
                            this.narrative.wd,
                            $.proxy(
                                function (res) {
                                    //console.log(res);
                                    this.running = false;
                                    $box.stopThinking();
                                    if (res[1][0] != undefined && ! res[1][0].match(/ 0$/)) {
                                        //var errorMsg = res[1].join("");
                                        //this.appendOutputUI(errorMsg);
                                        //this.enterErrorState();
                                        //this.narrative.save();
                                    }
                                    else {
console.log(res);
                                        if (res[1].length > 1) {
                                            //this.appendOutputUI(res[1][1]);
                                            console.log("GOT RES " + res[1][1]);
                                            this.appendOutput(res[1][1]);
                                        }
                                        else {
                                            this.loadFile();
                                        }
                                    }

                                },
                                this
                            ),
                            function (err) { console.log("RUN FAILURE"); console.log(err) }
                        );


                    }
                    else {
                        $box.stopThinking();
                        this.running = false;
                    }
                }, this),
            }
        },


    });

}( jQuery ) );
