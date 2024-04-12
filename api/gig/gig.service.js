import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb

// const PAGE_SIZE = 3

async function query(filterBy = { txt: '', category: '', minPrice: '', maxPrice: Infinity, deliveryTime: Infinity }) {
    try {
        const criteria = {}
        if (filterBy.txt) {
            criteria.$or = [
                { title: { $regex: filterBy.txt, $options: 'i' } },
                { description: { $regex: filterBy.txt, $options: 'i' } }
            ]
        }

        if (filterBy.category) {
            criteria.tags = filterBy.category
        }

        if (filterBy.minPrice !== '') {
            criteria.price = { $gte: filterBy.minPrice }
        }

        if (filterBy.maxPrice !== Infinity) {
            criteria.price = { ...criteria.price, $lte: filterBy.maxPrice }
        }

        if (filterBy.deliveryTime !== Infinity) {
            criteria.daysToMake = { $lte: filterBy.deliveryTime }
        }


        const collection = await dbService.getCollection('gig')
        const gigs = await collection.find(criteria).toArray()
        return gigs
        // var gigCursor = await collection.find(criteria)

        // if (filterBy.pageIdx !== undefined) {
        //     gigCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)
        // }

        // const gigs = gigCursor.toArray()
        // return gigs
    } catch (err) {
        logger.error('cannot find gigs', err)
        throw err
    }
}

async function getById(gigId) {
    try {
        const collection = await dbService.getCollection('gig')
        const gig = collection.findOne({ _id: new ObjectId(gigId) })
        return gig
    } catch (err) {
        logger.error(`while finding gig ${gigId}`, err)
        throw err
    }
}

async function remove(gigId) {
    try {
        const collection = await dbService.getCollection('gig')
        await collection.deleteOne({ _id: new ObjectId(gigId) })
        return gigId
    } catch (err) {
        logger.error(`cannot remove gig ${gigId}`, err)
        throw err
    }
}

async function add(gig) {
    try {
        const collection = await dbService.getCollection('gig')
        await collection.insertOne(gig)
        return gig
    } catch (err) {
        logger.error('cannot insert gig', err)
        throw err
    }
}

async function update(gig) {
    try {
        const gigToSave = {
            title: gig.title,
            price: gig.price
        }
        const collection = await dbService.getCollection('gig')
        await collection.updateOne({ _id: new ObjectId(gig._id) }, { $set: gigToSave })
        return gig
    } catch (err) {
        logger.error(`cannot update gig ${gigId}`, err)
        throw err
    }
}

async function addGigReview(gigId, review) {
    try {
        review.id = utilService.makeId()
        const collection = await dbService.getCollection('gig')
        await collection.updateOne({ _id: new ObjectId(gigId) }, { $push: { reviews: review } })
        return review
    } catch (err) {
        logger.error(`cannot add gig review ${gigId}`, err)
        throw err
    }
}

async function removeGigReview(gigId, reviewId) {
    try {
        const collection = await dbService.getCollection('gig')
        await collection.updateOne({ _id: new ObjectId(gigId) }, { $pull: { reviews: { id: reviewId } } })
        return reviewId
    } catch (err) {
        logger.error(`cannot add gig review ${gigId}`, err)
        throw err
    }
}

export const gigService = {
    remove,
    query,
    getById,
    add,
    update,
    addGigReview,
    removeGigReview
}
