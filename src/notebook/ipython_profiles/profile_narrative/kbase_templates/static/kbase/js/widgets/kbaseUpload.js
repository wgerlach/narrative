/**
 *  File upload widget.
 *
 * Author: Dan Gunter <dkgunter@lbl.gov>
 * Created: 27 Aug 2013
 */

// Jquery UI widget style
(function($, undefined) {

	$.KBWidget("kbaseUploadWidget", 'kbaseWidget', {
		version: "0.0.1",
		$buttonList: null,
		$viewPort: null,
		viewPortTabs: {},
		currentTab: null,
		workspaceWidgets: [],

		options: {},

        /**
         * Initialize the widget.
         *
         * @param options
         * @returns {*}
         */
		init: function(options) {
            this._super(options);
			//alert("widget init");
            var that = this;
            this.$elem.on("click", function(event) {
                that.render();
            });
            return this;
		},
        /**
         * Render the widget.
         *
         * @returns {*}
         */
        render: function() {
            var opts = {
                modal: true,
                closeOnEscape: true,
                title: "Upload file",
                width: "50em"
            };
            var dlg = $('#narrative-upload-dialog').dialog(opts);
            dlg.empty();
            // Build form programmatically
            var $frm = $("<form class='form-horizontal'></form>");
            var fields = {
                'filename': {
                    type:'file',
                    id:'filename',
                    label: 'Filename:'
                },
                'datatype': {
                    type:'select',
                    id:'dataset_type',
                    label:'Dataset Type:',
                    options: []
                },
                'dataset': {
                    type:'text',
                    id:'dataset_name',
                    label:'Dataset Name:',
                    placeholder: "Name or identifying phrase"
                }
            };
            // Populate data types
            // XXX: fetch these from somewhere!
            fields.datatype.options = [
                'FBA',
                'Genome',
                'Media',
                'Model',
                'PhenotypeSet',
                'PhenotypeSimulationSet',
                'PromConstraints',
            ];
            // Add each field
            $.each(fields, function(key, value) {
                var $frm_grp = $("<div class='control-group'></div>");
                var $frm_controls = $('<div class="controls"></div>')
                // Build and add the label
                var $label = $('<label class="control-label" for="' + value.id + '">' + value.label + '</label>');
                $frm_grp.append($label);
                // Build and add the control
                var $control = null;
                switch (value.type) {
                    case "file":
                        // This uses Bootstrap file-upload, see: http://jasny.github.io/bootstrap/javascript.html#fileupload
                        $control = $('<div class="fileupload fileupload-new" data-provides="fileupload"></div>')
                            .append($('<div class="input-append"></div>')
                                .append($('<div class="uneditable-input span3">' +
                                             '<i class="icon-file fileupload-exists"></i>' +
                                             '<span class="fileupload-preview"></span>' +
                                          '</div>' +
                                          '<span class="btn btn-file">' +
                                            '<span class="fileupload-new">Select file</span>' +
                                            '<span class="fileupload-exists">Change</span>' +
                                            '<input type="file" id="' + value.id + '"/>' +
                                          '</span>')));
                        // register file upload widget
                        $('.fileupload').fileupload({'name': value.id});
                        break;
                    case "text":
                        $control = $('<input type="text" name="' + value.id +  '" ' +
                                         'placeholder="' + value.placeholder + '" ' +
                                         'class="input-xxlarge" ' +
                                         '></input>');
                        break;
                    case "select":
                        $control = $('<select name="' + value.id + '"></select>');
                        $.each(value.options, function(index, value) {
                           var $opt = $("<option>" + value + "</option>");
                           $control.append($opt);
                        });
                        break;
                    default:
                        break; // XXX: raise an exception
                }
                $frm_controls.append($control);
                $frm_grp.append($frm_controls);
                // Add the label+controls to the form
                $frm.append($frm_grp);
            });
            // Add actions
            var $up_btn = $("<button class='btn btn-primary'>Upload</button>");
            var $cancel_btn = $("<button class='btn btn-link'>Cancel</button>");
            var $actions = $("<div class='form-actions'></div>");
            $actions.append($up_btn);
            $actions.append($cancel_btn);
            $frm.append($actions);
            // Set up respones
            var that = this;
            $frm.on( "submit", function(event) {
                event.preventDefault();
                var frm_arr = $(this).serializeArray();
                var $file_input = $('#' + fields.filename.id);
                var formData = new FormData($file_input[0]);
                frm_arr.push({name: that._getFileName($file_input), data: formData});
                that.uploadFile(frm_arr);
            });
            // Populate dialog with form
            dlg.append($frm);
            return this;
        },

        /**
         * Get file name from input.
         * Has a workaround for chrome
         */
        _getFileName: function(element) {
            var fname = "";
            if (navigator.userAgent.indexOf('Chrome')) {
                fname = element.val().replace(/C:\\fakepath\\/i, '');
            }
            else {
                fname = element.val();
            }
            return fname;
        },

        /**
         * Upload the file into the workspace.
         *
         * @param values File path and metadata
         * @returns {*}
         */
        uploadFile: function(values) {
            console.log("upload called with:");
            $.each(values, function(index, value) {
                console.log("(" + index + ")");
                $.each(value, function(key, val) {
                    console.log("   - " + key + '=' + val);
                });
            });
            return this;
        }
	});
})( jQuery );