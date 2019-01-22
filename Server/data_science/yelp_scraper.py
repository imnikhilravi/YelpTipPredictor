# -*- coding: utf-8 -*-

import os
import re
import mpmath
import time

import requests
from bs4 import BeautifulSoup


def download_review_htmls(restaurant_info):
    url = restaurant_info['url']
    name = restaurant_info['name']
    total_reviews = restaurant_info['total_reviews']
    first_file = restaurant_info['first_file']
    files = [first_file]
    for page_num in range(1, int(mpmath.ceil(total_reviews / 20))):  # from page 2 as page 1 is already saved.
        page_link = url + "?start=" + str(page_num * 20)
        for i in range(5):
            try:
                response = requests.get(page_link, headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36', })
                html = response.content  # get the html
                filename = 'data/' + name + '/' + str(int(page_num + 1)) + '_' + name + '_' + str(
                    time.time()) + ".html"
                with open(filename, "wb") as file:
                    file.write(html)
                    file.close()
                files.append(filename)
                break
            except Exception:
                time.sleep(2)
    return files


def get_restaurant_info(url):
    if '?' in url:
        url = url[:url.find('?')]
    if 'biz_photos' in url:
        url = url.replace('biz_photos', 'biz')
    name = url[url.find('biz/') + 4:]

    for i in range(5):
        try:
            response = requests.get(url, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36', })
            html = response.content
            filename = 'data/' + name + "/1_" + name + str(
                time.time()) + ".html"
            os.makedirs(os.path.dirname(filename), exist_ok=True)
            with open(filename, "wb") as file:
                file.write(html)
                file.close()
            soup = BeautifulSoup(html.decode('utf-8', 'ignore'), 'html.parser')
            total_reviews = soup.find('span',
                                      {'class': re.compile('review-count rating-qualifier')}).text.strip()
            total_reviews = total_reviews[:total_reviews.find(' ')]
            return {'url': url, 'name': name, 'total_reviews': int(total_reviews), 'first_file': filename}
        except Exception:
            time.sleep(2)  # wait 2 secs


def scrape(url):
    restaurant_info = get_restaurant_info(url)
    html_files = download_review_htmls(restaurant_info)
    restaurant_info['html_files'] = html_files
    return restaurant_info
