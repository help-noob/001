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
let events = [
    {
        codice: "EV1",
        nome: "VinFestival",
        descrizione: "Fiera del vino",
        data: "12/07/2024",
        location: "Roma",
        partecipanti: 0
    },
    {
        codice: "EV2",
        nome: "Comicon 2024",
        descrizione: "Fiera del fumetto e gara cosplay",
        data: "20/07/2024",
        location: "Napoli",
        partecipanti: 7
    },
    {
        codice: "EV3",
        nome: "R...Estate con noi",
        descrizione: "Evento estivo 2024",
        data: "15/08/2024",
        location: "Bari",
        partecipanti: 4
    },
];


//CREO LE ROTTE API ovvero tutto ciò che può essere richiamato che effettua o meno operazioni fornendo delle informazioni
//l'app deve rispondere al protocollo GET alla rotta standard
app.get("/", (req, res) =>{
    res.send("ROTTA PRINCIPALE DEL GESTIONALE DI EVENTI");
})

//findall, cerca e restituisce tutti gli elementi dell'elenco events
app.get("/events", (req, res) =>{ //BASE URL
    res.json(events); //json è un metodo che converte in JSON la risposta
})

//FIND BY CODICE
app.get("/events/:cod", (req, res) =>{
    let varCod = req.params.cod; //prendo la variabile ID

    for( let [idx, item] of events.entries()){ //spacchetto le informazioni nei due array dove "idx" è il valore dell'indice dell'array e item è il contenuto dell'oggetto
        if(item.codice == varCod){ //trova l'oggetto
            res.json({
                status: "SUCCESS",
                data: item //restituiscimi tutto l'oggetto
            })
            return; //termino l'operazione
        }
    }
    //visto che l'API devi sempre rispondere se non trovo l'oggetto creo uno status di errore
    res.json({
        status: "ERROR",
        data: "Oggetto non trovato" 
    })
})

//INSERT: inserisco in elemento nell'app tramite il protocollo POST
app.post("/events", (req, res) =>{
    //creo l'oggetto temporaneo che deve contenere gli elementi di tipologia javascript 
    let temp = {
        codice: "EV" + (events.length + 1), //la sigla del codice sarà "EV" e il codice dell'evento sarà sequenziale
        nome: req.body.nome,
        descrizione: req.body.descrizione,
        data: req.body.data,
        location: req.body.location,
        partecipanti:req.body.partecipanti
    }
    //verifica se già c'è l'oggetto
    for(let [idx, item] of events.entries()){
        if(item.codice == req.body.varCod){
            res.json({
                status: "ERRORE",
                data: "EVENTO gia presente"
            })
            return; //termino l'operazione
        }
    }
    //invio l'oggetto all'elenco
    events.push(temp)

    res.json({
        status: "SUCCESS",
        data: "EVENTO inserito"
    });
})

//DELETE Eliminazione dell'oggetto tramite l'identificativo del codice che sarà univoquo
app.delete("/events/:id", (req, res) => {
    let varCod = req.params.id;

    for(let [idx, item] of events.entries()){
        if(item.codice == varCod){
            events.splice(idx, 1); //rimuove un elemento dall'indice 
            res.json({
                status: "SUCCESS",
                data: "EVENTO Eliminato"
            })
            return;
        }
    }
    res.json({
        status: "ERROR",
        data: "Impossibile eliminare un EVENTO"
    })
})

app.get("/events/:cod/:tipo", (req, res) => {
    let varCod = req.params.cod; //array del codice
    let varTip = req.params.tipo; //array dello switch

    switch(varTip){ //applico uno switch con due casi uno per aumentare di un unità i partecipanti e una per diminuire di un unità i partecipanti
        case "INC":
            for(let [idx, item] of events.entries()){
                if(item.codice == varCod){
                    item.partecipanti++; //incremento i partecipanti
        
                    res.json({
                        status: "SUCCESS"
                    })
                    return;
                }
            }
            break;
        case "DEC":
            for(let [idx, item] of events.entries()){
                if(item.codice == varCod){
                    if(item.partecipanti > 0){
                        item.partecipanti--; //rimuovo i partecipanti

                        res.json({
                            status: "SUCCESS"
                        })
                        return;
                    }
                    else{
                        res.json({
                            status: "ERROR",
                            data: "Partecipanti assenti"
                        })
                    }
                    
                }
            }
            break;
        default:
            res.json({
                status: "ERROR",
                data: "OPS...Qualcosa è andato storto!!!"
            })
            break;
    }
})

// POST /events/reserved: Recupera l'elenco di tutti gli eventi con "Nome dell'evento" inserito nel Body.
app.post("/events/reserved", (req, res) => {
    let eventName = req.body.nome; // prendo il nome dell'evento dal body
    let eventFiltr = [];

    for (let [idx, item] of events.entries()) {
        if (item.nome === eventName) {
            eventFiltr.push(item);
        }
    }

    if (eventFiltr.length > 0) {
        res.json({
            status: "SUCCESS",
            data: eventFiltr
        });
    } else {
        res.json({
            status: "ERROR",
            data: "Nessun evento trovato"
        });
    }
});

// GET /events/count/:id: Recupera il numero di partecipanti all'evento con ID definito nel URL.
app.get("/events/count/partecipanti/:cod", (req, res) =>{
    let numPar = req.params.cod; 

    for( let [idx, item] of events.entries()){
        if(item.codice == numPar){ 
            res.json({
                status: "SUCCESS",
                data: "numero partecipanti: " + item.partecipanti //restituiscimi solo i partecipanti dell' oggetto
            })
            return;
        }
    }
    
    res.json({
        status: "ERROR",
        data: "Evento non trovato" 
    })
})

//Avvio il web server
app.listen(port, host, () => {
    console.log("Sono in ascolto sulla porta: " + port); //utilizzo una concatenazione di stringa in modo che se in futuro cambio la porta non dovrò mettere mano al codice
})