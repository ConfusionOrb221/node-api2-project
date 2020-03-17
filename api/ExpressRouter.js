const express = require('express');
const db = require('../data/db');

const router = express.Router();

router.post('/', (req, res) =>{
    const info = req.body;
    console.log(info);
    if(info.title === undefined || info.contents === undefined){
        res.status(400).json({success: false, errorMessage: "Please provide title and contents for the post."});
        return res.end();
    } else {
        db.insert(info)
            .then(post =>{
                res.status(201).json({success: true, data: {...info, ...post}})
            })
            .catch(err => {
                res.status(500).json({success: false, errorMessage: "There was an error while saving the post to the database"})
                return res.end();   
            })
    }
});

router.post('/:id/comments', (req, res) =>{
    const info = req.body
    const id = req.params.id;

    console.log({
        ...info,
        id: id
    })

    if(info.text === undefined){
        res.status(400).json({success: false, errorMessage: "Please provide text for the comment."});
        return res.end();
    } else {
        db.insertComment({
            ...info,
            post_id: id
        })
            .then(comment =>{
                if(comment){
                    res.status(201).json({success: true, data: {...comment, ...id}})
                } else {
                    res.status(404).json({success: false, errorMessage: "The post with the specified ID does not exist."})
                    return res.end();
                }
            })
            .catch(err => {
                res.status(500).json({success: false, errorMessage: "There was an error while saving the comment to the database."})
                return res.end();   
            })
    }
});

router.get('/', (req, res) =>{
    db.find()
        .then(post =>{
            res.status(200).json({success: true, data: post})
        })
        .catch(err =>{
            res.status(500).json({success: false, errorMessage: "All posts information could not be retrieved."})
            return res.end();
        })
});

router.get('/:id', (req, res) =>{
    const id = req.params.id;

    db.findById(id)
        .then(post =>{
            if(post){
                res.status(200).json({success: true, data: post});
            } else {
                res.status(500).json({success: false, errorMessage: "The post with specified id could not be retrieved."})
                return res.end();
            }
        })
        .catch(err =>{
            res.status(500).json({success: false, errorMessage: "The post information could not be retrieved."})
            return res.end();
        })
});

router.get('/:id/comments', (req, res) =>{
    const id = req.params.id;
    db.findPostComments(id)
        .then(comment =>{
            if(comment){
                res.status(200).json({success: true, data: comment});
            } else {
                res.status(404).json({success: false, errorMessage: "The comment with the specified ID does not exist."})
                return res.end();
            }
        })
        .catch(err =>{
            res.status(500).json({success: false, errorMessage: "The comment information could not be retrieved."})
            return res.end();
        })
});

router.delete('/:id', (req, res) =>{
    const id = req.params.id;
    db.remove(id)
        .then(comment =>{
            if(comment){
                res.status(201).json({success: true, data: comment});
            } else {
                res.status(404).json({success: false, errorMessage: "The post with the specified ID does not exist."})
                return res.end();
            }
        })
        .catch(err =>{
            res.status(500).json({success: false, errorMessage: "The post could not be removed."})
            return res.end();
        })
});

router.put('/:id', (req, res) =>{
    const id = req.params.id;
    const info = req.body;
    if(!info.title || !info.contents){
        res.status(400).json({success: false, errorMessage: "Please provide title and contents for the post."})
        return res.end();
    } else {
        db.update(id, info)
            .then(post =>{
                if(post){
                    res.status(200).json({success: true, data: {...info, id: id}})
                } else {
                    res.status(404).json({success: false, errorMessage: "The post with the specified ID does not exist."})
                    return res.end();
                }
            })
            .catch(err =>{
                res.status(500).json({success: false, errorMessage: "The post information could not be modified."})
                return res.end();
            })
    }
});


module.exports = router;