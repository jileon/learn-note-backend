const express = require('express');
const Folder = require('../models/folder');
const validateFolder = require('./validation/folder');

const router = express.Router();

router.get('/', (req, res, next) => {
  const userId = req.user.id;

  Folder.query()
    .where({ userId })
    .then(folders => {
      return res.json(folders);
    })
    .catch(next);
});

router.put('/:id', validateFolder, (req, res, next) => {
  const folderId = req.params.id;
  const userId = req.user.id;
  const { title } = req.body;

  Folder.query()
    .update({ title })
    .where({ userId, id: folderId })
    .returning('*')
    .first()
    .then((folder) => {
      if(!folder) return Promise.reject();
      return res.status(201).json(folder);
    })
    .catch(next);

});

router.post('/', validateFolder, (req, res, next) => {
  const userId = req.user.id;
  const { title } = req.body;

  Folder.query()
    .where({ userId, title })
    .first()
    .then(folder => {
      if(folder){
        const err = new Error('Folder with this title already exists');
        err.status = 422;
        return Promise.reject(err);
      }
      return Folder.query()
        .insert({ title, userId })
        .returning('*');
    })
    .then(folder => {
      return res.status(201).json(folder);
    })
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  const userId  = req.user.id;
  const folderId = req.params.id;

  Folder.query()
    .delete()
    .where({ userId, id: folderId })
    .returning('*')
    .first()
    .then(folder => {
      if(!folder) return Promise.reject();
      return res.sendStatus(204);
    })
    .catch(next);
});

module.exports = router;