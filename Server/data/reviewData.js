const uuidv4 = require('uuid/v4');
const highlightsData = require("../data/highlightsData");
const highlightsDataCollection = require("./mongoCollections").highlights;

// async function addComment(comment, link, item = undefined) {
//     const highlights = await highlightsData.get(link);
//     comment.text = comment;
//     comment._id = uuidv4();
//     comment.date = new Date();
//     if (highlights) {
//         if (item) {
//             if (highlights.review.comments.item)
//                 highlights.review.comments.item.push(comment);
//             else
//                 highlights.review.comments.item = [comment];
//         }
//         else {
//             if (highlights.review.comments.restaurant_comments)
//                 highlights.review.comments.restaurant_comments.push(comment);
//             else
//                 highlights.review.comments.restaurant_comments = [comment];
//         }
//         return await highlightsData.update(highlights);
//     }
// }

async function addComment(commentText, link) {
    const highlights = await highlightsData.get(link);
    const comment = {};
    comment.text = commentText;
    comment._id = uuidv4();
    comment.date = new Date();
    if (highlights) {
        const highlightsCollection = await highlightsDataCollection();
        const op = await highlightsCollection.updateOne({ '_id': highlights._id }, { $push: { 'comments': comment } });
        if (op.modifiedCount == 0)
            throw "Comment was not published";
        else return comment;
    }
}

async function vote(vote, link, item) {
    const highlights = await highlightsData.get(link);
    if (highlights) {
        if (vote > 0)
            if (highlights.review.votes.item)
                highlights.review.votes[item].upVotes += 1;
            else {
                highlights.review.votes[item] = {};
                highlights.review.votes[item].upVotes = 1;
            }
        else {
            if (highlights.review.votes.item)
                highlights.review.votes[item].downVotes += 1;
            else {
                highlights.review.votes[item] = {};
                highlights.review.votes[item].downVotes = 1;
            }
        }
        return await highlightsData.update(highlights);
    }
}

// async function getComments(link, item = undefined) {
//     const highlights = await highlightsData.get(link);
//     let comments = [];
//     if (highlights) {
//         if (item)
//             comments = await highlightsData.get(link).review.comments[item];
//         else
//             comments = await highlightsData.get(link).review.comments.restaurant_comments;
//     }
//     return comments;
// }

// async function getVotes(link, item) {
//     const highlights = await highlightsData.get(link);
//     let upVotes = 0;
//     let downVotes = 0;
//     if (highlights.review.votes.item.upVotes)
//         upVotes = highlights.review.votes.item.upVotes;
//     if (highlights.review.votes.item.downVotes)
//         upVotes = highlights.review.votes.item.downVotes;
//     return { 'upVotes': upVotes, 'downVotes': downVotes };
// }

async function getComments(link) {
    const highlights = await highlightsData.get(link);
    let comments = [];
    if (highlights)
        comments = highlights.comments;
    return comments;
}

async function getVotes(link) {
    const highlights = await highlightsData.get(link);
    if (highlights)
        return highlights.review.votes;
}

module.exports = { addComment, vote, getComments, getVotes };