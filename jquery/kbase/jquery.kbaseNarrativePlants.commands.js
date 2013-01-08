/*


*/


(function( $, undefined ) {


    $.widget("kbaseNarrativePlants.commands", $.kbaseIris.commands, {
        version: "1.0.0",
        options: {
            link : function (evt) {
                alert("clicked on " + $(evt.target).text());
            }
        },

        loadedCallback : function($elem) {

            var plantFunctions = [
                ['Plant Expression', 'PlantExpression'],
                ['Networks', 'KBaseNetworks'],
                ['Ontology', 'Ontology'],
                ['Genotypes/Phenotypes', 'Genotype_PhenotypeAPI'],
            ];

            $.each(
                plantFunctions,
                $.proxy(
                    function (idx, val) {
                        var heading  = val[0];
                        var objClass = val[1];
                        var obj   = clientSingleton[objClass];
                        console.log("OBJECT IS");console.log(obj);

                        var $ul = $('<ul></ul>');

                        $elem.append(
                            $('<h3></h3>')
                                .append(
                                    $('<a></a>')
                                        .attr('href', '#')
                                        .text(heading)
                            )
                        )
                        .append(
                            $('<div></div>')
                                .css('padding', '0px')
                                .append($ul)
                        );

                        for (prop in obj) {
                            if (prop.match(/_async$/)) {
                                var method = prop.replace(/_async$/, '');

                                var metaFunc = MetaToolInfo(method);
                                var label = method;
                                if (metaFunc != undefined) {
                                    var meta = metaFunc(method);
                                    label = meta.label;
                                }

                                $ul.append(
                                    $('<li></li>')
                                        .append($('<a></a>')
                                            .attr('href', '#')
                                            .attr('title', method)
                                            .css('display', 'list-item')
                                            .data('blockType', 'javascriptBlock')
                                            .data('blockOptions',
                                                {
                                                    client : obj,
                                                    clientClass : objClass,
                                                }
                                            )
                                            //.tooltip()
                                            .text(label)
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
                                );



                            }
                        }

                    },
                    this
                )
            );

            this._superApply([$elem]);

        },


    });

}( jQuery ) );
