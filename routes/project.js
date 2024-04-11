const express = require('express')
const router = express.Router();

const { createProject,getProjects,updateProject,deleteProject,getProject } = require('../controllers/projectController')

router.post('/create',createProject)
router.get('/all/:userId',getProjects)
router.get('/:projectId',getProject)
router.patch('/update/:projectId',updateProject)
router.delete('/delete/:projectId',deleteProject)

module.exports = router;