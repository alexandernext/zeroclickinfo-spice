var ddg_spice_amazon_carousel_add_items;

function ddg_spice_amazon(api_response) {
    console.log(api_response);
    
    if (!api_response || !(api_response.length > 1)) return;

    var query = DDG.get_query().replace(/\s+amazon\s*$|^\s*amazon\s+/i, '');

    var spotlight_resize = function(index, item) {
        $('#amazon .spotlight').css(
            {'max-height' : ($('#ddgc_detail').height() > 150 ?
                                $('#ddgc_detail').height() : 150) + 'px'}
        );
        $('#amazon .description').width(
            //width - parent margins (both sides) - parent padding - spotlight image width - left-margin
            $('#ddgc_nav').width() - 10 - (12*2) - 150 - 20
        );
        if (item)
            nrj('https://dylan.duckduckgo.com/m.js?r='
                + escape(item.rating.replace('http://www.amazon.com/reviews/iframe?', ''))
                + '&cb=ddg_spice_amazon_detail');
    };

    ddg_spice_amazon_carousel_add_items =
        Spice.render({
            header1                  : query + ' (Amazon)',
            source_url               : api_response.url,
            source_name              : 'Amazon',
            force_big_header         : true,
            force_favicon_domain     : 'www.amazon.com',
            template_frame           : 'carousel',
            template_normal          : 'amazon',
            carousel_css_id          : 'amazon',
            carousel_template_detail : 'amazon_detail',
            carousel_items           : api_response,
            force_no_fold            : true,
            item_callback            : spotlight_resize
        });

    nrj('https://dylan.duckduckgo.com/m.js?pg=2'
            + '&cb=ddg_spice_amazon_wait_for_render'
            + '&q=' + escape(DDG.get_query()));

    $(window).resize(spotlight_resize);
}

function ddg_spice_amazon_wait_for_render(items) {
    window.setTimeout(ddg_spice_amazon_carousel_add_items, 500, items);
}

function ddg_spice_amazon_detail(api_response) {
    console.log(api_response);
    if (api_response.stars == 'unrated') {
        $('<span>unrated</span>')
            .insertAfter('#ddgc_detail .stars');
        $('#ddgc_detail .stars').hide();
    } else {
        $('#ddgc_detail .stars')
            .attr('src', '/iu/?u=' + api_response.stars);
    }
    $('#ddgc_detail .review-count')
        .text(api_response.reviews);
}