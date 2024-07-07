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

//quando si sviluppa un software che deve rispondere o accettare dati è buona norma che per poterne testare il funzionamento vengono popolati dati di prova.
//MOCK (inserimento dati fake in JSON)
let prodotti = [
    {
        id: "ID1",
        barCode: 1055,
        nome: "Martello",
        descrizione: "Martello da lavoro Thor",
        prezzo: 9.99,
        quantita: 10,
        categoria: "utensili"
    },
    {
        id: "ID2",
        barCode: 1240,
        nome: "Kit giraviti",
        descrizione: "Kit giraviti a stella",
        prezzo: 3.99,
        quantita: 5,
        categoria: "utensili"
    },
    {
        id: "ID3",
        barCode: 2020,
        nome: "avvitatore elettrico",
        descrizione: "avvitatore elettrico a batteria",
        prezzo: 99.99,
        quantita: 25,
        categoria: "elettroutensili"
    },
    {
        id: "ID4",
        barCode: 2023,
        nome: "Trapano",
        descrizione: "Trapano Bosh per bricolage",
        prezzo: 49.99,
        quantita: 30,
        categoria: "elettroutensili"
    },
    {
        id: "ID5",
        barCode: "COD1001",
        nome: "Scarpe antinfortunistica",
        descrizione: "scarpa proteggi piede",
        prezzo: 99.99,
        quantita: 3,
        categoria: "Antinfortunistica"
    }
]

//CREO LE ROTTE API ovvero tutto ciò che può essere richiamato che effettua o meno operazioni fornendo delle informazioni
//l'app deve rispondere al protocollo GET alla rotta standard
app.get("/", (req, res) =>{
    res.send("ROTTA PRINCIPALE DEL GESTIONALE");
})

//Eseguo una FINDALL, cerca e restituisce tutti gli elementi dell'elenco events
app.get("/products", (req, res) =>{ //BASE URL
    res.json(prodotti); //json è un metodo che converte in JSON la risposta
})

//Eseguo una ricerca per ID
app.get("/products/:id", (req, res) =>{
    let varId = req.params.id; //prendo la variabile ID

    for( let [idx, item] of prodotti.entries()){ //spacchetto le informazioni nei due array dove "idx" è il valore dell'indice dell'array e item è il contenuto dell'oggetto
        if(item.id == varId){ //trova l'oggetto
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
app.post("/products", (req, res) =>{
    //creo l'oggetto temporaneo che deve contenere gli elementi di tipologia javascript 
    let temp = {
        id: "ID" + (prodotti.length + 1), //la sigla del codice sarà "ID" e il codice dell'evento sarà sequenziale
        barCode: req.body.bar,
        nome: req.body.nom,
        descrizione: req.body.des,
        prezzo: req.body.pre,
        quantita: req.body.qnt,
        categoria: req.body.cat
    }
    //verifica se già c'è l'oggetto
    for(let [idx, item] of prodotti.entries()){
        if(item.id == req.body.varId){
            res.json({
                status: "ERRORE",
                data: "Prodotto gia presente"
            })
            return; //termino l'operazione
        }
    }
    //invio l'oggetto all'elenco
    prodotti.push(temp)

    res.json({
        status: "SUCCESS",
        data: "PRODOTTO inserito"
    });
})

//PUT
app.put("/products/:id", (req, res) =>{
    let id = req.params.id;
    for( let [idx, item] of prodotti.entries()){
        if(item.id == id){
            item.barCode = req.body.bar ? req.body.bar : item.barCode, //operazione ternaria se il req.body esiste modificalo altrimente resta invariato
            item.nome = req.body.nom ? req.body.nom : item.nome, 
            item.descrizione = req.body.des ? req.body.des : item.descrizione,
            item.prezzo = req.body.pre ? req.body.pre : item.prezzo,
            item.quantita = req.body.qnt ? req.body.qnt : item.qnt,
            item.categoria = req.body.cat ? req.body.cat : item.categoria


            res.json(
                {
                    status: "SUCCESS",
                    data: "Modifica effettuata"
                }
            )
            return;
        }
    }
    res.json(
        {
            status: "ERROR",
            data: "Impossibile modificare il PRODOTTO"
        }
    )
})

//DELETE Eliminazione dell'oggetto tramite l'identificativo del codice che sarà univoquo
app.delete("/products/:id", (req, res) => {
    let varId = req.params.id;

    for(let [idx, item] of prodotti.entries()){
        if(item.id == varId){
            prodotti.splice(idx, 1); //rimuove un elemento dall'indice 
            res.json({
                status: "SUCCESS",
                data: varId + ":  PRODOTTO Eliminato"
            })
            return;
        }
    }
    res.json({
        status: "ERROR",
        data: "Impossibile eliminare il PRODOTTO:  " + varId
    })
})

// Recupera l'elenco di tutti i prodotti
app.post("/products/category", (req, res) =>{
    let nomCat = req.body.cat; // prendo il nome dell'evento dal body
    let catSel = [];

    for( let [idx, item] of prodotti.entries()){
        if(item.categoria == nomCat){ 
            catSel.push(item);
        }
    }
    if(catSel.length > 0){
        res.json({
            status: "SUCCESS",
            data: catSel
        });
    } else {
        res.json({
            status: "ERROR",
            data: "Nessuna categoria trovata"
        });
    }
});

// Recupera la somma delle quantità dei prodotti
app.post("/products/count", (req, res) => {
    let nomCat = req.body.cat; // prendo il nome della categoria dal body
    let tot = 0;

    for (let [idx, item] of prodotti.entries()){
        if (item.categoria == nomCat) {
            tot += item.quantita;
        }
    }

    if (tot > 0) {
        res.json({
            status: "SUCCESS",
            data: "Quantità disponibili: " + tot // restituisci la quantità totale per la categoria
        });
    } else {
        res.json({
            status: "ERROR",
            data: "Non ci sono Quantità disponibili in " + nomCat
        });
    }
});

//Avvio il web server, è buona consuetudine metterlo in fondo al codice
app.listen(port, host, () => {
    console.log("Sono in ascolto sulla porta: " + port); //utilizzo una concatenazione di stringa in modo che se in futuro cambio la porta non dovrò mettere mano al codice
})