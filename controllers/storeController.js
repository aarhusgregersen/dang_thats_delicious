const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
    console.log(req.name);
    res.render('index');
}

exports.addStore = (req, res) => {
    res.render('editStore', {title: 'Add Store'});
}

exports.createStore = async (req, res) => {
    const store = await (new Store(req.body)).save();
    req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
    res.redirect(`/store/${store.slug}`);
}

exports.getStores = async (req, res) => {
    // 1. Query database for a list of all stores
    const stores = await Store.find(); // Returns a promise
    res.render('stores', {title: 'Stores', stores});
}

exports.editStore = async (req, res) => {
    // 1. find the store given the id
    const store = await Store.findOne({ _id: req.params.id});
    // 2. confirm they are the owner of the store
    // TODO
    // 3. Render out the edit form
    res.render('editStore', {title: `Edit ${store.name}`, store});
}

exports.updateStore = async (req, res) => {
    // Find and update store
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // Return new store instead of the old one
        runValidators: true, // Force model to run required validators
    }).exec(); // Forces query to run
    // Tell them it worked (flash)
    req.flash("success", `Sucessfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store -></a>`);
    // Redirect to store
    res.redirect(`/stores/${store.id}/edit`);
}
