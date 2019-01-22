# -*- coding: utf-8 -*-

# Sanjeevi Lingam Rajasekaran

from restaurant_meta import RestaurantMeta
from yelp_scraper import scrape
from yelp_parser import parse
from yelp_highlighter import get_highlights
import json
import sys
import os

if __name__ == '__main__':
    yelp_url = sys.argv[1]
    if yelp_url is not None:
        restaurant_meta = RestaurantMeta()
        restaurant_info = scrape(yelp_url)
        data_file = parse(
            restaurant_info['name'], restaurant_info['html_files'])
        highlights = get_highlights(data_file)
        restaurant_meta.save(url=restaurant_info['url'], name=restaurant_info['name'],
                             total_reviews=restaurant_info['total_reviews'],
                             html_files=restaurant_info['html_files'], data_file=data_file, highlights=highlights)
        data = json.dumps(restaurant_meta.metadata)
        print(data)
    else:
        print({'error': 'No Link Provided'})
