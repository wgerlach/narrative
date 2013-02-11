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

