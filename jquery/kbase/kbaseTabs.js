/*


*/

(function( $, undefined ) {


    $.kbWidget("kbaseTabs", 'kbaseWidget', {
        version: "1.0.0",
        options: {
            tabPosition : 'top',
        },

        init: function(options) {

            this._super(options);

            this.data('tabs', {});
            this.data('nav', {});

            this.appendUI( $( this.$elem ) );

            return this;

        },

        appendUI : function ($elem, tabs) {

            if (tabs == undefined) {
                tabs = this.options.tabs;
            }

            var $block =
                $('<div></div>')
                    .addClass('tabbable')
            ;

            var $tabs = $('<div></div>')
                            .addClass('tab-content')
                            .attr('id', 'tabs-content')
            ;
            var $nav = $('<ul></ul>')
                            .addClass('nav nav-tabs')
                            .attr('id', 'tabs-nav')
            ;

            if (this.options.tabPosition == 'top') {
                $block.addClass('tabs-above');
                $block.append($nav).append($tabs);
            }
            else if (this.options.tabPosition == 'bottom') {
                $block.addClass('tabs-below');
                $block.append($tabs).append($nav);
            }
            else if (this.options.tabPosition == 'left') {
                $block.addClass('tabs-left');
                $block.append($nav).append($tabs);
            }
            else if (this.options.tabPosition == 'right') {
                $block.addClass('tabs-right');
                $block.append($tabs).append($nav);
            }

            this._rewireIds($block, this);

            $elem.append($block);

            if (tabs) {
                $.each(
                    tabs,
                    $.proxy(function (idx, val) {
                        this.addTab(val.tab, val.content, val.show, val.canDelete);
                    }, this)
                );
            }

        },

        addTab : function (tab, content, show, canDelete) {

            if (canDelete == undefined) {
                canDelete = this.options.canDelete;
            }

            var $tab = $('<div></div>')
                .addClass('tab-pane fade')
                .append(content);

            var $that = this;   //thanks bootstrap! You suck!

            var $nav = $('<li></li>')
                .css('white-space', 'nowrap')
                .append(
                    $('<a></a>')
                        .attr('href', '#')
                        .text(tab)
                        .bind('click',
                            function (e) {
                                e.preventDefault();

                                var previous = $that.data('tabs-nav').find('.active:last a')[0];

                                //we can't just call 'show' directly, since it requires an href or data-target attribute
                                //on the link which MUST be an idref to something else in the dom. We don't have those,
                                //so we just do what show does and call activate directly.
                                //
                                //oh, but we can't just say $(this).tab('activate',...) because bootstrap is specifically
                                //wired up now to pass along any arguments to methods invoked in this manner.
                                //
                                //Because this technology -sucks-.
                                $.fn.tab.Constructor.prototype.activate.call(
                                    $(this),
                                    $(this).parent('li'),
                                    $that.data('tabs-nav')
                                );

                                $.fn.tab.Constructor.prototype.activate.call(
                                    $(this),
                                    $tab,
                                    $tab.parent(),
                                    function () {
                                        $(this).trigger({
                                            type            : 'shown',
                                            relatedTarget   : previous
                                        })
                                    });

                            }
                        )
                    .append(
                        $('<button></button>')
                            .addClass('btn btn-mini')
                            .append($('<i></i>').addClass('icon-minus'))
                            .css('padding', '0px')
                            .css('width', '22px')
                            .css('height', '22px')
                            .css('margin-left', '10px')
                            .attr('title', 'Remove tab')
                            .tooltip()
                            .bind('click', $.proxy(function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                if ($nav.hasClass('active')) {
                                    if ($nav.next('li').length) {
                                        $nav.next().find('a').trigger('click');
                                    }
                                    else {
                                        $nav.prev('li').find('a').trigger('click');
                                    }
                                }
                                $tab.remove();
                                $nav.remove();
                            },this))
                    )
                )
            ;

            if (! canDelete) {
                $nav.find('button').remove();
            }

            this.data('tabs')[tab] = $tab;
            this.data('nav')[tab] = $nav;

            this.data('tabs-content').append($tab);
            this.data('tabs-nav').append($nav);

            if (show) {
                this.showTab(tab);
            }
        },

        showTab : function (tab) {
            this.data('nav')[tab].find('a').trigger('click');
        },

    });

}( jQuery ) );
