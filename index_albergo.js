//npm init
//npm install express bodyparser

//inserimento dei moduli
const express = require('express')
const bodyparser = require('body-parser')

//Avvio principale dell'applicazione
const app = express();
app.use(express.json());  //chiedo ad express di decodificarmi in req.body tutto quello che riesce a mapparmi in formato JSON come se fosse un oggetto Java
app.use(bodyparser.urlencoded({extended: false})); //aggiungo un opzione di config che disabilita una funzione di analisi dati in modo complesso

//definisco le porte di connessione
const host = "127.0.0.1" //voglio che l'applicazione sia raggiungibile in locale
const port = 3000

//quando si sviluppa un software che deve rispondere o accettare dati è buona norma che per poterne testare il funzionamento vengono popolati da dati di prova.
//MOCK (inserimento dati fake in JSON)
let rooms = [
    {
        codice: '001',
        camera: 11,
        tipo: 'singola',
        disponibilita: true
    },
    {
        codice: '002',
        camera: 21,
        tipo: 'doppia',
        disponibilita: true
    },
    {
        codice: '003',
        camera: 13,
        tipo: 'suite',
        disponibilita: false
    },
];


//CREO LE ROTTE API ovvero tutto ciò che può essere richiamato che effettua o meno operazioni fornendo delle informazioni
//l'app deve rispondere al protocollo GET alla rotta standard
app.get("/", (req, res) =>{
    res.send("ROTTA PRINCIPALE DEL GESTIONALE DI PRENOTAZIONE DELL'ALBERGO");
})

//findall, cerca e restituisce tutti gli elementi dell'elenco rooms
app.get("/rooms", (req, res) =>{ //BASE URL
    res.json(rooms); //json è un metodo che converte in JSON la risposta
})

//FIND BY CODICE
app.get("/rooms/:id", (req, res) =>{
    let cod = req.params.id; //prendo la variabile ID

    for( let [idx, item] of rooms.entries()){ //spacchetto le informazioni nei due array dove "idx" è il valore dell'indice dell'array e item è il contenuto dell'oggetto
        if(item.codice == cod){ //trova l'oggetto
            res.json(item); //restituiscimi tutto l'oggetto
        }
    }
    //visto che l'API devi sempre rispondere se non trovo l'oggetto creo uno status di errore
    res.json(
        {
            "status": "Codice camera non trovata!!!"
        }
    )
})

//INSERT: inserisco in elemento nell'app tramite il protocollo POST
app.post("/rooms", (req, res) =>{
    //creo l'oggetto temporaneo che deve contenere gli elementi di tipologia javascript 
    let temp = {
        codice: req.body.cod,
        camera: req.body.cam,
        tipo: req.body.tip,
        disponibilita: req.body.dis,
    }
    //verifica se già c'è l'oggetto
    for(let [idx, item] of rooms.entries()){
        if(item.codice == req.body.cod){
            res.json({
                "status": "ERRORE, camera già presente"
            })
            return; //termino l'operazione
        }
    }
    //invio l'oggetto all'elenco
    rooms.push(temp)

    res.json({
        "status": "SUCCESS"
    });
})

//PUT serve a sostituire un elemento già presente PATH modifico un elemento
app.patch("/rooms/:id", (req, res) =>{
    let cod = req.params.id;
    for( let [idx, item] of rooms.entries()){
        if(item.codice == cod){
            item.camera = req.body.cam ? req.body.cam : item.camera, //operazione ternaria se il req.body esiste modificalo altrimente resta invariato
            item.tipo = req.body.tip ? req.body.tip : item.tipo,
            item.disponibilita = req.body.dis ? req.body.dis : item.disponibilita

            res.json(
                {
                    "status": "MODIFICATA EFFETTUATA"
                }
            )
            return;
        }
    }
    res.json(
        {
            "status": "ERRORE, impossibile modificare!!!"
        }
    )
})


//DELETE Eliminazione dell'oggetto tramite l'identificativo del codice che sarà univoquo
app.delete("/rooms/:id", (req, res) => {
    let cod = req.params.id;
    for(let [idx, item] of rooms.entries()){
        if(item.codice == cod){
            rooms.splice(idx, 1); //rimuove un elemento dall'indice 
            res.json({
                "status": "SUCCESS"
            })
            return;
        }
    }
    res.json(
        {
            "status": "ERRORE, Camera già eliminata!!!"
        }
    )
})

//PUT serve a sostituire un elemento già presente PATH modifico un elemento
//applico una patch per poter fare solo alcune modifiche
app.patch("/rooms/:id", (req, res) =>{
    let cod = req.params.id;
    for( let [idx, item] of rooms.entries()){
        if(item.codice == cod){
            item.camera = req.body.cam ? req.body.cam : item.camera, //operazione ternaria se il req.body esiste si procede nella modifica altrimente resta invariato
            item.tipo = req.body.tip ? req.body.tip : item.tipo,
            item.disponibilita = req.body.dis ? req.body.dis : item.disponibilita

            res.json(
                {
                    "status": "MODIFICATA EFFETTUATA"
                }
            )
            return;
        }
    }
    res.json(
        {
            "status": "ERRORE, impossibile modificare!!!"
        }
    )
})

//PUT serve a sostituire un elemento già presente PATH modifico un elemento
app.put("/rooms/availability/:id", (req, res) =>{
    let cod = req.params.id;
    for( let [idx, item] of rooms.entries()){
        if(item.codice == cod){
            item.disponibilita = req.body.dis
            res.json(
                {
                    "status": "MODIFICATA EFFETTUATA"
                }
            )
            return;
        }
    }
    res.json(
        {
            "status": "ERRORE, impossibile modificare!!!"
        }
    )
})

//camere disponibili
app.get("/rooms/gestionecamere/available", (req, res) =>{
    let camereDisponibili = []; //array dove verrà popolato dalle camere disponibili. se utilizzo il ciclo "for...of" l'app mi restituisce solo il primo elemento utile
    for( let [idx, item] of rooms.entries()){
        if(item.disponibilita == true){ 
            camereDisponibili.push(item);
        }
    }
    if(camereDisponibili.length > 0){
        res.json(camereDisponibili)
    }
})

//camere non disponibili
app.get("/rooms/gestionecamere/not-available", (req, res) =>{
    let camereDisponibili = []; //array dove verrà popolato dalle camere non disponibili 
    for( let [idx, item] of rooms.entries()){
        if(item.disponibilita == false){ 
            camereDisponibili.push(item);
        }
    }
    if(camereDisponibili.length > 0){
        res.json(camereDisponibili)
    }
})

//Avvio il web server
app.listen(port, host, () => {
    console.log("Sono in ascolto sulla porta: " + port); //utilizzo una concatenazione di stringa in modo che se in futuro cambio la porta non dovrò mettere mano al codice
})