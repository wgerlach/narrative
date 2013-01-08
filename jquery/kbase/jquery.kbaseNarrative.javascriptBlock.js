/*


*/


(function( $, undefined ) {


    $.widget("kbaseNarrative.javascriptBlock", $.kbaseNarrative.narrativeBlock, {
        version: "1.0.0",
        options: {
            name : 'COMMAND',
            blockType : 'javascriptBlock',
            outputTruncate : 2000,
            fields : [],
            inputType   : [],
            outputType  : ['*'],
        },

        _init: function() {
            if (this.options.client) {
                this.client = this.options.client;
            }
            else if (this.options.clientClass) {
                this.client = clientSingleton[this.options.clientClass];
            }

            this.clientClass = this.options.clientClass;

            this._super();
        },

        blockDefinition : function() {
        console.log("BLOCK DEF HERE FOR " + this.clientClass);
            var def = this._super();

            def.clientClass = this.clientClass;

            return def;
        },

        run : function() {

            if (this.narrative) {

                this.leaveErrorState();

                this.data('command-lastrun').removeData('timeago');
                this.data('command-lastrun').attr('datetime', (new Date).toJSON())
                this.data('command-lastrun').timeago('refresh');

                this.appendRunningUI();

                var command = this.options.name + "_async";


                if (this.options.inputType.length) {
                    //erm. What does it mean to get input from an earlier command?
                    /*var $before = $(this.element).prev();

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
                        else {
                            $before = $before.prev();
                        }
                    }
                    */
                }

                console.log("RUNS COMMAND " + command);
                console.log(this.client);

                var args = this.data('command-interface').formBuilder('getFormValues');
                console.log("ARGS");console.log(args);

                //tack on the success and failure callbacks.
                args.push(
                    $.proxy(
                        function (res) {
                        console.log("GOT RESULTS");
                        console.log(res);
                            this.appendOutputUI(JSON.stringify(res, null, 4));
console.log(this.options.id);console.log(this.narrative.user_id);
                            this.narrative.client.put_file_async(
                                this.narrative.user_id,
                                this.options.id,
                                JSON.stringify(res, null, 4),
                                this.narrative.wd,
                                function(res) {console.log("UPLOAD");console.log(res)},
                                function (err) { console.log("FILE FAILURE"); console.log(err) }
                            );

                        },
                        this
                    ),
                    $.proxy(
                        function(res) {
                        console.log("GOT ERROR");
                        console.log(res);
                            this.appendOutputUI(JSON.stringify(res));
                            this.enterErrorState();
                            this.narrative.save();
                        },
                        this
                    )
                );

                this.client[command].apply(this.client, args);

            }

        },

    });

}( jQuery ) );
