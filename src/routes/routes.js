const express = require('express');
const router = express.Router();
const Music = require('../models/Music');
const List = require('../models/List');

router.get('/healthcheck', (req, res) => {
    res.send('TODO OK');
});

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/start', (req, res) => {
    res.render('start');
});

router.get('/allMusics', async(req, res) => {
    try {
        const musics = await Music.find().sort({reproductions: 'desc'});
        res.json(musics);
    } catch (error) {
        console.log('Se produjo un error al cargar las músicas');
        console.error(error);
        res.json({
            error: 'Error al cargar las músicas'
        })
    }
    
});

router.post('/addMusic', async(req, res) => {
    const { name, idYoutube, image } = req.body;
    const newMusic = new Music();
    newMusic.name = name;
    newMusic.idYoutube = idYoutube;
    newMusic.image = image;
    newMusic.reproductions = 0;
    newMusic.favourite = false;
    try {
        const nMs = await Music.findOne({'idYoutube': idYoutube});
        if (nMs) {
            res.json({
                error: 'La música ya se guardó'
            })
        } else{
            await newMusic.save();
            res.json(newMusic);
        }
    } catch (error) {
        console.log('Error al guardar una núsica');
        console.error(error);
    }
});

router.post('/updateLike', async(req, res) => {
    const { idYoutube } = req.body;
    const music = await Music.findOne({idYoutube});
    if(music){
        if(music.favourite == false){
            try {
                await music.updateOne({$set: {favourite: true}});
                const musicup = await Music.findOne({idYoutube});
                res.json(musicup);
            } catch (error) {
                console.log('Se produjo un error al actualizar favoritos');
                console.error(error);
            }
            
        } else {
            try {
                await music.updateOne({$set: {favourite: false}});
                const musicup = await Music.findOne({idYoutube});
                res.json(musicup);
            } catch (error) {
                console.log('Se produjo un error al actualizar favoritos');
                console.error(error);
            }
        }
    } else {
        console.log('Musica no agregada. Primero agrega la música a cualquier lista, luego dale ♥');
    }
});

router.post('/deleteMusic', async(req, res) => {
    const { idYoutube } = req.body;
    console.log(idYoutube);
    try {
        const music = await Music.findOneAndDelete({idYoutube});
        if(music){
            res.json(music);
        } else {
            console.log('Música no encontrada para eliminar');
        }
    } catch (error) {
        console.log('Música no encontrada para eliminar');
        console.log(error);
    }
    
});

router.post('/RMusic', async(req, res) => {
    const { idYoutube } = req.body;
    try {
        const music = await Music.findOneAndUpdate({idYoutube}, {$inc: {'reproductions': 1}});
    } catch (error) {
        console.log('Ocurrió un error al actualizar las reproducciones');
    }
});

router.post('/addNewList', async(req, res) => {
    const { name, lists } = req.body;
    if(name != ''){
        try {
            let nameListUsed = await List.findOne({'name': name});
            if (nameListUsed) {
                res.json(error = {
                name: 'copy'
            });
            } else {
                let ids = lists.split(',');
                const newList = new List();
                newList.name = name;
                try {
                    await newList.save();
                    res.json(newList);
                    ids.forEach( async(e) => {
                        try {
                            await Music.findOneAndUpdate({idYoutube: e}, {$push: {'lists': name}});
                        } catch (error) {
                            console.log('Ocurrió un error al agregar la lista a las músicas');
                            console.log(error);
                        }
                    });
                } catch (error) {
                    console.log('Error al guardar una lista');
                    console.error(error);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
});

router.get('/allList', async(req, res) => {
    try {
        const lists = await List.find();
        res.json(lists);
    } catch (error) {
        console.log('Ocurrió un error al cargar las listas');
        console.log(error);
    }
});

router.post('/removeMusicList', async(req, res) => {
    const { idYoutube, nameList } = req.body;
    try {
        const music = await Music.findOneAndUpdate({ idYoutube: idYoutube }, {$pull : { 'lists': nameList }});
        res.json(music);
    } catch (error) {
        console.log('No se encontró la música para quitarla de una lista');
        console.log(error);
    }
})

router.post('/deleteList', async(req, res) => {
    const { nameList } = req.body;
    try {
        const list = await List.findOneAndDelete({ 'name': nameList});
        res.json(list)
    } catch (error) {
        console.log('No se pudo eliminar la lista');
        console.log(error);
    }
    try {
        const ms = await Music.updateMany({}, {$pull: { 'lists': nameList }})
    } catch (error) {
        console.log('No se pudo eliminar las musicas de la lista');
        console.log(error);
    }
});

router.post('/updateList', async(req, res) => {
    const { idYoutube, lists } = req.body;
    try {
        const music = await Music.findOne({idYoutube: idYoutube});
        let listasUsadas = [];
        for (let i = 0; i < lists.length; i++) {
            if(music.lists.includes(lists[i])){
                listasUsadas.push(lists[i]);
            } else {
                try {
                    await music.updateOne({$push :{ 'lists': lists[i]}});
                } catch (error) {
                    console.log('Error al añadir la musica en la lista');
                    console.log(error);
                }
            }
        }
        if (listasUsadas.length > 0 ) {
            res.json({
                listasUsadas
            });
        } else {
            res.json(music);
        }
    } catch (error) {
        console.log('Ocurrió un error al buscar la música');
        console.log(error);
    }
});

router.post('/updateNameList', async(req, res) =>{
    const { oldName, newName } = req.body;
    if(newName == ''){
        res.json({
            name: 'errorName'
        });
    } else {
        try {
            await List.findOneAndUpdate({ 'name': oldName}, {$set: {'name': newName}});
            await Music.updateMany({'lists': oldName}, {$set: { 'lists.$': newName}});
            res.json(req.body);
        } catch (error) {
            console.log('Ocurrió un error al cambiar el nombre de la lista');
            console.log(error);
            res.json({
                name: 'error'
            });
        }
    }
});
router.use((req, res, next) =>{
    res.status(404).render('404');
});

module.exports = router;