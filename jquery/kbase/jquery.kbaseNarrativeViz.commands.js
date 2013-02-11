/*


*/


(function( $, undefined ) {


    $.widget("kbaseNarrativeViz.commands", $.kbaseIris.commands, {
        version: "1.0.0",
        options: {
        },

        loadedCallback : function($elem) {

            $elem
                .append(
                    $('<h3></h3>')
                        .append(
                            $('<a></a>')
                                .attr('href', '#')
                                .text('Visualization')
                            )
                    )
                .append(
                    $('<div></div>')
                        .css('padding', '0px')
                        .append(
                            $('<ul></ul>')
                                .append(
                                    $('<li></li>')
                                        .append($('<a></a>')
                                            .attr('href', '#')
                                            .attr('title', 'Animated Line Graph')
                                            .css('display', 'list-item')
                                            .data('blockType', 'animatedLineGraphBlock')
                                            .text('Animated Line Graph')
                                            .bind(
                                                'click',
                                                this.options.link
                                            )
                                        )
                                        .draggable(
                                            {
                                                distance : 20,
                                                cursor   : 'pointer',
                                                opacity  : 0.7,
                                                helper   : 'clone',
                                                connectToSortable: this.options.connectToSortable,
                                                revert : 'invalid',
                                                disabled : this.options.connectToSortable == undefined,
                                                cursorAt : {
                                                    left : 5,
                                                    top  : 5
                                                }
                                            }
                                        )
                                    )
                                )
                        .append(
                            $('<ul></ul>')
                                .append(
                                    $('<li></li>')
                                        .append($('<a></a>')
                                            .attr('href', '#')
                                            .attr('title', 'Heat Map')
                                            .css('display', 'list-item')
                                            .data('blockType', 'heatmapBlock')
                                            .text('Heat Map')
                                            .bind(
                                                'click',
                                                this.options.link
                                            )
                                        )
                                        .draggable(
                                            {
                                                distance : 20,
                                                cursor   : 'pointer',
                                                opacity  : 0.7,
                                                helper   : 'clone',
                                                connectToSortable: this.options.connectToSortable,
                                                revert : 'invalid',
                                                disabled : this.options.connectToSortable == undefined,
                                                cursorAt : {
                                                    left : 5,
                                                    top  : 5
                                                }
                                            }
                                        )
                                    )
                                )
                    )
            ;

            this._superApply([$elem]);

        },


    });

}( jQuery ) );
