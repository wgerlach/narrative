/*


*/

(function( $, undefined ) {


    $.kbWidget("kbaseNarrativeWorkspace", 'kbaseTabs', {
        version: "1.0.0",
        options: {
            narrativeRoot : '/narratives/',
            narrativeDataRoot : '/narrative_data/',
            canDelete : true,
            border : true,
            borderColor : 'lightgray',
        },

        init : function (options) {

            this._super(options);

            if (options.client) {
                this.client = options.client;
            }

            if (options.$loginbox) {
                this.$loginbox = options.$loginbox;
            }

            this._narratives = {};

            this.createNarrativesDirectories();

            return this;
        },

        narratives : function (narrative) {
        console.log("LOAD UP " + narrative);
        console.log(this._narratives);
            if (narrative) {
                return this._narratives[narrative];
            }
            else {
                return this._narratives;
            }
        },

        createNarrativesDirectories : function() {
            this.client.make_directory_async(
                this.sessionId(),
                '/',
                this.options.narrativeRoot.replace(/\/$/, '')
            );

            this.client.make_directory_async(
                this.sessionId(),
                '/',
                this.options.narrativeDataRoot.replace(/\/$/, '')
            );
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

            $ond.dialogModal().data('select_narrative').empty();

            $ond.dialogModal().data('select_narrative')
                .append(
                    $('<option></option>')
                        .text(' --- SELECT --- ')
                );

            $.each(
                narratives,
                function (idx, val) {
                    $ond.dialogModal().data('select_narrative')
                        .append(
                            $('<option></option>')
                                .attr('value', val)
                                .text(val)
                        )
                }
            );

            $('form', $ond.dialogModal()).get(0).reset();

            this.data('openNarrativeDialog').openPrompt();
        },

        _createOpenNarrativeDialog : function () {

            var $elem = this.$elem;

            var $ond = $('<div></div>').kbasePrompt(
                {
                    title : 'Add narrative',
                    body :
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
                                                            .attr('for', 'new_narrative')
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
                                                    .addClass('text-center')
                                                    .text(' - or - ')

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
                    ,
                controls : [
                    'cancelButton',
                    {
                        name : 'Add narrative',
                        id : 'addbutton',
                        type : 'primary',
                        callback : $.proxy( function(e, $prompt) {
                            $prompt.closePrompt();

                            var narrative;
                            var data;

                            if (narrative = $prompt.dialogModal().data('new_narrative').val()) {
                                console.log(narrative);
                            }
                            else if (narrative = $prompt.dialogModal().data('select_narrative').val()) {
                                console.log(narrative);
                                console.log('(' + narrative + ')');
                                if (narrative == '--- SELECT ---') {
                                console.log('A MATCH!');
                                    narrative = undefined;
                                }
                            }

                            if (narrative == undefined) {
                                return;
                            }

                            if (instructionsFile = $prompt.dialogModal().data('upload').val()) {
                                console.log(narrative);

                                var reader = new FileReader();

                                reader.onload = $.proxy( function(e) {
                                    this.addNarrative(
                                        {
                                            name : narrative,
                                            instructions : e.target.result
                                        }
                                    );
                                }, this );

                                reader.readAsText(instructionsFile);

                            }
                            else {
                                this.addNarrative(
                                    {
                                        name : narrative,
                                    }
                                )
                            }

                        },this)
                    }
                ]
            }
            );

            this._rewireIds($ond.dialogModal(), $ond.dialogModal());
            this.data('openNarrativeDialog', $ond);

            return $ond;

        },

        addNarrative : function (narrative) {

            narrative.workspace = this;
            narrative.$loginbox = this.$loginbox;
            narrative.client = this.client;

            if (this._narratives[narrative.name]) {
                this.showTab(narrative.name);
                return;
            }

            var $narrative = $('<div></div>').kbaseNarrative(narrative);

            this.addTab(
                {
                    tab : $narrative.name(),
                    content : $narrative.$elem,
                    show : true,
                }
            );

            this._narratives[$narrative.name()] = $narrative;

        },

        activeNarrative : function() {
            return this._narratives[ this.activeTab() ];
        },

        deleteNarrative : function (narrative) {
            this._narratives[narrative].save();
            this._narratives[narrative] = undefined;
            this.deleteTabCallback(narrative)();
        },

        deletePrompt : function(tabName) {
            this.deleteNarrative(tabName);
        },

        deleteTabToolTip : function (tabName) {
            return 'Close ' + tabName;
        },


    });

}( jQuery ) );
