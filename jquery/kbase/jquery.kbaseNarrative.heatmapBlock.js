/*


*/


(function( $, undefined ) {


    $.widget("kbaseNarrative.heatmapBlock", $.kbase.widget, {
        version: "1.0.0",
        options: {
            visThreshold    : 0.01,
            width           : 400,
            height          : 400,
            bgColor         :  new RGBColor(255,255,255),
            color           :  new RGBColor(255,0,0),
            outlineColor    :  new RGBColor(0,0,0),
            studies : {
                alpha : new RGBColor(255,0,0),
                beta  : new RGBColor(0,255,0),
                gamma : new RGBColor(0,0,255),
            }
        },

        _init: function() {

            this.narrative = this.options.narrative;

            this.data('autorun', this.options.autorun);

            this.element.append(this.ui());
            $(this.element).data('blockType', 'heatmapBlock');

            return this;

        },

        prompt : function () {},

        ui : function(file) {

            var $block = $('<div></div>')
                .attr('id', 'block')
                .attr('class', 'ui-widget-content ui-widget-content ui-corner-all')
                .attr('style', 'padding : 5px; overflow : hidden; margin-bottom : 5px; text-align : center')
                .append(
                    $('<div></div>')
                        .attr('id', 'command-header')
                        .attr('class', 'ui-widget-header ui-corner-all')
                        .attr('style', 'padding : 5px; margin-top : 0px; height : 18px')
                        .append(
                            $('<h3></h3>')
                                .attr('style', 'position : absolute;')
                                .attr('id', 'command-name')
                                .text('Heat Map')
                        )
                        .append(
                            $('<div></div>')
                                .attr('style', 'position : absolute; height : 18px; text-align : right; white-space : nowrap')
                                .attr('id', 'command-controls')
                                .append(
                                    $('<button></button>')
                                        .attr('id', 'gobutton')
                                        .append('Go\n')
                                        .css({width : '19px', height : '18px'})
                                        .button({text : false, icons : {primary : 'ui-icon-play'}})
                                        .bind('click',
                                            jQuery.proxy(
                                                function(e) {
                                                    this.run();
                                                },
                                                this
                                            )
                                        )
                                )
                                .append(
                                    $('<button></button>')
                                        .attr('id', 'closebutton')
                                        .append('Close\n')
                                        .css({width : '19px', height : '18px'})
                                        .button({text : false, icons : {primary : 'ui-icon-closethick'}})
                                )
                        )
                )
                .append(
                    $('<canvas></canvas>')
                        .attr('id', 'canvas')
                        .attr('width', this.options.width)
                        .attr('height', this.options.height)
                        .css('margin', '5px')
                )
            ;

            this._rewireIds($block, this);

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

                                        $block.parent().remove();
                                        $deleteDialog.dialog('close');
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

            //this.data('stopbutton').bind('click', $.proxy( function(evt) { this.data('gobutton').trigger('click'); evt.stopPropagation(); }, this) );
            //this.data('noticebutton').bind('click', $.proxy( function(evt) { this.data('gobutton').trigger('click'); evt.stopPropagation(); }, this) );

            this.data('closebutton').bind(
                'click',
                function (evt) {
                    $deleteDialog.dialog('open');
                    evt.stopPropagation();
                }
            );

            return $block;
        },

        run : function () {

            var inputText;

            var $before = $(this.element).prev();

            while ($before.length) {
                if ($before.data('blockType') == 'narrativeBlock') {
                    if ($before.narrativeBlock('data', 'state') == 'error') {
                        this.enterErrorState();
                        this.appendOutputUI("Cannot run - input block is in error condition");
                        return;
                    }
                    inputText = $before.narrativeBlock('output');
                    break;
                }
                else if ($before.data('blockType') == 'dataBlock') {
                    inputText = $before.dataBlock('output');
                    break;
                }
                else {
                    $before = $before.prev();
                }
            }

            var inputObj;

            if (inputText != undefined) {
                inputObj = JSON.parse(inputText);
            }
            else {
                var inputObj = [];
                var numSquares = 50;
                for (var x = 0.00; x < 1.00; x += 1.00 / numSquares) {
                    for (var y = 0.00; y < 1.00; y += 1.00 / numSquares) {
                        inputObj.push(
                            {
                                x : x,
                                y : y,
                                width : 1.00 / numSquares,
                                height : 1.00 / numSquares,
                                score : Math.random(),
                                study : 'alpha',
                            }
                        );
                    }
                }
            }

            this.options.data = inputObj;
            this.renderCanvas(this.data('canvas'), this.options);


        },

        blockDefinition : function() {
            return {
                blockType    : 'heatmapBlock',
                id           : this.options.id,
                name         : 'heatmap',
            };
        },

        reposition : function() {

            this.data('command-name').position({of : this.data('command-header'), my : 'left', at : 'left+5 center'});

            this.data('command-controls').position({of : this.data('command-header'), my : 'right', at : 'right-5 center'});

        },


        getGraphBounds : function (canvas, fraction) {
            if (! fraction) {
                fraction = 1;
            }

            var thermWidth = 0;
            //if (this.thermometer != undefined) {
            //    thermWidth = 10 * this.thermometerCount;
            //}

            return new Rectangle(
                new Point(
                    parseInt(canvas.width) - parseInt(canvas.width) / fraction,
                    0
                ),
                new Size(
                    parseInt(canvas.width) / fraction /*- 40*/ - thermWidth,
                    parseInt(canvas.height) / fraction /*- 30*/
                )
            );

        },

        getXLabelBounds : function (canvas) {
            var graphBounds = this.getGraphBounds(canvas);

            var xbounds = new Rectangle(
                new Point(
                    graphBounds.origin.x,
                    graphBounds.origin.y + graphBounds.size.height
                ),
                new Size(
                    graphBounds.size.width,
                    graphBounds.origin.y + graphBounds.size.height
                )
            );

            return xbounds;
        },

        getXGutterBounds : function(canvas) {
            var graphBounds = this.getGraphBounds(canvas);

            var xbounds = new Rectangle(
                new Point(
                    graphBounds.origin.x,
                    0
                ),
                new Size(
                    graphBounds.size.width,
                    graphBounds.origin.y
                )
            );

            return xbounds;
        },

        getYLabelBounds : function (canvas) {
            var graphBounds = this.getGraphBounds(canvas);

            return new Rectangle (
                new Point(
                    0,
                    graphBounds.origin.y
                ),
                new Size(
                    graphBounds.origin.x,
                    graphBounds.size.height
                )
            );

        },

        getYGutterBounds : function (canvas) {
            var graphBounds = this.getGraphBounds(canvas);

            return new Rectangle (
                new Point(
                    graphBounds.origin.x + graphBounds.size.width,
                    graphBounds.origin.y
                ),
                new Size(
                    canvas.width - (graphBounds.size.width + graphBounds.origin.x),
                    graphBounds.size.height
                )
            );

        },

        getLLCornerLabelBounds : function (canvas) {
            var graphBounds = this.getGraphBounds(canvas);
            var xLabelBounds = this.getXLabelBounds(canvas);
            var yLabelBounds = this.getYLabelBounds(canvas);

            return new Rectangle(
                new Point(yLabelBounds.origin.x, xLabelBounds.origin.y),
                new Size(yLabelBounds.size.width, xLabelBounds.size.height)
            );
        },

        getULCornerLabelBounds : function (canvas) {
            var graphBounds = this.getGraphBounds(canvas);

            return new Rectangle(
                new Point(0,0),
                new Size(graphBounds.origin.x, graphBounds.origin.y)
            );
        },

        getURCornerLabelBounds : function (canvas) {
            var graphBounds = this.getGraphBounds(canvas);

            return new Rectangle(
                new Point(graphBounds.origin.x + graphBounds.size.width,0),
                new Size(
                    canvas.width - (graphBounds.size.width + graphBounds.origin.x),
                    graphBounds.origin.y
                )
            );
        },

        getLRCornerLabelBounds : function (canvas) {
            var graphBounds = this.getGraphBounds(canvas);

            return new Rectangle(
                new Point(graphBounds.origin.x + graphBounds.size.width,graphBounds.origin.y + graphBounds.size.height),
                new Size(
                    canvas.width - (graphBounds.size.width + graphBounds.origin.x),
                    canvas.height - (graphBounds.size.height + graphBounds.origin.y)
                )
            );
        },


        colorForStudy : function (study, options) {
            if (options.studies[study]) {
                return options.studies[study];
            }
            else {
                return options.color;
            }
        },

        renderCanvas : function ($canvas,options) {

            var canvas = $canvas.get(0);
            var ctx = canvas.getContext('2d');

            if (ctx) {

                var graphBounds = options.bounds;
                if (graphBounds == undefined) {
                    graphBounds = this.getGraphBounds(canvas);
                }

                ctx.fillStyle = options.bgColor.asString();
                ctx.fillRect(graphBounds.origin.x,graphBounds.origin.y,graphBounds.size.width,graphBounds.size.height);

                for (var i = 0; i < options.data.length; i++) {
                    var region = options.data[i];
                    var regionRect = new Rectangle(
                        new Point(
                            region.x * graphBounds.size.width + graphBounds.origin.x,
                            region.y * graphBounds.size.height + graphBounds.origin.y
                        ),
                        new Size(
                            region.width * graphBounds.size.width,
                            region.height * graphBounds.size.height
                        )
                    );

                    var alphaColor = this.colorForStudy(region.study, options).asStringWithAlpha(region.score);

                    if (region.score > options.visThreshold) {
                        ctx.fillStyle = alphaColor;
                        ctx.fillRect(regionRect.origin.x,regionRect.origin.y, regionRect.size.width, regionRect.size.height);
                    }

                };

                //if (options.thermometer) {
                //    canvas.addEventListener('mousemove', function(e) { this.mousemotion(e, options.data, this, canvas, graphBounds, options) }, false);
                //    canvas.addEventListener('mouseout', function(e) { this.mouseout(e, this, canvas, options) }, false);
                //}

                ctx.strokeStyle = options.outlineColor.asString();
                ctx.strokeRect(graphBounds.origin.x,graphBounds.origin.y,graphBounds.size.width,graphBounds.size.height);

            }
        },


    });

}( jQuery ) );

