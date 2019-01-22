const uuidv4 = require('uuid/v4');
const highlightsDataCollection = require("./mongoCollections").highlights;

async function get(url) {
    const highlightsCollection = await highlightsDataCollection();
    return await highlightsCollection.findOne({ 'url': url });
}

async function insert(highlights) {
    highlights._id = uuidv4();
    delete highlights.html_files;
    delete highlights.data_file;
    highlights.comments = [];
    const highlightsCollection = await highlightsDataCollection();
    if (await get(highlights.url))
        return await update(highlights);
    else {
        const op = await highlightsCollection.insertOne(highlights);
        if (op.insertedCount == 0)
            throw "Highlights cannot be inserted.";
        else
            return highlights;
    }
}

async function update(highlights) {
    delete highlights.html_files;
    delete highlights.data_file;
    const highlightsCollection = await highlightsDataCollection();
    try {
        const op = await highlightsCollection.replaceOne({ '_id': highlights._id }, highlights);
    } catch (error) {
        console.log(error);
    }
    if (op.modifiedCount == 0)
        throw "Highlights cannot be updated.";
    else
        return highlights;
}

module.exports = { get, insert, update };