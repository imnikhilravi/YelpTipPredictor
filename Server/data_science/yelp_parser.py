# -*- coding: utf-8 -*-

from bs4 import BeautifulSoup
import os
import re
import pandas as pd
import unicodedata2
import time


def parse(restaurant_name, html_files):
    cuisine_info_list = []
    for review_file in html_files:

        if os.path.isfile(review_file) and review_file.endswith('.html'):  # make sure we are parsing a html file
            with open(review_file, "rb") as file:
                html_data = file.read()

            soup = BeautifulSoup(html_data.decode('utf-8', 'ignore'), 'html.parser')

            # creates a dataframe with restaurant information
            restaurant_df = pd.DataFrame(get_reviews(soup), columns=['rating', 'review_content'])
            restaurant_df['restaurant_name'] = restaurant_name
            # restaurant_df['price'] = get_price_range(soup)
            cols = ['restaurant_name', 'rating', 'review_content']
            restaurant_df = restaurant_df[cols]

            # appends restaurant information to cuisine dataset
            cuisine_info_list.append(restaurant_df)

    cuisine_df = pd.concat(cuisine_info_list, ignore_index=True)
    file_name = 'data/' + restaurant_name + '/' + restaurant_name + '_' + str(time.time()) + ".csv"
    cuisine_df.to_csv(file_name)
    return file_name


def remove_accents(s):
    return ''.join((c for c in unicodedata2.normalize('NFD', s) if unicodedata2.category(c) != 'Mn'))


def get_price_range(soup_obj):
    price = soup_obj.find('dd', {'class': re.compile('nowrap price-description')})
    price = re.sub(' +', ' ', re.sub('[$\/:*?<>|]', '', price.text.lower())).strip()
    return price


def get_name(soup_obj):
    """
    Gets the restaurant name
    :param soup_obj: BeautifulSoup parsed html
    :return: string with the restaurant's name
    """
    name = soup_obj.find('h1', {'class': re.compile('biz-page-title')})
    # cleaned_name = re.sub(' +', ' ', re.sub("[\/:*?'<>|+]", '', name.text.lower())).strip()
    cleaned_name = re.sub(' +', ' ', re.sub("[^\w ]", '', name.text.lower())).strip()
    return remove_accents(cleaned_name)


def get_reviews(soup_obj):
    review_list = []
    reviews = soup_obj.findAll('div', {'class': 'review-content'})
    for rev in reviews:
        content = rev.find('p').text.lower().strip()
        rating = rev.find('div', {'class': re.compile('i-stars')})
        rating = float(re.sub(' +', ' ', re.sub('[a-zA-Z\/:*?<>|]', '', rating['title'].lower())).strip())
        review_list.append((rating, content))
    return review_list


def get_categories(soup_obj):
    categories_list = []
    categories = soup_obj.find('span', {'class': re.compile('category-str-list')})
    categories = categories.findAll('a', {'href': re.compile('/c/')})
    for cat in categories:
        categories_list.append(cat.text.lower().strip())
    return categories_list
