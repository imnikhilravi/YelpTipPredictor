const express = require('express');
const router = express.Router();
const redisConnection = require('../redis-connection');
const highlightsData = require("../data/highlightsData");
const reviewData = require("../data/reviewData");

router.post("/", async (req, res) => {
    redisConnection.on('post-highlights-existing', async (highlights, channel) => {
        res.json(highlights);
    });

    redisConnection.on('post-highlights-new', async (highlights, channel) => {
        try {
            await highlightsData.insert(highlights);
            res.json(highlights);
        } catch (error) {
            res.json({ 'error': 'There was an issue processing the request.' });
        }
    });
    redisConnection.emit('get-highlights', { 'url': req.body.url, 'forceNew': req.body.forceNew });
});

router.post("/review/vote", async (req, res) => {
    try {
        const highlights = await reviewData.vote(req.body.vote, req.body.url, req.body.item);
        res.json(highlights.review.votes[req.body.item]);
    }
    catch (error) {
        res.json({ 'error': 'There was an issue processing the voting request.' });
    }
});

router.post("/review/comment", async (req, res) => {
    try {
        const newComment = await reviewData.addComment(req.body.comment, req.body.url);
        res.json(newComment);
    }
    catch (error) {
        res.json({ 'error': 'There was an issue processing the request.' });
    }
});

router.get("/review/votes", async (req, res) => {
    try {
        const votes = await reviewData.getVotes(req.query.url);
        res.json(votes);
    }
    catch (error) {
        res.json({ 'error': 'There was an issue processing the request.' });
    }
});

router.get("/review/comments", async (req, res) => {
    try {
        const comments = await reviewData.getComments(req.query.url);
        res.json(comments);
    }
    catch (error) {
        res.json({ 'error': 'There was an issue processing the request.' });
    }
});

module.exports = router;