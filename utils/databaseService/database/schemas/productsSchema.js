const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    importName: { type: String, trim: true, default: '' }, // import name
    codSap: { type: String, trim: true, default: '' }, // cod sap
    type: { type: String, trim: true, default: 'intern' }, // tip produs: intern, extern
    name: { type: String, trim: true, default: '' }, // denumire produs
    width: { type: String, trim: true, default: '' }, // latime (mm)
    productLength: { type: String, trim: true, default: '' }, // lungime (mm)
    saleUM: { type: String, trim: true, default: '' }, // unitate masura vanzare
    excelUM: { type: String, trim: true, default: '' }, // unitate masura calcul
    deliveryUM: { type: String, trim: true, default: '' }, // unitate masura livrare
    packing: { type: String, trim: true, default: '' }, // ambalare
    weight: { type: String, trim: true, default: '' }, // greutate calcul
    saleWeight: { type: String, trim: true, default: '' }, // greutate vanzare
    price: { type: String, trim: true, default: '' }, // pret calcul
    salePrice: { type: String, trim: true, default: '' }, // pret vanzare
    plateThickness:  { type: String, trim: true }, // grosime placa
    category: { type: String, trim: true }, // categorie produs
    language: { type: String, trim: true, default: 'ro' }, // limba produs
});

module.exports = productsSchema;