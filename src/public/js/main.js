
/*---------------------Efecto del boton Start------------------ */
var btnStart = document.getElementById('btn-start');

if(btnStart){
    btnStart.addEventListener('mouseenter', function(e){
        let span = document.getElementById('span');
        let x = e.pageX - this.offsetLeft;
        let y = e.pageY - this.offsetTop;
        span.style.left = `${x}px`;
        span.style.top = `${y}px`;
    });
    btnStart.addEventListener('mouseout', function(e){
        let span = document.getElementById('span');
        let x = e.pageX - this.offsetLeft;
        let y = e.pageY - this.offsetTop;
        span.style.left = `${x}px`;
        span.style.top = `${y}px`;
    });
}

/*---------------------Barra de botones(Efecto)-------------------- */
var btnsBarras = document.querySelectorAll('.btn-barras');
var contenedorBarras = document.querySelector('.controls-barras');

if(contenedorBarras){
    contenedorBarras.addEventListener('click', function(e){
        btnsBarras.forEach(e => {
            e.classList.remove('btn-selected');
        });
        let btn = e.target;
        btn.classList.add('btn-selected');
    });
}
/*------------------------------------------------------------------- */
var btnInicio = document.getElementById('btn-inicio');
var btnMisListas = document.getElementById('btn-misListas');
var btnExplorar = document.getElementById('btn-explorar');

if(btnInicio && btnMisListas && btnExplorar){
    let containerInicio = document.querySelector('.container-inicio');
    let containerMisListas = document.querySelector('.container-misListas');
    let containerExplorar = document.querySelector('.container-explorar');
    
    btnInicio.addEventListener('click', function(){
        containerInicio.style.display = 'block';
        containerMisListas.style.display = 'none';
        containerExplorar.style.display = 'none';
    });
    btnMisListas.addEventListener('click', function(){
        containerInicio.style.display = 'none';
        containerMisListas.style.display = 'block';
        containerExplorar.style.display = 'none';
    });
    btnExplorar.addEventListener('click', function(){
        containerInicio.style.display = 'none';
        containerMisListas.style.display = 'none';
        containerExplorar.style.display = 'block';
    });
}

/*-------------------------Buscar Canciones----------------- */
var btnSearchMusic = document.getElementById('btn-searchMusic');
var inputSearchMusic = document.getElementById('input-searchMusic');
var containerResults = document.querySelector('.explorar-body');

if(btnSearchMusic){
    btnSearchMusic.addEventListener('click', function(){
        const search = document.getElementById('input-searchMusic').value;
        const key = 'AIzaSyBW6RKHfe8NxWewReaLKoae9Tv8jchfhcw';
        const resPorPage = 9;
        let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${key}&type=video&order=relevance&maxResults=${resPorPage}&q=${search}`;
        containerResults.innerHTML = '';
        if(search!=''){
            fetch(url)
            .then(res => res.json())
            .then(data => {
                for (let i = 0; i < data.items.length; i++) {
                    containerResults.innerHTML += `
                    <div class="item-explorar">
                        <div class="item-explorar-img">
                            <img class='music-image' src="${data.items[i].snippet.thumbnails.high.url}" alt="${data.items[i].snippet.title}">
                            <div class="iconPlay">
                                <i class="far fa-play-circle" id='${data.items[i].id.videoId}'></i>
                            </div>
                        </div>
                        <div class="item-explorar-txt">
                            <label class='music-name'>${data.items[i].snippet.title}</label>
                            <input type='hidden' class='music-id' value='${data.items[i].id.videoId}'>
                        </div>
                        <div class="item-explorar-add">
                            <i class="btn-addMusic fas fa-plus " id='btn-addMusic' name='${i}'></i>
                        </div>
                    </div>
                    `
                }
            }).catch(e => {
                console.log(e);
                mostrarMessage('Ocurrió un error', rojo)
            });
        }
    
    });
}

/*-------------------------Agregar musica--------------------- */
var musicName = document.getElementsByClassName('music-name');
var musicId = document.getElementsByClassName('music-id');
var musicImage = document.getElementsByClassName('music-image');

var btnsAddMusic = document.getElementsByClassName('btn-addMusic');

if(containerResults){
    containerResults.addEventListener('click', e => {
        if(e.target.id == 'btn-addMusic'){
            let n = e.target.getAttribute('name');
            n = parseInt(n);
            const musicSelected = {
                name: CalpitalizeName(musicName[n].innerHTML),
                idYoutube: musicId[n].value,
                image: musicImage[n].src
            }
    
            fetch('/addMusic', {
                method: 'POST',
                body: JSON.stringify(musicSelected),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    if(data.idYoutube == musicId[n].value){
                        mostrarMessage('Música agregada correctamente', verde);
                    } 
                    else if(data.error){
                        mostrarMessage(`${data.error}`, amarillo);
                    }
                    else {
                        mostrarMessage('Ocurrió un error', amarillo);       
                    }
                }).catch(e => {
                    console.log(e);
                    mostrarMessage('Ocurrió un error', rojo)
                });
            /********************************** */
            ObtenerTodasLasCanciones().then(m => {
                var allMusics = m;
                actualizarLasMusicas(allMusics);
            }).catch(e => {
                console.log(e);
                mostrarMessage('Ocurrió un error', rojo)
            });
        }
    });
}
const verde = '#95b602';
const rojo = '#e72b2b';
const amarillo = '#f3db05';
const negro = '#000';
/*------------------Función para mostrar msg----------------- */
function mostrarMessage(mensaje, color){
    let anuncio = document.querySelector('.anuncio');
    let msg = document.querySelector('.msg');
    
    if(anuncio){
        anuncio.style.display = 'flex';
        msg.style.background = color;
        msg.innerHTML = mensaje;
        setTimeout(() => {
            anuncio.style.display = 'none';
        }, 3000);
    }
}


/*-----------------funcion para estilizar el nombre----------------- */
function CalpitalizeName(str){
    string = str.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    return string;
}

/*--------------------Llamar a todas las canciones------------- */
async function ObtenerTodasLasCanciones(){
    const response = await fetch('/allMusics');
    const musics = await response.json();
    return musics;
}
ObtenerTodasLasCanciones().then( m => {
    var allMusics = m;
    actualizarLasMusicas(allMusics);
})
.catch(e => {
    console.log(e);
    mostrarMessage('Ocurrió un error', rojo)
});
/**-------------Actulizar sin refrescar la pagina-------------- */
function actualizarLasMusicas(allMusics){
    listarTodaslasCancionesEnInicio(allMusics);
    listarTodaslasCancionesFavoritasEnInicio(allMusics);
    listarTodaslasCancionesMasEscuchadasEnInicio(allMusics);
    listarTodaslasCancionesEnMisListas(allMusics);
    listarTodaslasCancionesFavoritasEnMisListas(allMusics);
    listarTodaslasCancionesEnListasCreadas(allMusics);
    listarTodasLasCancionesEnElForm(allMusics)
}



/*--------------------Llamar a todas las listas------------- */
async function ObtenerTodasLasListas(){
    const response = await fetch('/allList');
    const allLists = await response.json();
    return allLists;
}
ObtenerTodasLasListas().then( l => {
    var allLists = l;
    listarListasEnElForm(allLists);
})
.catch(e => {
    console.log(e);
    mostrarMessage('Ocurrió un error', rojo)
});




/*---------------Listas todas las canciones en Inicio----- -------*/
function listarTodaslasCancionesEnInicio(allMusics){
    let contenedorDeTodasLasCanciones = document.querySelector('.all-list');
    if(contenedorDeTodasLasCanciones){
        contenedorDeTodasLasCanciones.innerHTML = '';
        if(allMusics.length <= 6){
            for (let i = 0; i < allMusics.length; i++) {
                if(allMusics[i].favourite == true){
                    contenedorDeTodasLasCanciones.innerHTML += `
                    <div class="item-list">
                        <img src="${allMusics[i].image}" alt="${allMusics[i].name}">
                        <div class="item-textContainer">
                            <div class="itemRow textName">
                                <label>${allMusics[i].name}</label>
                            </div>
                            <div class="itemRow textPlay">
                                <button><i class="far fa-play-circle" id='${allMusics[i].idYoutube}'></i></button>
                            </div>
                            <div class="itemRow textLike">
                                <button><i class="fas fa-heart" id='${allMusics[i].idYoutube}'></i></button>
                            </div>
                        </div>
                    </div>
                    `;
                } else {
                    contenedorDeTodasLasCanciones.innerHTML += `
                    <div class="item-list">
                        <img src="${allMusics[i].image}" alt="${allMusics[i].name}">
                        <div class="item-textContainer">
                            <div class="itemRow textName">
                                <label>${allMusics[i].name}</label>
                            </div>
                            <div class="itemRow textPlay">
                                <button><i class="far fa-play-circle" id='${allMusics[i].idYoutube}'></i></button>
                            </div>
                            <div class="itemRow textLike">
                                <button><i class="far fa-heart" id='${allMusics[i].idYoutube}'></i></button>
                            </div>
                        </div>
                    </div>
                    `;
                }
            }
        } else{
            for (let i = 0; i < 6; i++) {
                if(allMusics[i].favourite == true) {
                    contenedorDeTodasLasCanciones.innerHTML += `
                    <div class="item-list">
                        <img src="${allMusics[i].image}" alt="${allMusics[i].name}">
                        <div class="item-textContainer">
                            <div class="itemRow textName">
                                <label>${allMusics[i].name}</label>
                            </div>
                            <div class="itemRow textPlay">
                                <button><i class="far fa-play-circle" id='${allMusics[i].idYoutube}'></i></button>
                            </div>
                            <div class="itemRow textLike">
                                <button><i class="fas fa-heart" id='${allMusics[i].idYoutube}'></i></button>
                            </div>
                        </div>
                    </div>
                    `
                }else {
                    contenedorDeTodasLasCanciones.innerHTML += `
                <div class="item-list">
                    <img src="${allMusics[i].image}" alt="${allMusics[i].name}">
                    <div class="item-textContainer">
                        <div class="itemRow textName">
                            <label>${allMusics[i].name}</label>
                        </div>
                        <div class="itemRow textPlay">
                            <button><i class="far fa-play-circle" id='${allMusics[i].idYoutube}'></i></button>
                        </div>
                        <div class="itemRow textLike">
                            <button><i class="far fa-heart" id='${allMusics[i].idYoutube}'></i></button>
                        </div>
                    </div>
                </div>
                `;
                }
            }
        }
    }
}
/*---------------Listas todas las canciones favoritas en Inicio----- -------*/
function listarTodaslasCancionesFavoritasEnInicio(allMusics){
    let contenedorDeTodasLasCancionesFavoritas = document.querySelector('.favourites-list');
    contenedorDeTodasLasCancionesFavoritas.innerHTML = '';
    var favouritesMusics = [];
    for (let i = 0; i < allMusics.length; i++) {
        if(allMusics[i].favourite == true){
            favouritesMusics.push(allMusics[i]);
        }
    }
    if(favouritesMusics.length <= 6){
        for (let i = 0; i < favouritesMusics.length; i++) {
            contenedorDeTodasLasCancionesFavoritas.innerHTML += `
                <div class="item-list">
                    <img src="${favouritesMusics[i].image}" alt="${favouritesMusics[i].name}">
                    <div class="item-textContainer">
                        <div class="itemRow textName">
                            <label>${favouritesMusics[i].name}</label>
                        </div>
                        <div class="itemRow textPlay">
                            <button><i class="far fa-play-circle" id='${favouritesMusics[i].idYoutube}'></i></button>
                        </div>
                        <div class="itemRow textLike">
                            <button><i class="fas fa-heart" id='${favouritesMusics[i].idYoutube}'></i></button>
                        </div>
                    </div>
                </div>
                `;
        }
    } else {
        for (let i = 0; i < 6; i++) {
            contenedorDeTodasLasCancionesFavoritas.innerHTML += `
                <div class="item-list">
                    <img src="${favouritesMusics[i].image}" alt="${favouritesMusics[i].name}">
                    <div class="item-textContainer">
                        <div class="itemRow textName">
                            <label>${favouritesMusics[i].name}</label>
                        </div>
                        <div class="itemRow textPlay">
                            <button><i class="far fa-play-circle" id='${favouritesMusics[i].idYoutube}'></i></button>
                        </div>
                        <div class="itemRow textLike">
                            <button><i class="fas fa-heart" id='${favouritesMusics[i].idYoutube}'></i></button>
                        </div>
                    </div>
                </div>
                `;
        }
    }
}
/*--------Listas todas las canciones más escuchadas en Inicio-------*/
function listarTodaslasCancionesMasEscuchadasEnInicio(allMusics){
    let contenedorDeTodasLasCancionesMasEscuchadas = document.querySelector('.mostPlayed-list');
    contenedorDeTodasLasCancionesMasEscuchadas.innerHTML = '';
    if(allMusics.length <= 6){
        for (let i = 0; i < allMusics.length; i++) {
            if(allMusics[i].favourite == true){
                contenedorDeTodasLasCancionesMasEscuchadas.innerHTML += `
                <div class="item-list">
                    <img src="${allMusics[i].image}" alt="${allMusics[i].name}">
                    <div class="item-textContainer">
                        <div class="itemRow textName">
                            <label>${allMusics[i].name}</label>
                        </div>
                        <div class="itemRow textPlay">
                            <button><i class="far fa-play-circle" id='${allMusics[i].idYoutube}'></i></button>
                        </div>
                        <div class="itemRow textLike">
                            <button><i class="fas fa-heart" id='${allMusics[i].idYoutube}'></i></button>
                        </div>
                    </div>
                </div>
                `;
            } else {
                contenedorDeTodasLasCancionesMasEscuchadas.innerHTML += `
                <div class="item-list">
                    <img src="${allMusics[i].image}" alt="${allMusics[i].name}">
                    <div class="item-textContainer">
                        <div class="itemRow textName">
                            <label>${allMusics[i].name}</label>
                        </div>
                        <div class="itemRow textPlay">
                            <button><i class="far fa-play-circle" id='${allMusics[i].idYoutube}'></i></button>
                        </div>
                        <div class="itemRow textLike">
                            <button><i class="far fa-heart" id='${allMusics[i].idYoutube}'></i></button>
                        </div>
                    </div>
                </div>
                `;
            }
        }
    } else {
        for (let i = 0; i < 6; i++) {
            if(allMusics[i].favourite == true){
                contenedorDeTodasLasCancionesMasEscuchadas.innerHTML += `
                <div class="item-list">
                    <img src="${allMusics[i].image}" alt="${allMusics[i].name}">
                    <div class="item-textContainer">
                        <div class="itemRow textName">
                            <label>${allMusics[i].name}</label>
                        </div>
                        <div class="itemRow textPlay">
                            <button><i class="far fa-play-circle" id='${allMusics[i].idYoutube}'></i></button>
                        </div>
                        <div class="itemRow textLike">
                            <button><i class="fas fa-heart" id='${allMusics[i].idYoutube}'></i></button>
                        </div>
                    </div>
                </div>
                `;
            } else {
                contenedorDeTodasLasCancionesMasEscuchadas.innerHTML += `
                <div class="item-list">
                    <img src="${allMusics[i].image}" alt="${allMusics[i].name}">
                    <div class="item-textContainer">
                        <div class="itemRow textName">
                            <label>${allMusics[i].name}</label>
                        </div>
                        <div class="itemRow textPlay">
                            <button><i class="far fa-play-circle" id='${allMusics[i].idYoutube}'></i></button>
                        </div>
                        <div class="itemRow textLike">
                            <button><i class="far fa-heart" id='${allMusics[i].idYoutube}'></i></button>
                        </div>
                    </div>
                </div>
                `;
            }
        }
    }
    
}



/*-----------------Listar Todas las músicas en misListas ---------*/
function listarTodaslasCancionesEnMisListas(allMusics){
    let contenedorDeTodasLasCancionesEnMisListas = document.querySelector(".AllmusicMyLists");
    contenedorDeTodasLasCancionesEnMisListas.innerHTML = '';
    if(allMusics.length <= 3){
        for (let i = 0; i < allMusics.length; i++) {
            if(allMusics[i].favourite == true){
                contenedorDeTodasLasCancionesEnMisListas.innerHTML += `
                <div class="item-misListas">
                    <div class="item-mislistas-img">
                        <img src="${allMusics[i].image}" alt="${allMusics[i].name}">
                        <div class="iconPlay">
                            <i class="far fa-play-circle" id='${allMusics[i].idYoutube}'></i>
                        </div>
                    </div>
                    <div class="item-mislistas-txt">
                        <label>${allMusics[i].name}</label>
                        <i class="fas fa-heart" id='${allMusics[i].idYoutube}'></i>
                    </div>
                    <div class="item-mislistas-close">
                        <i class="fas fa-plus agregarAunaLista" id='${allMusics[i].idYoutube}'></i>
                        <i class="fas fa-times" id='${allMusics[i].idYoutube}'></i>
                    </div>
                </div>
                `;
            } else {
                contenedorDeTodasLasCancionesEnMisListas.innerHTML += `
                <div class="item-misListas">
                    <div class="item-mislistas-img">
                        <img src="${allMusics[i].image}" alt="${allMusics[i].name}">
                        <div class="iconPlay">
                            <i class="far fa-play-circle" id='${allMusics[i].idYoutube}'></i>
                        </div>
                    </div>
                    <div class="item-mislistas-txt">
                        <label>${allMusics[i].name}</label>
                        <i class="far fa-heart" id='${allMusics[i].idYoutube}'></i>
                    </div>
                    <div class="item-mislistas-close">
                        <i class="fas fa-plus agregarAunaLista" id='${allMusics[i].idYoutube}'></i>
                        <i class="fas fa-times" id='${allMusics[i].idYoutube}'></i>
                    </div>
                </div>
                `;
            }
            
        }
    } else {
        for (let i = 0; i < 3; i++) {
            if(allMusics[i].favourite == true){
                contenedorDeTodasLasCancionesEnMisListas.innerHTML += `
                <div class="item-misListas">
                    <div class="item-mislistas-img">
                        <img src="${allMusics[i].image}" alt="${allMusics[i].name}">
                        <div class="iconPlay">
                            <i class="far fa-play-circle" id='${allMusics[i].idYoutube}'></i>
                        </div>
                    </div>
                    <div class="item-mislistas-txt">
                        <label>${allMusics[i].name}</label>
                        <i class="fas fa-heart" id='${allMusics[i].idYoutube}'></i>
                    </div>
                    <div class="item-mislistas-close">
                        <i class="fas fa-plus agregarAunaLista" id='${allMusics[i].idYoutube}'></i>
                        <i class="fas fa-times" id='${allMusics[i].idYoutube}'></i>
                    </div>
                </div>
                `;
            } else {
                contenedorDeTodasLasCancionesEnMisListas.innerHTML += `
                <div class="item-misListas">
                    <div class="item-mislistas-img">
                        <img src="${allMusics[i].image}" alt="${allMusics[i].name}">
                        <div class="iconPlay">
                            <i class="far fa-play-circle" id='${allMusics[i].idYoutube}'></i>
                        </div>
                    </div>
                    <div class="item-mislistas-txt">
                        <label>${allMusics[i].name}</label>
                        <i class="far fa-heart" id='${allMusics[i].idYoutube}'></i>
                    </div>
                    <div class="item-mislistas-close">
                        <i class="fas fa-plus agregarAunaLista" id='${allMusics[i].idYoutube}'></i>
                        <i class="fas fa-times" id='${allMusics[i].idYoutube}'></i>
                    </div>
                </div>
                `;
            }
        }
        contenedorDeTodasLasCancionesEnMisListas.innerHTML += `
            <div class="item-mostrarMas">
                <div class="mostrarMas">
                    <i class="fas fa-plus" id='btn-mostrarMasEnTodas'></i>
                    <label>${allMusics.length-3} más</label>
                </div>
            </div>
        `;
    }
    
    let btnMostrarMasEnTodas = document.getElementById('btn-mostrarMasEnTodas');
    if(btnMostrarMasEnTodas){
        btnMostrarMasEnTodas.addEventListener('click', function(){
            mostrarMasEnTodas(allMusics);
        });
    }
    function mostrarMasEnTodas(allMusics){
        contenedorDeTodasLasCancionesEnMisListas.innerHTML = '';
        for (let i = 0; i < allMusics.length; i++) {
            if(allMusics[i].favourite == true){
                contenedorDeTodasLasCancionesEnMisListas.innerHTML += `
                <div class="item-misListas">
                    <div class="item-mislistas-img">
                        <img src="${allMusics[i].image}" alt="${allMusics[i].name}">
                        <div class="iconPlay">
                            <i class="far fa-play-circle" id='${allMusics[i].idYoutube}'></i>
                        </div>
                    </div>
                    <div class="item-mislistas-txt">
                        <label>${allMusics[i].name}</label>
                        <i class="fas fa-heart" id='${allMusics[i].idYoutube}'></i>
                    </div>
                    <div class="item-mislistas-close">
                        <i class="fas fa-plus agregarAunaLista" id='${allMusics[i].idYoutube}'></i>
                        <i class="fas fa-times" id='${allMusics[i].idYoutube}'></i>
                    </div>
                </div>
                `;
            } else {
                contenedorDeTodasLasCancionesEnMisListas.innerHTML += `
                <div class="item-misListas">
                    <div class="item-mislistas-img">
                        <img src="${allMusics[i].image}" alt="${allMusics[i].name}">
                        <div class="iconPlay">
                            <i class="far fa-play-circle" id='${allMusics[i].idYoutube}'></i>
                        </div>
                    </div>
                    <div class="item-mislistas-txt">
                        <label>${allMusics[i].name}</label>
                        <i class="far fa-heart" id='${allMusics[i].idYoutube}'></i>
                    </div>
                    <div class="item-mislistas-close">
                        <i class="fas fa-plus agregarAunaLista" id='${allMusics[i].idYoutube}'></i>
                        <i class="fas fa-times" id='${allMusics[i].idYoutube}'></i>
                    </div>
                </div>
                `;
            }
        }
        contenedorDeTodasLasCancionesEnMisListas.innerHTML += `
            <div class="item-mostrarMas">
                <div class="mostrarMas">
                <i class="fas fa-minus" id='btn-mostrarMenosEnTodas'></i>
                    <label>Mostrar menos</label>
                </div>
            </div>
        `;
        let btnMostrarMenosEnTodas = document.getElementById('btn-mostrarMenosEnTodas');
        if(btnMostrarMenosEnTodas){
            btnMostrarMenosEnTodas.addEventListener('click', function(){
            listarTodaslasCancionesEnMisListas(allMusics);
            });
        }
    }
    
}
/*-----------------Listar músicas favoritas en misListas ---------*/
function listarTodaslasCancionesFavoritasEnMisListas(allMusics){
    let contenedorDeTodasLasCancionesFavoritasEnMisListas = document.querySelector(".AllFavouritesMusicsMyLists");
    contenedorDeTodasLasCancionesFavoritasEnMisListas.innerHTML = '';
    let favouritesM = 0;
    for (let i = 0; i < allMusics.length; i++) {
        if(allMusics[i].favourite == true){
            favouritesM += 1;
        }
    }
    if(favouritesM <= 3){
        for (let i = 0; i < allMusics.length; i++) {
            if(allMusics[i].favourite == true){
                contenedorDeTodasLasCancionesFavoritasEnMisListas.innerHTML += `
                <div class="item-misListas">
                    <div class="item-mislistas-img">
                        <img src="${allMusics[i].image}" alt="${allMusics[i].name}">
                        <div class="iconPlay">
                            <i class="far fa-play-circle" id='${allMusics[i].idYoutube}'></i>
                        </div>
                    </div>
                    <div class="item-mislistas-txt">
                        <label>${allMusics[i].name}</label>
                        <i class="fas fa-heart" id='${allMusics[i].idYoutube}'></i>
                    </div>
                </div>
                `;
            }
        }
    } else {
        for (let i = 0; i < 3; i++) {
            if(allMusics[i].favourite == true){
                contenedorDeTodasLasCancionesFavoritasEnMisListas.innerHTML += `
                <div class="item-misListas">
                    <div class="item-mislistas-img">
                        <img src="${allMusics[i].image}" alt="${allMusics[i].name}">
                        <div class="iconPlay">
                            <i class="far fa-play-circle" id='${allMusics[i].idYoutube}'></i>
                        </div>
                    </div>
                    <div class="item-mislistas-txt">
                        <label>${allMusics[i].name}</label>
                        <i class="fas fa-heart" id='${allMusics[i].idYoutube}'></i>
                    </div>
                </div>
                `;
            }
        }
        contenedorDeTodasLasCancionesFavoritasEnMisListas.innerHTML += `
            <div class="item-mostrarMas">
                <div class="mostrarMas">
                    <i class="fas fa-plus" id='btn-mostrarMasEnTodasLasFavoritas'></i>
                    <label>${favouritesM-3} más</label>
                </div>
            </div>
        `;
    }
    
    let btnMostrarMasEnTodasLasFavoritas = document.getElementById('btn-mostrarMasEnTodasLasFavoritas');
    if(btnMostrarMasEnTodasLasFavoritas){
        btnMostrarMasEnTodasLasFavoritas.addEventListener('click', function(){
            mostrarMasEnTodasLasFavoritas(allMusics);
        });
    }
    function mostrarMasEnTodasLasFavoritas(allMusics){
        contenedorDeTodasLasCancionesFavoritasEnMisListas.innerHTML = '';
        for (let i = 0; i < allMusics.length; i++) {
            if(allMusics[i].favourite == true){
                contenedorDeTodasLasCancionesFavoritasEnMisListas.innerHTML += `
                <div class="item-misListas">
                    <div class="item-mislistas-img">
                        <img src="${allMusics[i].image}" alt="${allMusics[i].name}">
                        <div class="iconPlay">
                            <i class="far fa-play-circle" id='${allMusics[i].idYoutube}'></i>
                        </div>
                    </div>
                    <div class="item-mislistas-txt">
                        <label>${allMusics[i].name}</label>
                        <i class="fas fa-heart" id='${allMusics[i].idYoutube}'></i>
                    </div>
                </div>
                `;
            }
        }
        contenedorDeTodasLasCancionesFavoritasEnMisListas.innerHTML += `
            <div class="item-mostrarMas">
                <div class="mostrarMas">
                <i class="fas fa-minus" id='btn-mostrarMenosEnTodasLasFavoritas'></i>
                    <label>Mostrar menos</label>
                </div>
            </div>
        `;
        let btnMostrarMenosEnTodasLasFavoritas = document.getElementById('btn-mostrarMenosEnTodasLasFavoritas');
        if(btnMostrarMenosEnTodasLasFavoritas){
            btnMostrarMenosEnTodasLasFavoritas.addEventListener('click', function(){
                listarTodaslasCancionesFavoritasEnMisListas(allMusics);
            });
        }
    }
}

function listarTodaslasCancionesEnListasCreadas(allMusics){
    let contenedorListasCreadas = document.querySelector('.contenedorListasCreadas');
    fetch('/allList')
        .then(res => res.json())
        .then(data => {
            contenedorListasCreadas.innerHTML = '';
            let iterador = -1;
            data.forEach( e => {
                iterador ++;
                contenedorListasCreadas.innerHTML += `
                <div class="lista">
                    <div class="lista-head-others">
                        <div class="lista-head-left">
                            <input class='nombre-listasCreadas' type="text" value="${e.name}" disabled>
                            <button class="cambiarNombre" id='${iterador}'><i class="fas fa-pen edit-name"></i> Cambiar el nombre</button>
                            <button class="guardarNombre"><i class="fas fa-check save-name"></i> Guardar</button>
                            <button class="cancelarNombre"><i class="fas fa-times cancel-name"></i> Cancelar</button>
                        </div>
                        <div class="lista-head-right">
                            <i class="fas fa-trash-alt" id="${e.name}"></i>
                        </div>
                    </div>
                    <div class="lista-body ${e.name.replace(' ', '')}MyLists lista-body-others">
                    </div>
                </div>
                `;
                let namelist = e.name.replace(' ', '');
                let contenedorDeListasCreadas = document.querySelector(`.${namelist}MyLists`)
                contenedorDeListasCreadas.innerHTML = '';
                let musicasDeLaListaCreada = [];
                for (let i = 0; i < allMusics.length; i++) {
                    if(allMusics[i].lists.includes(e.name)){
                        musicasDeLaListaCreada.push(allMusics[i]);
                    } 
                }
                if(musicasDeLaListaCreada.length <= 3){
                    for (let i = 0; i < musicasDeLaListaCreada.length; i++) {
                        if(musicasDeLaListaCreada[i].favourite == true){
                            contenedorDeListasCreadas.innerHTML += `
                            <div class="item-misListas">
                                <div class="item-mislistas-img">
                                    <img src="${musicasDeLaListaCreada[i].image}" alt="${musicasDeLaListaCreada[i].name}">
                                    <div class="iconPlay">
                                        <i class="fas fa-play-circle" id='${musicasDeLaListaCreada[i].idYoutube}'></i>
                                    </div>
                                </div>
                                <div class="item-mislistas-txt">
                                    <label>${musicasDeLaListaCreada[i].name}</label>
                                    <i class="fas fa-heart" id='${musicasDeLaListaCreada[i].idYoutube}'></i>
                                </div>
                                <div class="item-mislistas-close">
                                    <i class="fas fa-times listaCreada" name='${e.name}' id='${musicasDeLaListaCreada[i].idYoutube}'></i>
                                </div>
                            </div>
                            `;
                        } else {
                            contenedorDeListasCreadas.innerHTML += `
                            <div class="item-misListas">
                                <div class="item-mislistas-img">
                                    <img src="${musicasDeLaListaCreada[i].image}" alt="${musicasDeLaListaCreada[i].name}">
                                    <div class="iconPlay">
                                        <i class="far fa-play-circle" id='${musicasDeLaListaCreada[i].idYoutube}'></i>
                                    </div>
                                </div>
                                <div class="item-mislistas-txt">
                                    <label>${musicasDeLaListaCreada[i].name}</label>
                                    <i class="far fa-heart" id='${musicasDeLaListaCreada[i].idYoutube}'></i>
                                </div>
                                <div class="item-mislistas-close">
                                    <i class="fas fa-times listaCreada" name='${e.name}' id='${musicasDeLaListaCreada[i].idYoutube}'></i>
                                </div>
                            </div>
                            `;
                        }
                    }
                } else {
                    for (let i = 0; i < 3; i++) {
                        if(musicasDeLaListaCreada[i].favourite == true){
                            contenedorDeListasCreadas.innerHTML += `
                            <div class="item-misListas">
                                <div class="item-mislistas-img">
                                    <img src="${musicasDeLaListaCreada[i].image}" alt="${musicasDeLaListaCreada[i].name}">
                                    <div class="iconPlay">
                                        <i class="far fa-play-circle" id='${musicasDeLaListaCreada[i].idYoutube}'></i>
                                    </div>
                                </div>
                                <div class="item-mislistas-txt">
                                    <label>${musicasDeLaListaCreada[i].name}</label>
                                    <i class="fas fa-heart" id='${musicasDeLaListaCreada[i].idYoutube}'></i>
                                </div>
                                <div class="item-mislistas-close">
                                    <i class="fas fa-times listaCreada" name='${e.name}' id='${musicasDeLaListaCreada[i].idYoutube}'></i>
                                </div>
                            </div>
                            `;
                        } else {
                            contenedorDeListasCreadas.innerHTML += `
                            <div class="item-misListas">
                                <div class="item-mislistas-img">
                                    <img src="${musicasDeLaListaCreada[i].image}" alt="${musicasDeLaListaCreada[i].name}">
                                    <div class="iconPlay">
                                        <i class="far fa-play-circle" id='${musicasDeLaListaCreada[i].idYoutube}'></i>
                                    </div>
                                </div>
                                <div class="item-mislistas-txt">
                                    <label>${musicasDeLaListaCreada[i].name}</label>
                                    <i class="far fa-heart" id='${musicasDeLaListaCreada[i].idYoutube}'></i>
                                </div>
                                <div class="item-mislistas-close">
                                    <i class="fas fa-times listaCreada" name='${e.name}' id='${musicasDeLaListaCreada[i].idYoutube}'></i>
                                </div>
                            </div>
                            `;
                        }
                    }
                    contenedorDeListasCreadas.innerHTML += `
                    <div class="item-mostrarMas">
                        <div class="mostrarMas">
                            <i class="fas fa-plus mostrar-mas-listasCreadas" id='${iterador}'></i>
                            <label>${musicasDeLaListaCreada.length-3} más</label>
                        </div>
                    </div>
                    `;
                }
            });
            window.addEventListener('click', (e) => {
                if(e.target.className == 'fas fa-plus mostrar-mas-listasCreadas'){
                    let it = e.target.id;
                    let contenedorDeListasCreadasIterador = document.getElementsByClassName('lista-body-others');
                    let nombreListasCreadas = document.getElementsByClassName('nombre-listasCreadas');
                    contenedorDeListasCreadasIterador[it].innerHTML = '';
                    for (let i = 0; i < allMusics.length; i++) {
                        if(allMusics[i].lists.includes(nombreListasCreadas[it].value)){
                            if(allMusics[i].favourite == true){
                                contenedorDeListasCreadasIterador[it].innerHTML += `
                                <div class="item-misListas">
                                    <div class="item-mislistas-img">
                                        <img src="${allMusics[i].image}" alt="${allMusics[i].name}">
                                        <div class="iconPlay">
                                            <i class="far fa-play-circle" id='${allMusics[i].idYoutube}'></i>
                                        </div>
                                    </div>
                                    <div class="item-mislistas-txt">
                                        <label>${allMusics[i].name}</label>
                                        <i class="fas fa-heart" id='${allMusics[i].idYoutube}'></i>
                                    </div>
                                    <div class="item-mislistas-close">
                                        <i class="fas fa-times listaCreada" name='${nombreListasCreadas[it].value}' id='${allMusics[i].idYoutube}'></i>
                                    </div>
                                </div>
                                `;
                            } else {
                                contenedorDeListasCreadasIterador[it].innerHTML += `
                                <div class="item-misListas">
                                    <div class="item-mislistas-img">
                                        <img src="${allMusics[i].image}" alt="${allMusics[i].name}">
                                        <div class="iconPlay">
                                            <i class="far fa-play-circle" id='${allMusics[i].idYoutube}'></i>
                                        </div>
                                    </div>
                                    <div class="item-mislistas-txt">
                                        <label>${allMusics[i].name}</label>
                                        <i class="far fa-heart" id='${allMusics[i].idYoutube}'></i>
                                    </div>
                                    <div class="item-mislistas-close">
                                        <i class="fas fa-times listaCreada" name='${nombreListasCreadas[it].value}' id='${allMusics[i].idYoutube}'></i>
                                    </div>
                                </div>
                                `;
                            }
                        }  
                    }
                    contenedorDeListasCreadasIterador[it].innerHTML += `
                        <div class="item-mostrarMas">
                            <div class="mostrarMas">
                                <i class="fas fa-minus mostrar-menos-listasCreadas" id=''></i>
                                <label>Mostrar menos</label>
                            </div>
                        </div>
                    `;
                }
                if(e.target.className == 'fas fa-minus mostrar-menos-listasCreadas'){
                    listarTodaslasCancionesEnListasCreadas(allMusics);
                }
            });
        });
}



/*--------------------Likes en las músicas*---------------------- */
window.addEventListener('click', e =>  {
    if(e.target.className == 'far fa-heart'){
        let idYoutube = e.target.id;
        fetch('/updateLike', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                idYoutube,
            })
        }).then(res => res.json())
            .then(data => {
                if (data.idYoutube == idYoutube){
                    if(data.favourite == true){
                        mostrarMessage('Se agregó a favoritos', verde);
                    } else {
                        mostrarMessage('Se eliminó de favoritos', rojo);
                    }
                } else {
                    mostrarMessage('Ocurrió un error', rojo);
                }
            })
            .catch(e => {
                console.log(e);
                mostrarMessage('Ocurrió un error', rojo)
            });
        /********************************** */
        ObtenerTodasLasCanciones().then(m => {
            var allMusics = m;
            actualizarLasMusicas(allMusics);
        }).catch(e => {
            console.log(e);
            mostrarMessage('Ocurrió un error', rojo)
        });
    }
    if(e.target.className == 'fas fa-heart'){
        let idYoutube = e.target.id;
        fetch('/updateLike', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                idYoutube,
            })
        }).then(res => res.json())
            .then(data => {
                if (data.idYoutube == idYoutube){
                    if(data.favourite == true){
                        mostrarMessage('Se agregó a favoritos', verde);
                    } else {
                        mostrarMessage('Se eliminó de favoritos', rojo);
                    }
                } else {
                    mostrarMessage('Ocurrió un error', rojo);
                }
            })
            .catch(e => {
                console.log(e);
                mostrarMessage('Ocurrió un error', rojo)
            });
        /********************************** */
        ObtenerTodasLasCanciones().then(m => {
            console.log('Obteniendo canciones...');
            var allMusics = m;
            actualizarLasMusicas(allMusics);
        }).catch(e => {
            console.log(e);
            mostrarMessage('Ocurrió un error', rojo)
        });
    }
});

/*------------------------Reproducir música---------------------- */
var contenedorDeGif = document.querySelector('.gif');
var contenedorVideoYoutube = document.querySelector('.videoYoutube');

function reproducirVideoYoutube(idYoutube){
    contenedorDeGif.style.display = 'none';
    contenedorVideoYoutube.style.display = 'flex';
    contenedorVideoYoutube.innerHTML = '';
    let iframe = document.createElement('iframe');
    let url = 'https://www.youtube.com/embed/';
    let src = url + idYoutube + '?autoplay=1';
    iframe.setAttribute('width', '800');
    iframe.setAttribute('height', '450');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('src', src);
    iframe.setAttribute('allowfullscreen', '')
    contenedorVideoYoutube.appendChild(iframe);
}

window.addEventListener('click', e => {
    if(e.target.className == 'far fa-play-circle'){
        let idYoutube = e.target.id;
        reproducirVideoYoutube(idYoutube);
        fetch('/RMusic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idYoutube
            })
        }).then(res => res.json())
            .then(data => {})
            .catch(e => {
                console.log('Se produjo un error para subir un video');
                console.log(e);
            });
        
        ObtenerTodasLasCanciones().then(m => {
            var allMusics = m;
            actualizarLasMusicas(allMusics);
        }).catch(e => {
            console.log(e);
            mostrarMessage('Ocurrió un error', rojo)
        });
    }
});

/*-------------------------Eliminar Música----------------------- */
window.addEventListener('click', e => {
    if(e.target.className == 'fas fa-times'){
        if(e.target.id != 'cerrarForm'){
            let idYoutube = e.target.id;
            let modalYesOrNo = document.querySelector('.yesOrNo');
            let msgYesOrNo = document.getElementById('msgYesOrNo');
            msgYesOrNo.innerHTML = '¿Seguro de borrar la música?';
            modalYesOrNo.style.display = 'flex';
            window.addEventListener('click', (e) =>{
                if(e.target.id == 'btn-Yes'){
                    modalYesOrNo.style.display = 'none';
                    fetch('/deleteMusic', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            idYoutube
                        })
                    }).then(res => res.json())
                        .then(data => {
                            if(data.idYoutube == e.target.id){
                                mostrarMessage('Se eliminó correctamente la música', rojo)
                            }
                        })
                        .catch(e => {
                            console.log(e);
                            mostrarMessage('Ocurrió un error', rojo)
                        });
                        /********************************** */
                        ObtenerTodasLasCanciones().then(m => {
                            var allMusics = m;
                            actualizarLasMusicas(allMusics);
                        }).catch(e => {
                            console.log(e);
                            mostrarMessage('Ocurrió un error', rojo)
                        });
                }
                else if(e.target.id == 'btn-No'){
                    modalYesOrNo.style.display = 'none';
                }
            });
        }
    }
});

/*-------------------------Quitar Música de una lista----------------------- */
window.addEventListener('click', e => {
    if(e.target.className == 'fas fa-times listaCreada'){
        if(e.target.id != 'cerrarForm'){
            let idYoutube = e.target.id;
            let nameList = e.target.getAttribute('name');
            let modalYesOrNo = document.querySelector('.yesOrNo');
            let msgYesOrNo = document.getElementById('msgYesOrNo');
            msgYesOrNo.innerHTML = '¿Seguro de quitar la música de la lista?';
            modalYesOrNo.style.display = 'flex';
            window.addEventListener('click', (e) =>{
                if(e.target.id == 'btn-Yes'){
                    modalYesOrNo.style.display = 'none';
                    fetch('/removeMusicList', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            idYoutube,
                            nameList,
                        })
                    }).then(res => res.json())
                        .then(data => {
                            if(data.idYoutube == e.target.id){
                                mostrarMessage('Se quitó correctamente la música de la lista', rojo)
                            }
                        })
                        .catch(e => {
                            console.log(e);
                            mostrarMessage('Ocurrió un error', rojo)
                        });
                        /********************************** */
                        ObtenerTodasLasCanciones().then(m => {
                            var allMusics = m;
                            actualizarLasMusicas(allMusics);
                        }).catch(e => {
                            console.log(e);
                            mostrarMessage('Ocurrió un error', rojo)
                        });
                }
                else if(e.target.id == 'btn-No'){
                    modalYesOrNo.style.display = 'none';
                }
            });
        }
    }
});

/*-------------------------Eliminar una lista----------------------- */
window.addEventListener('click', e => {
    if(e.target.className == 'fas fa-trash-alt'){
        let nameList = e.target.id;
        let modalYesOrNo = document.querySelector('.yesOrNo');
        let msgYesOrNo = document.getElementById('msgYesOrNo');
        msgYesOrNo.innerHTML = '¿Seguro de borrar la lista?';
        modalYesOrNo.style.display = 'flex';
        window.addEventListener('click', (e) =>{
            if(e.target.id == 'btn-Yes'){
                modalYesOrNo.style.display = 'none';
                fetch('/deleteList', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nameList
                    })
                }).then(res => res.json())
                    .then(data => {
                        if(data.name == nameList){
                            mostrarMessage('Se eliminó la lista', rojo)
                        }
                    })
                    .catch(e => {
                        console.log(e);
                        mostrarMessage('Ocurrió un error', rojo)
                    });
                    /********************************** */
                    ObtenerTodasLasCanciones().then(m => {
                        var allMusics = m;
                        actualizarLasMusicas(allMusics);
                    }).catch(e => {
                        console.log(e);
                        mostrarMessage('Ocurrió un error', rojo)
                    });
                    ObtenerTodasLasListas().then( l => {
                        var allLists = l;
                        listarListasEnElForm(allLists);
                    })
                    .catch(e => {
                        console.log(e);
                        mostrarMessage('Ocurrió un error', rojo)
                    });
            }
            else if(e.target.id == 'btn-No'){
                modalYesOrNo.style.display = 'none';
            }
        });
        
    }
});

/*---------------------------Form------------------------------- */
var check = document.getElementsByClassName('check');
var itemToAdd = document.getElementsByClassName('itemToAdd');
var nameItemToAdd = document.getElementsByClassName('name-itemToAdd');
var buttonForm = document.getElementById('btn-form');
var buttonCloseForm = document.getElementById('cerrarForm');
var modalForm = document.querySelector('.formNewList');
var btnAddNewList = document.querySelector('.addList');

if(btnAddNewList){
    btnAddNewList.addEventListener('click', () => {
        modalForm.style.display = 'flex';
    });
}

window.addEventListener('click', e => {
    if(e.target.className == 'name-itemToAdd' || e.target.className == 'fas fa-check check'){
        let n = e.target.id;
        if(itemToAdd[n].id == 't'){
            itemToAdd[n].style.background = '#dff094';
            itemToAdd[n].id = 'v';
            check[n].style.display = 'flex';
        } else if(itemToAdd[n].id == 'v') {
            itemToAdd[n].style.background = '#fff';
            itemToAdd[n].id = 't';
            check[n].style.display = 'none';
        }
    }
});

if(buttonForm){
    buttonForm.addEventListener('click', (e) => {
        e.preventDefault();
        let nameList = document.querySelector('.nameList').value;
        if(nameList == ''){
            mostrarMessage('Ingresa un nombre para la lista', rojo);
        } else {
            let music = [];
            let inputOfMusics = document.getElementById('idMusics');
            
            for (let i = 0; i < itemToAdd.length; i++) {
                if(itemToAdd[i].id == 'v') {
                    let idYoutube = nameItemToAdd[i].getAttribute('name');
                    music.push(idYoutube);
                }
            }
            inputOfMusics.value = music;
            const list = {
                name: nameList,
                lists: inputOfMusics.value
            }
            fetch('/addNewList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(list)
            }).then(res => res.json())
                .then(data => {
                    if(data.name == nameList){
                        for (let i = 0; i < itemToAdd.length; i++) {
                            check[i].style.display = 'none';
                            itemToAdd[i].id = 't';
                            itemToAdd[i].style.background = '#fff';
                        }
                        modalForm.style.display = 'none';
                        mostrarMessage('Lista agregada correctamente', verde);
                    }
                    else if(data.name == 'copy'){
                        mostrarMessage('Nombre de la lista ya existente', rojo);
                    }
                })
                .catch(e =>{
                    console.log(e);
                    mostrarMessage('Ocurrió un error', rojo);
                });
                /********************************** */
                ObtenerTodasLasCanciones().then(m => {
                    var allMusics = m;
                    actualizarLasMusicas(allMusics);
                }).catch(e => {
                    console.log(e);
                    mostrarMessage('Ocurrió un error', rojo)
                });
                ObtenerTodasLasListas().then( l => {
                    var allLists = l;
                    listarListasEnElForm(allLists);
                })
                .catch(e => {
                    console.log(e);
                    mostrarMessage('Ocurrió un error', rojo)
                });
        }
        
    });
}

if(buttonCloseForm){
    buttonCloseForm.addEventListener('click', ()=>{
        for (let i = 0; i < itemToAdd.length; i++) {
            check[i].style.display = 'none';
            itemToAdd[i].id = 't';
            itemToAdd[i].style.background = '#fff';
        }
        modalForm.style.display = 'none';
    });
}


/*-------funcion para listar todas las canciones en el form------ */
function listarTodasLasCancionesEnElForm(allMusic){
    let musicListToAdd = document.getElementById('musicListToAdd');
    musicListToAdd.innerHTML = '';
    musicListToAdd.innerHTML += '<input type="hidden" id="idMusics">';
    for (let i = 0; i < allMusic.length; i++) {
        musicListToAdd.innerHTML += `
        <div class="itemToAdd" id="t">
            <label id='${i}' name='${allMusic[i].idYoutube}' class="name-itemToAdd">${allMusic[i].name}</label><i class="fas fa-check check" id="0"></i>
        </div>
        `;
    }
}

/*---------------------Agregar una musica a una lista----------------- */
var agregarALista = document.querySelector('.btn-agregarALista');
var cancelarALista = document.querySelector('.btn-cancelarALista');
var formAddList = document.querySelector('.formAddList');
var itemListToAddMusic = document.getElementsByClassName('item-listToAddMusic');


window.addEventListener('click', (e) => {
    if(e.target.className == 'fas fa-plus agregarAunaLista'){
        document.getElementById('idYoutubeParaAgregarAListas').value = e.target.id;
        if (formAddList) {
            formAddList.style.display = 'flex';
        }
    }
});

window.addEventListener('click', (e) => {
    if(e.target.className == 'item-listToAddMusic'){
        if(e.target.id == 't'){
            e.target.style.background = '#dff094';
            e.target.id = 'v';
        }
        else if(e.target.id == 'v'){
            e.target.style.background = '#fff';
            e.target.id = 't';
        }
    }
});

if (agregarALista) {
    agregarALista.addEventListener('click', function(){
        let idYoutube = document.getElementById('idYoutubeParaAgregarAListas').value;
        let lists = [];
        for (let i = 0; i < itemListToAddMusic.length; i++) {
            if(itemListToAddMusic[i].id == 'v'){
                lists.push(itemListToAddMusic[i].innerHTML);
            }
        }
        fetch('/updateList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idYoutube,
                lists
            })
        }).then(res => res.json())
            .then(data => {
                if (data.listasUsadas) {
                    let ltsusadas = '';
                    data.listasUsadas.forEach( e => {
                        ltsusadas += ` ${e} -`;
                    });
                    mostrarMessage(`La música ya está en las listas: ${ltsusadas}`, rojo)
                }
                else if (data.idYoutube == idYoutube) {
                    formAddList.style.display = 'none';
                    for (let i = 0; i < itemListToAddMusic.length; i++) {
                        itemListToAddMusic[i].id = 't';
                    }
                    mostrarMessage('Se agregó la música a la lista', verde);
                }
                /********************* */
                ObtenerTodasLasCanciones().then( m => {
                    var allMusics = m;
                    actualizarLasMusicas(allMusics);
                })
                .catch(e => {
                    console.log(e);
                    mostrarMessage('Ocurrió un error', rojo)
                });
            })
            .catch(error => {
                console.log(error);
                mostrarMessage('Ocurrió un error', rojo);
            });
    });
}

if (cancelarALista) {
    cancelarALista.addEventListener('click', function(){
        formAddList.style.display = 'none';
        for (let i = 0; i < itemListToAddMusic.length; i++) {
            itemListToAddMusic[i].id = 't';
        }
    })
}

function listarListasEnElForm(lists){
    let listToAddMusic = document.querySelector('.listToAddMusic');
    listToAddMusic.innerHTML = '';
    for (let i = 0; i < lists.length; i++) {
        listToAddMusic.innerHTML += `
        <input type=''hidden id='idYoutubeParaAgregarAListas'>
        <label class="item-listToAddMusic" id='t'>${lists[i].name}</label>
        `;
    }
}

/*--------------------------Funcion Del YES OR NO--------------- */
function msgYesOrNo(){
    let modalYesOrNo = document.querySelector('.yesOrNo');
    let msgYesOrNo = document.getElementById('msgYesOrNo');
    msgYesOrNo.innerHTML = '';
    modalYesOrNo.style.display = 'flex';
    window.addEventListener('click', (e) =>{
        if(e.target.id == 'btn-Yes'){
            modalYesOrNo.style.display = 'none';
        }
        else if(e.target.id == 'btn-No'){
            modalYesOrNo.style.display = 'none';
        }
    });
}

/*----------------Cambiar el Nombre de Las Listas-------------- */
var cambiarNombre = document.getElementsByClassName('cambiarNombre');
var guardarNombre = document.getElementsByClassName('guardarNombre');
var cancelarNombre = document.getElementsByClassName('cancelarNombre');
var nombre = document.getElementsByClassName('nombre-listasCreadas');
window.addEventListener('click', (e) => {
    if(e.target.className == 'cambiarNombre'){
        let n = e.target.id;
        let nombreAntiguo = nombre[n].value;
        let newName= '';
        cambiarNombre[n].style.display = 'none';
        guardarNombre[n].style.display = 'inline';
        cancelarNombre[n].style.display = 'inline';
        nombre[n].disabled = false;
        nombre[n].focus();
        guardarNombre[n].addEventListener('click', () => {
            newName = nombre[n].value;
            nombre[n].disabled = true;
            
            if(newName == ''){
                mostrarMessage('Ingrese un nombre válido', rojo);
            } else {
                fetch('/updateNameList', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        oldName: nombreAntiguo,
                        newName
                    })
                }).then(res => res.json())
                    .then(data => {
                        if(data.newName == newName){
                            cambiarNombre[n].style.display = 'inline';
                            guardarNombre[n].style.display = 'none';
                            cancelarNombre[n].style.display = 'none';
                            mostrarMessage('Se guardó el cambio de nombre', verde);
                        }
                        else if(data.name == 'error'){
                            mostrarMessage('Ocurrio un error', rojo);
                        }
                        else if(data.name == 'errorName'){
                            mostrarMessage('Ingrese un nombre válido', rojo);
                        }
                    })
                    .catch(error => {
                        mostrarMessage('Ocurrio un error', rojo);
                        console.log(error);
                    });
                    /********************* */
                    ObtenerTodasLasCanciones().then( m => {
                        var allMusics = m;
                        actualizarLasMusicas(allMusics);
                    })
                    .catch(e => {
                        console.log(e);
                        mostrarMessage('Ocurrió un error', rojo)
                    });
            }
        });
        cancelarNombre[n].addEventListener('click', () => {
            nombre[n].disabled = true;
            cambiarNombre[n].style.display = 'inline';
            guardarNombre[n].style.display = 'none';
            cancelarNombre[n].style.display = 'none';
            ObtenerTodasLasCanciones().then( m => {
                var allMusics = m;
                actualizarLasMusicas(allMusics);
            })
            .catch(e => {
                console.log(e);
                mostrarMessage('Ocurrió un error', rojo)
            });
        });
    }
});