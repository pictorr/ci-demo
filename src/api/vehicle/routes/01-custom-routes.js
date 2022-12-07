module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/import-vehicles',
            handler: 'vehicle.importVehicles',
        }
    ]
}