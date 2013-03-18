/*


*/


(function( $, undefined ) {


    $.kbWidget("kbaseNarrativeBlock", 'kbaseWidget', {
        version: "1.0.0",
        options: {
            blockType : '',
            name      : 'COMMAND',
            links     : []
        },

        init: function(options) {
            this._super(options);

            if (this.options.narrative == undefined) {
                throw "Cannot create block w/o narrative";
            }
            this.narrative = this.options.narrative;
            this.id = this.options.id;

            this.appendUI( this.$elem );

            if (this.options.output) {
                this.appendOutputUI(this.options.output);
            }

            this.$elem.data('blockType', this.options.type);

            /*jQuery.each(
                this.options.links,
                jQuery.proxy (function (idx, val) {
                    this.addLink(val[0], val[1], 1, idx);
                }, this)
            );*/

            return this;
        },

        commandString : function() {
            var args = this.data('command-interface').formBuilder('getFormValuesAsString');

            return [this.options.name, args].join(' ');
        },

        appendUI : function ( $elem ) {

            var $content = $('<div></div>')
                .append("this is an empty narrative block");

            var $block = $('<div></div>').kbaseBox(
                {
                    title : this.options.command,
                    content : $content
                }
            );

            this._rewireIds($block.$elem, this);

            $elem.append($block);

            return this;

        },

        /*activate : function() {
            this.data('block').css('border', '1px solid green');
            this.data('command-header').css('background-color', 'green');
            this.data('command-header').css('background-image', 'none');
            this.data('state', 'active');

            if (this.options.activateCallback) {
                this.options.activateCallback(this);
            }
        },

        enterErrorState : function() {
            this.data('block').css('border', '1px solid red');
            this.data('command-header').css('background-color', 'red');
            this.data('command-header').css('background-image', 'none');
            this.data('state', 'error');
        },

        leaveErrorState : function() {
            this.data('block').css('border', '');
            this.data('command-header').css('background-color', '');
            this.data('command-header').css('background-image', '');
            this.data('state', 'inactive');
        },

        deactivate : function() {
            this.data('block').css('border', '');
            this.data('command-header').css('background-color', '');
            this.data('command-header').css('background-image', '');
            this.data('state', 'inactive');

            if (this.options.deactivateCallback) {
                this.options.deactivateCallback(this);
            }

        },

        appendInputUI : function() {
            this.data('running', 0);
            this.data('command-name').spinner('remove');
            this.data('command-interface').slidingPanel();
            this.data('command-interface').slidingPanel('remove');

            if (! this.data('input-initialized')) {
                this.data('command-interface').formBuilder(
                    {
                        elements                : this.options.fields,
                        values                  : this.options.values,
                        returnArrayStructure    : this.options.returnArrayStructure
                    }
                );
                this.data('input-initialized', 1);
            }

            this.data('gobutton').removeAttr('disabled');
            $('input', this.data('block')).each(
                function (idx, val) {
                    $(val).removeAttr('disabled');
                }
            );
        },

        appendOutputUI : function(output) {
            this.appendInputUI();
            this.data('output', output);
            if (output != undefined) {
                this.data('command-interface').slidingPanel({
                    content : output,
                    truncate : this.options.outputTruncate,
                    autoOpen : true
                });
            }
        },

        output : function() {
            return this.data('output');
        },

        appendRunningUI : function() {
            this.appendInputUI();
            this.data('command-name').spinner({ position : 'right', hide: false, img : './jquery/spinner/spinner.gif'});
            this.data('gobutton').attr('disabled', 'disabled');
            this.data('running', 1);
            $('input', this.data('block')).each(
                function (idx, val) {
                    $(val).attr('disabled', 'disabled');
                }
            );
        },*/

        blockDefinition : function() {

            return {
                values : this.data('command-interface').formBuilder('getFormValues'),
                blockType    : this.options.blockType,
                id      : this.options.id,
                fields  : this.options.fields,
                name    : this.options.name,
                outputTruncate : this.options.outputTruncate,
                inputType : this.options.inputType,
                outputType : this.options.outputType,
                links : this.options.links,
                lastRun : this.data('state') == 'error'
                    ? undefined
                    : this.data('command-lastrun').attr('datetime')
            };
        },

    });

}( jQuery ) );
