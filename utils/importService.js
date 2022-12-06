const productCols = {
    codSap: 0,
    name: 1,
    width: 3,
    productLength: 4,
    saleUM: 5,
    excelUM: 6,
    deliveryUM: 7,
    packing: 8,
    saleWeight: 9,
    weight: 10,
    salePrice: 11,
    price: 12,
    plateThickness: 13,
    category: 14
}

let wallDCols = {
    codSap: 0, // col A
    profileType: 2, // col C
    interax: 3, // col D
    heightMin: 4, // col E
    heightMax: 5, // col F
    support: 6, // col G
    soundInsulation: 7, // col H
    fireResistance: 8, // col I
    moistureResistance: 9, // col J
    depthPlate: 10, // col K
    finishing: 11, // col L
    burglaryResistance: 12, // col M
    accessory: 13, // col N
    quantity: 15, // col P
}

let wallSCols = {
    codSap: 0, // col A
    thickness: 2, // col C
    profileType: 3, // col D
    profileType2: 4, // col E
    interax: 5, // col F
    interax2: 6, // col G
    distance: 7, // col H
    structureLink: 8, // col I
    heightMin: 9, // col J
    heightMax: 10, // col K
    support: 11, // col L
    soundInsulation: 12, // col M
    fireResistance: 13, // col N
    moistureResistance: 14, // col O
    depthPlate: 15, // col P
    finishing: 16, // col Q
    burglaryResistance: 17, // col R
    accessory: 18, // col S
    quantity: 20, // col U
}

let plateCols = {
    codSap: 0, // col A
    profileType: 2, // col C
    interax: 3, // col D
    interaxSustineri: 4, // col E
    heightMin: 5, // col F
    heightMax: 6, // col G
    support: 7, // col H
    soundInsulation: 8, // col I
    fireResistance: 9, // col J
    moistureResistance: 10, // col K
    depthPlate: 11, // col L
    finishing: 12, // col M
    accessory: 13, // col N
    quantity: 15, // col P
}

let noisyCols = {
    codSap: 0, // col A
    profileType: 2, // col C
    profileType2: 3, // col D
    interax: 4, // col E
    interax2: 5, // col F
    interaxSustineri: 6, // col G
    heightMin: 7, // col H
    heightMax: 8, // col I
    support: 9, // col J
    soundInsulation: 10, // col K
    fireResistance: 11, // col L
    moistureResistance: 12, // col M
    depthPlate: 13, // col N
    finishing: 14, // col O
    accessory: 15, // col P
    quantity: 17, // col R
}

let ceilCols = {
    codSap: 0, // col A
    profileType: 2, // col C
    interax: 3, // col D
    profileType2: 4, // col E
    interax2: 5, // col F
    interaxSustineri: 6, // col G
    basePlate: 7, // col H
    ceilingSupport: 8, // col I
    heightMin: 9, // col J
    heightMax: 10, // col K
    fireResistance: 11, // col L
    soundInsulation: 12, // col M
    moistureResistance: 13, // col N
    depthPlate: 14, // col O
    finishing: 15, // col P
    accessory: 16, // col Q
    quantity: 18, // col S
}

module.exports = {
    productCols,
    wallDCols,
    wallSCols,
    plateCols,
    noisyCols,
    ceilCols
}