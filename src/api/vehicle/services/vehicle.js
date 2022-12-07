'use strict';

/**
 * vehicle service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::vehicle.vehicle', () => ({
    async importVehicles(vehicles) {
        try {
            const results = await Promise.all(
                vehicles.map(async (vehicle) => {
                    const importedVehicle = await strapi.entityService.create('api::vehicle.vehicle', {
                        data: {
                            manufacturer: String(vehicle['Manufacturer']),
                            model: String(vehicle['Model']),
                            description: String(vehicle['Description']),
                            transmission: String(vehicle['Transmission']),
                            gearboxType: String(vehicle['Manual or Automatic']),
                            engineCapacity: vehicle['Engine Capacity'],
                            fuelType: String(vehicle['Fuel Type']),
                            powertrain: String(vehicle['Powertrain']),
                            enginePowerPs: vehicle['Engine Power (PS)'],
                            enginePowerKw: vehicle['Engine Power (Kw)'],
                            electricConsumptionMiles: vehicle['Electric energy consumption Miles/kWh'] ? vehicle['Electric energy consumption Miles/kWh'] : null,
                            whKm: vehicle['wh/km'] ? vehicle['wh/km'] : null,
                            maxRangeKm: vehicle['Maximum range (Km)'] ? vehicle['Maximum range (Km)'] : null,
                            maxRangeMiles: vehicle['Maximum range (Miles)'] ? vehicle['Maximum range (Miles)'] : null,
                            euroStandard: String(vehicle['Euro Standard']),
                            testingScheme: String(vehicle['Testing Scheme']),
                            wltpCo2: vehicle['WLTP CO2'],
                            co: vehicle['Emissions CO [mg/km]'],
                            thc: vehicle['THC Emissions [mg/km]'],
                            nox: vehicle['Emissions NOx [mg/km]'],
                            noiseLevel: vehicle['Noise Level dB(A)'],
                        }
                    });

                    return importedVehicle;
                })
            );
            return results;
        } catch(e) {
            console.log(e.details);
        }
    }
}));
