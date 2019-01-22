#!/usr/bin/env python
# -*- coding: utf-8 -*-
import spacy
import pandas
import os
from nltk.util import ngrams
import pickle
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob


def load_lexicon(file):
    lex = set()
    lex_conn = open(file)
    for line in lex_conn:
        lex.add(line.strip())
    lex_conn.close()
    return lex


def get_items_from(terms, start_index=0, max_other=2):
    items = []
    item_comp = ""
    if start_index != 0:
        count = 0
        for index in range(start_index, len(terms)):
            if terms[index].tag_.startswith('NN') or (
                    terms[index].tag_.startswith('JJ') and terms[index].dep_ == 'amod'):
                if terms[index].tag_ == 'JJS':
                    continue
                item_comp += terms[index].text + " "
                if terms[index].dep_ == 'dobj' or (index + 1 < len(terms) and (terms[index + 1].tag_ == ',' or (
                        terms[index + 1].tag_ == 'CC' and terms[index + 1].dep_ == 'cc'))):
                    items.append(item_comp[:-1])
                    item_comp = ""
                    count = 0
            else:
                if count > max_other:  # Maximum number of words with "tag_" other than NN that can occur.
                    break
                else:
                    count += 1
    if len(item_comp) > 1:
        items.append(item_comp[:-1])
    return items


def find_items(terms):
    items = set()
    three_grams = ngrams(terms, 3)
    i = 0
    for tg in three_grams:
        if tg[0].tag_.startswith('VB'):
            if tg[1].tag_.startswith('NN'):
                items.update(get_items_from(terms, i + 1))
            elif tg[1].tag_ == 'DT' and tg[2].tag_.startswith('NN'):
                items.update(get_items_from(terms, i + 2))
        elif tg[0].tag_ == 'DT':
            if tg[1].tag_.startswith('NN'):
                items.update(get_items_from(terms, i + 1))
            elif tg[1].tag_.startswith('JJ') and tg[1].dep_ == 'amod':
                items.update(get_items_from(terms, i + 1))
        elif tg[0].tag_ == 'IN' and tg[0].dep_ == 'prep':
            if tg[1].tag_.startswith('NN'):
                items.update(get_items_from(terms, i + 1))
            if tg[1].tag_ == 'DT' and tg[2].tag_.startswith('NN'):
                items.update(get_items_from(terms, i + 2))
        i += 1
    return items


def get_items_of_interest(reviews, print_tags=False):
    # data structure of item -> {item:(count, sentiment score, points)}
    all_items = {}
    for review in reviews:
        for sent in nlp(review).sents:
            score = analyze_sentiment_textblob(sent)
            items = find_items(sent)
            items -= stopwords  # ignore stopwords
            for item in items:
                if item in all_items:
                    all_items[item] = (all_items[item][0] + 1,
                                       all_items[item][1] + score, 0)
                else:
                    all_items[item] = (1, score, 0)
            if print_tags:
                for word in sent:
                    print(word.text + '(' + word.tag_ +
                          ', ' + word.dep_ + ')', end=" ")
                print("ITEMS -> " + str(items) + "\n")
    for item in all_items:
        values = all_items[item]
        if values[1] < 0:
            score_weight = values[1] * -1  # make score positive
            # If score is less than half of count, divide by 8 but is +ve.
            if score_weight < values[0] / 2:
                score_weight = score_weight / 8
            else:  # if score is more than half of count, leave it negative.
                score_weight = values[1] / 2
        else:  # if score is positive, divide it by 2 because count is more important.
            score_weight = values[1] / 2
        all_items[item] = (values[0], values[1], values[0] * score_weight)
    return all_items


def get_highlights(path, total=-1, only=-1):
    csv = pandas.read_csv(path)
    restaurants = set(list(csv['restaurant_name']))
    restaurants = sorted(restaurants)
    stopwords.update(restaurants)
    highlights = {}
    count = 0
    if only != -1:
        total = -1
    for restaurant in restaurants:
        if count == total:
            break
        if only != -1 and (type(only) is int and only != count) or (type(only) is str and only != restaurant):
            continue
        reviews = list(csv.loc[csv['restaurant_name']
                               == restaurant]['review_content'])
        items = get_items_of_interest(reviews)
        items_list = sorted(items, key=lambda x: items[x][2], reverse=True)
        sorted_items = {}
        for item in items_list:
            sorted_items[item] = items.get(item)
        highlights[restaurant] = sorted_items
        count += 1
    return highlights


def analyze_sentiment_vader(sentence, neutral_threshold=0.5):
    score = sentiment_analyzer.polarity_scores(str(sentence))['compound']
    if score >= neutral_threshold:
        return 1
    elif score <= -neutral_threshold:
        return -1
    else:
        return 0


def analyze_sentiment_textblob(sentence):
    score = TextBlob(str(sentence)).sentiment.polarity
    if score > 0:
        return 1
    elif score < 0:
        return -1
    else:
        return -1


if not os.path.exists("stopwords.txt"):
    os.chdir("data_science/")
nlp = spacy.load("en")
# sentiment_analyzer = SentimentIntensityAnalyzer()
stopwords = load_lexicon("stopwords.txt")
