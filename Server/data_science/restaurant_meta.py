# -*- coding: utf-8 -*-

# Sanjeevi Lingam Rajasekaran

import os
import pickle
import time


class RestaurantMeta:
    def __init__(self):
        self.timestamp = time.time()
        self.metadata = {}

    def save(self, url=None, name=None, total_reviews=0, html_files=None, data_file=None, highlights=None):
        if url is not None:
            self.metadata['url'] = url
        if name is not None:
            self.metadata['name'] = name
        if total_reviews is not None:
            self.metadata['total_reviews'] = total_reviews
        if html_files is not None:
            self.metadata['html_files'] = html_files
        if data_file is not None:
            self.metadata['data_file'] = data_file
        if highlights is not None:
            self.metadata['highlights'] = highlights
        filename = 'data/' + name + '/' + name + '.meta'
        meta = {}
        if os.path.isfile(filename):
            with open(filename, mode="rb") as inp:
                meta = pickle.load(inp)
        meta[self.timestamp] = self.metadata
        with open(filename, mode="wb") as out:
            pickle.dump(meta, out, pickle.HIGHEST_PROTOCOL)
            out.close()
        return self

    def load_latest(self, file):
        if os.path.isfile(file):
            with open(file, mode="rb") as inp:
                meta = pickle.load(inp)
                self.metadata = meta[next(iter(meta))]
