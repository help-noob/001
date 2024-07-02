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
//MOCK dei prodotti

let prodotti = [
    {
        codice: "PROD1",
        nome: "Friskies a salmone",
        descrizione: "crocchette per gatti",
        prezzo: 3.99 + "€",
        disponibilita: 12
    },
    {
        codice: "PROD2",
        nome: "Sacca di sabbia 2Kg",
        descrizione: "Sabbia organica lettiera gatto",
        prezzo: 5.99 + "€",
        disponibilita: 4
    },
    {
        codice: "PROD3",
        nome: "Natural Trainer bustine",
        descrizione: "cibo umido gatto",
        prezzo: 1.99 + "€",
        disponibilita: 18
    },
];
//MOCK degli ordini

let ordini = [
    {
        idOrdine: "ORD1",
        idProdotti: "PROD1",
        quantita: 12,
        idCliente: "CLI001"
    },
    {
        idOrdine: "ORD2",
        idProdotti: "PROD2",
        quantita: 12,
        idCliente: "CLI002"
    },
    {
        idOrdine: "ORD3",
        idProdotti: "PROD3",
        quantita: 12,
        idCliente: "CLI003"
    },
];

//CREO LE ROTTE API ovvero tutto ciò che può essere richiamato che effettua o meno operazioni fornendo delle informazioni
//l'app deve rispondere al protocollo GET alla rotta standard
app.get("/", (req, res) =>{
    res.send("ROTTA PRINCIPALE DEL GESTIONALE E-COMMERCE");
})

//findall, cerca e restituisce tutti gli elementi dell'elenco events
app.get("/products", (req, res) =>{ //BASE URL
    res.json(prodotti); //json è un metodo che converte in JSON la risposta
})

//FIND BY CODICE
app.get("/products/:cod", (req, res) =>{
    let varCod = req.params.cod; //prendo la variabile ID

    for( let [idx, item] of prodotti.entries()){ //spacchetto le informazioni nei due array dove "idx" è il valore dell'indice dell'array e item è il contenuto dell'oggetto
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
app.post("/products", (req, res) =>{
    //creo l'oggetto temporaneo che deve contenere gli elementi di tipologia javascript 
    let temp = {
        codice: "PROD" + (prodotti.length + 1), //la sigla del codice sarà "PROD" e il codice dell'evento sarà sequenziale
        nome: req.body.nom,
        descrizione: req.body.des,
        prezzo: req.body.pre + "€",
        disponibilita: req.body.dis,
    }
    //verifica se già c'è l'oggetto
    for(let [idx, item] of prodotti.entries()){
        if(item.codice == req.body.varCod){
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

//DELETE Eliminazione dell'oggetto tramite l'identificativo del codice che sarà univoquo
app.delete("/products/:id", (req, res) => {
    let varCod = req.params.id;

    for(let [idx, item] of prodotti.entries()){
        if(item.codice == varCod){
            prodotti.splice(idx, 1); //rimuove un elemento dall'indice 
            res.json({
                status: "SUCCESS",
                data: "PRODOTTO Eliminato"
            })
            return;
        }
    }
    res.json({
        status: "ERROR",
        data: "Impossibile eliminare un PRODOTTO"
    })
})

//PUT serve a sostituire un elemento già presente mentre con PATCH modifico un elemento.. in questo codice ho preferito usare PATCH
app.patch("/products/:id", (req, res) =>{
    let cod = req.params.id;
    for( let [idx, item] of prodotti.entries()){
        if(item.codice == cod){
            item.nome = req.body.nom ? req.body.nom : item.nome, //operazione ternaria se il req.body esiste modificalo altrimente resta invariato
            item.descrizione = req.body.des ? req.body.des : item.descrizione,
            item.prezzo = req.body.pre + "€" ? req.body.pre + "€": item.prezzo + "€",
            item.disponibilita = req.body.dis ? req.body.dis : item.disponibilita,

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

//API dedicate agli ordini
//findall su tutti gli ordini
app.get("/orders/", (req, res) =>{ //BASE URL
    res.json(ordini); //json è un metodo che converte in JSON la risposta
})

//find su ID
app.get("/orders/:ord", (req, res) =>{
    let varOrd = req.params.ord; //prendo la variabile ID

    for( let [idx, item] of ordini.entries()){ //spacchetto le informazioni nei due array dove "idx" è il valore dell'indice dell'array e item è il contenuto dell'oggetto
        if(item.idOrdine == varOrd){ //trova l'oggetto
            res.json({
                status: "SUCCESS",
                data: item //restituiscimi tutto l'oggetto
            })
            return; //termino l'operazione
        }
    }

    res.json({
        status: "ERROR",
        data: "Ordine non trovato" 
    })
})


//creo un nuvo ordine
app.post("/orders", (req, res) =>{
    //creo l'oggetto temporaneo che deve contenere gli elementi di tipologia javascript 
    let OrdTemp = {
        idOrdine: "ORD" + (ordini.length + 1), //la sigla del codice sarà "ORD" e il codice dell'evento sarà sequenziale
        idProdotti: req.body.idPro,
        quantita: req.body.qnt,
        idCliente: req.body.idCli,
    }
    //verifica se già c'è l'oggetto
    for(let [idx, item] of ordini.entries()){
        if(item.idOrdine == req.body.varOrd){
            res.json({
                status: "ERROR",
                data: "OPS...Qualcosa è andato storto" 
            })
            return; //termino l'operazione
        }
    }
    //invio l'oggetto all'elenco
    ordini.push(OrdTemp)

    res.json({
        status: "SUCCESS",
        data: "Ordine inserito" 
    });
})

//PUT serve a sostituire un elemento già presente PATH modifico un elemento
app.patch("/orders/:idOrd", (req, res) =>{
    let varOrd = req.params.idOrd;
    for( let [idx, item] of ordini.entries()){
        if(item.idOrdine == varOrd){
            item.idProdotti = req.body.idPro ? req.body.idPro : item.idProdotti,
            item.quantita = req.body.qnt ? req.body.qnt : item.quantita,
            item.idCliente = req.body.idCli ? req.body.idCli : item.idCliente

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
                    data: "Modifica  non effettuata"
        }
    )
})

//DELETE Eliminazione dell'oggetto tramite l'identificativo del codice che sarà univoquo
app.delete("/orders/:id", (req, res) => {
    let idOrd = req.params.id;
    for(let [idx, item] of ordini.entries()){
        if(item.idOrdine == idOrd){
            ordini.splice(idx, 1); //rimuove un elemento dall'indice 
            res.json({
                    status: "SUCCESS",
                    data: "Ordine Eliminato"
            })
            return;
        }
    }
    res.json(
        {
                    status: "ERROR",
                    data: "Impossibile eliminare ordine"
        }
    )
})

//Avvio il web server
app.listen(port, host, () => {
    console.log("Sono in ascolto sulla porta: " + port); //utilizzo una concatenazione di stringa in modo che se in futuro cambio la porta non dovrò mettere mano al codice
})