/*


*/


(function( $, undefined ) {


    $.widget("kbaseNarrative.animatedLineGraphBlock", $.kbase.widget, {
        version: "1.0.0",
        options: {
            width           : 400,
            height          : 400,
            speed           : 50,
            animate         : 1,
            xMin            : 0,
            xMax            : 50,
            yMin            : 0,
            yMax            : 100,
            bgColor         :  new RGBColor(255,255,255),
            outlineColor    :  new RGBColor(0,0,0),
            autorun         : 1
        },

        _init: function() {

            this.narrative = this.options.narrative;

            this.data('autorun', this.options.autorun);

            this.element.append(this.ui());
            $(this.element).data('blockType', 'animatedLineGraphBlock');

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
                                .text('Line Graph')
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

            if (inputText == undefined) {
                inputText = '[{"color":[255,0,0],"data":[[0,0.6],[0.02,0.43],[0.04,0.3],[0.06,0.2],[0.08,0.12],[0.1,0.07],[0.12,0.04],[0.14,0.03],[0.16,0.04],[0.18,0.06],[0.2,0.1],[0.22,0.14],[0.24,0.19],[0.26,0.24],[0.28,0.31],[0.3,0.37],[0.32,0.43],[0.34,0.49],[0.36,0.56],[0.38,0.61],[0.4,0.67],[0.42,0.72],[0.44,0.76],[0.46,0.8],[0.48,0.83],[0.5,0.86],[0.52,0.87],[0.54,0.88],[0.56,0.88],[0.58,0.88],[0.6,0.87],[0.62,0.85],[0.64,0.82],[0.66,0.79],[0.68,0.75],[0.7,0.71],[0.72,0.67],[0.74,0.62],[0.76,0.58],[0.78,0.53],[0.8,0.49],[0.82,0.45],[0.84,0.42],[0.86,0.39],[0.88,0.37],[0.9,0.37],[0.92,0.38],[0.940000000000001,0.4],[0.960000000000001,0.45],[0.980000000000001,0.51]]},{"color":[0,255,0],"data":[[0,0],[0.02,0.08],[0.04,0.2],[0.06,0.32],[0.08,0.41],[0.1,0.5],[0.12,0.57],[0.14,0.64],[0.16,0.69],[0.18,0.73],[0.2,0.76],[0.22,0.79],[0.24,0.8],[0.26,0.81],[0.28,0.81],[0.3,0.8],[0.32,0.79],[0.34,0.77],[0.36,0.75],[0.38,0.72],[0.4,0.69],[0.42,0.65],[0.44,0.62],[0.46,0.58],[0.48,0.54],[0.5,0.5],[0.52,0.46],[0.54,0.42],[0.56,0.38],[0.58,0.35],[0.6,0.31],[0.62,0.28],[0.64,0.25],[0.66,0.23],[0.68,0.21],[0.7,0.2],[0.72,0.19],[0.74,0.19],[0.76,0.2],[0.78,0.21],[0.8,0.24],[0.82,0.27],[0.84,0.31],[0.86,0.36],[0.88,0.43],[0.9,0.5],[0.92,0.59],[0.940000000000001,0.68],[0.960000000000001,0.8],[0.980000000000001,0.92]]},{"color":[0,0,255],"data":[[0,0.5],[0.02,0.69],[0.04,0.86],[0.06,0.97],[0.08,1],[0.1,0.95],[0.12,0.84],[0.14,0.67],[0.16,0.47],[0.18,0.28],[0.2,0.12],[0.22,0.02],[0.24,0],[0.26,0.06],[0.28,0.18],[0.3,0.36],[0.32,0.56],[0.34,0.75],[0.36,0.9],[0.38,0.98],[0.4,0.99],[0.42,0.93],[0.44,0.79],[0.46,0.61],[0.48,0.41],[0.5,0.23],[0.52,0.09],[0.54,0.01],[0.56,0.01],[0.58,0.09],[0.6,0.23],[0.62,0.42],[0.64,0.62],[0.66,0.8],[0.68,0.93],[0.7,1],[0.72,0.98],[0.74,0.89],[0.76,0.74],[0.78,0.55],[0.8,0.36],[0.82,0.18],[0.84,0.06],[0.86,0],[0.88,0.03],[0.9,0.12],[0.92,0.28],[0.940000000000001,0.48],[0.960000000000001,0.67],[0.980000000000001,0.84]]}]';
            }

            if (inputText != undefined) {
                var inputObj = JSON.parse(inputText);

                jQuery.each(
                    inputObj,
                    function (idx, line) {
                        line.color = new RGBColor(line.color[0],line.color[1],line.color[2]);
                    }
                )

                this.options.data = inputObj;
                this.renderCanvas(this.data('canvas'), this.options);

            }


        },

        blockDefinition : function() {
            return {
                blockType    : 'animatedLineGraphBlock',
                id           : this.options.id,
                name         : 'animatedLineGraph',
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

            return new Rectangle(
                new Point( parseInt(canvas.width) - parseInt(canvas.width) / fraction + 40, 0),
                new Size(parseInt(canvas.width) / fraction - 40, parseInt(canvas.height) / fraction - 30)
            );

        },

        getXLabelBounds : function (canvas) {
            var graphBounds = this.getGraphBounds(canvas);

            var xbounds = new Rectangle(
                new Point(graphBounds.origin.x, graphBounds.origin.y + graphBounds.size.height),
                new Size(graphBounds.size.width, parseInt(canvas.width) - graphBounds.size.height)
            );

            return xbounds;
        },

        getYLabelBounds : function (canvas) {
            var graphBounds = this.getGraphBounds(canvas);

            return new Rectangle (
                new Point(0,0),
                new Size(parseInt(canvas.width) - graphBounds.size.width, graphBounds.size.height)
            );

        },

        getCornerLabelBounds : function (canvas) {
            var graphBounds = this.getGraphBounds(canvas);
            var xLabelBounds = this.getXLabelBounds(canvas);
            var yLabelBounds = this.getYLabelBounds(canvas);

            return new Rectangle(
                new Point(yLabelBounds.origin.x, xLabelBounds.origin.y),
                new Size(yLabelBounds.size.width, xLabelBounds.size.height)
            );
        },

        renderCanvas : function ($canvas,options) {

            var canvas = $canvas.get(0);
            var ctx = canvas.getContext('2d');

            if (ctx) {

                var graphBounds = this.getGraphBounds(canvas);

                var initialDraw = true;
                if (this.steps == undefined) {
                    this.step = 0;
                    this.steps = 0;
                    for (var i = 0; i < options.data.length; i++) {
                        if (options.data[i].data.length > this.steps) {
                            this.steps = options.data[i].data.length;
                        }
                    }
                    if (! options.animate) {
                        this.step = this.steps;
                    }
                }
                else {
                    ctx.save();
                    ctx.rect(graphBounds.origin.x,graphBounds.origin.y,graphBounds.size.width,graphBounds.size.height);
                    ctx.clip();
                    initialDraw = false;
                }


                ctx.fillStyle = options.bgColor.asString();
                ctx.fillRect(graphBounds.origin.x,graphBounds.origin.y,graphBounds.size.width,graphBounds.size.height);

                ctx.strokeStyle = options.outlineColor.asString();
                ctx.strokeRect(graphBounds.origin.x,graphBounds.origin.y,graphBounds.size.width,graphBounds.size.height);

                this.drawGrid(
                    $canvas,
                    {
                        ticks : 10,
                        bounds : this.getGraphBounds(canvas),
                        color : new RGBColor(210,210,210),
                    }
                );

                for (var i = 0; i < options.data.length; i++) {
                    ctx.strokeStyle = options.data[i].color.asString();
                    var data = options.data[i].data;

                    ctx.shadowOffsetX = 3;
                    ctx.shadowOffsetY = 3;
                    ctx.shadowBlur    = 4;
                    ctx.shadowColor   = 'rgba(60, 60, 60, 0.8)';

                    ctx.beginPath();
                    ctx.moveTo(
                        data[0][0] * graphBounds.size.width + graphBounds.origin.x,
                        (1-data[0][1]) * graphBounds.size.height + graphBounds.origin.y
                    );

                    var step = this.step;
                    if (step > data.length) {
                        step = step;
                    }

                    for (var j = 0; j < step; j++) {
                        ctx.lineTo(
                            data[j][0] * graphBounds.size.width + graphBounds.origin.x,
                            (1-data[j][1]) * graphBounds.size.height + graphBounds.origin.y
                        );
                    }
                    ctx.stroke();
                    ctx.shadowColor = 'rgba(0,0,0,0)';

                };

                if (initialDraw) {
                    this.drawYScale(
                        canvas, {
                            min : options.yMin,
                            max : options.yMax,
                            ticks : 10,
                            bounds : this.getYLabelBounds(canvas)
                        }
                    );

                    this.drawXScale(
                        canvas, {
                            min : options.xMin,
                            max : options.xMax,
                            ticks : 10,
                            bounds : this.getXLabelBounds(canvas)
                        }
                    );
                }
                else {
                    ctx.restore();
                }

                if (this.step < this.steps) {
                    this.step++;
                    setTimeout(jQuery.proxy(function() {this.renderCanvas($canvas, options) }, this), options.speed);
                }
            }
        },
        drawYScale : function (canvas, options) {

            var ctx = canvas.getContext('2d');

            ctx.save();
            ctx.rect(options.bounds.origin.x,options.bounds.origin.y,options.bounds.size.width,options.bounds.size.height);
            ctx.clip();


            ctx.font = '9px sans-serif';
            ctx.fillStyle = '#000';
            ctx.strokeStyle = '#000';
            ctx.textAlign = 'end';

            var scale = (options.max - options.min) / options.ticks;

            for (var i = 0; i <= options.ticks; i++) {
                var label;
                if (i == 0) {
                    ctx.textBaseline = 'bottom';
                    label = options.min;
                }
                else if (i == options.ticks) {
                    ctx.textBaseline = 'top';
                    label = options.max;
                }
                else {
                    ctx.textBaseline = 'middle';
                    label = options.min + i * scale;
                }

                ctx.fillText(
                    label.toFixed(2),
                    options.bounds.origin.x + options.bounds.size.width - 5,
                    options.bounds.size.height - i / options.ticks * options.bounds.size.height
                );
                if (1) {
                    ctx.beginPath();
                    ctx.moveTo(
                        options.bounds.origin.x + options.bounds.size.width - 5,
                        options.bounds.size.height - i / options.ticks * options.bounds.size.height
                        );
                    ctx.lineTo(
                        options.bounds.origin.x + options.bounds.size.width,
                        options.bounds.size.height - i / options.ticks * options.bounds.size.height
                    );
                    ctx.stroke();
                }
            }

            ctx.restore();

        },
        drawXScale : function (canvas, options) {

            var ctx = canvas.getContext('2d');

            ctx.save();
            ctx.rect(options.bounds.origin.x,options.bounds.origin.y,options.bounds.size.width,options.bounds.size.height);
            ctx.clip();

            ctx.font = '9px sans-serif';
            ctx.fillStyle = '#000';
            ctx.strokeStyle = '#000';
            ctx.textBaseline = 'top';

            var scale = (options.max - options.min) / options.ticks;

            for (var i = 0; i <= options.ticks; i++) {
                var label;
                if (i == 0) {
                    ctx.textAlign = 'start';
                    label = options.min;
                }
                else if (i == options.ticks) {
                    ctx.textAlign = 'end';
                    label = options.max;
                }
                else {
                    ctx.textAlign = 'center';
                    label = options.min + i * scale;
                }

                ctx.fillText(
                    label.toFixed(2),
                    options.bounds.origin.x + i / options.ticks * options.bounds.size.width,
                    options.bounds.origin.y + 5
                );

                if (1) {
                    ctx.beginPath();
                    ctx.moveTo(
                    options.bounds.origin.x + i / options.ticks * options.bounds.size.width,
                    options.bounds.origin.y + 5
                        );
                    ctx.lineTo(
                    options.bounds.origin.x + i / options.ticks * options.bounds.size.width,
                    options.bounds.origin.y
                    );
                    ctx.stroke();
                }
            }

            ctx.restore();

        },
        drawGrid : function($canvas, options) {

            var ctx = $canvas.get(0).getContext('2d');

            ctx.save();
            ctx.rect(options.bounds.origin.x,options.bounds.origin.y,options.bounds.size.width,options.bounds.size.height);
            ctx.clip();

            if (isNaN(options.xTicks)) {
                xGridTicks = options.ticks;
            }
            if (isNaN(options.yTicks)) {
                yGridTicks = options.ticks;
            }

            ctx.strokeStyle = options.color.asString();
            ctx.lineWidth = 1;
            ctx.beginPath();

            if (options.outline) {
                ctx.moveTo(options.bounds.origin.x,options.bounds.origin.y);
                ctx.lineTo(options.bounds.origin.x + options.bounds.size.width,options.bounds.origin.y);
                ctx.lineTo(options.bounds.origin.x + options.bounds.size.width,options.bounds.origin.y + options.bounds.size.height);
                ctx.lineTo(options.bounds.origin.x,options.bounds.origin.y + options.bounds.size.height);
                ctx.lineTo(options.bounds.origin.x,options.bounds.origin.y);
            }

            for (var x = 0; x <= xGridTicks ; x++) {
                ctx.moveTo(x / xGridTicks * options.bounds.size.width + options.bounds.origin.x, options.bounds.origin.y);
                ctx.lineTo(x / xGridTicks * options.bounds.size.width + options.bounds.origin.x, options.bounds.origin.y + options.bounds.size.height);
            }
            for (var y = 0; y <= yGridTicks; y++) {
                ctx.moveTo(options.bounds.origin.x, y / yGridTicks * options.bounds.size.height + options.bounds.origin.y);
                ctx.lineTo(options.bounds.origin.x + options.bounds.size.width, y / yGridTicks * options.bounds.size.height + options.bounds.origin.y);
            }
            ctx.stroke();

            ctx.restore();

        }


    });

}( jQuery ) );

