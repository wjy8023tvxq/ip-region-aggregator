const fs = require('fs');
const path = require('path');
const geoip =require('fast-geoip');
const { Parser } = require('json2csv');

// Function to read the log file from the local system
function readLogFile(filePath) {
    const logData = fs.readFileSync(filePath, 'utf8');
    return logData.split('\n').filter(ip => ip.trim() !== '');
}

// Function to get the region data for each IP using fast-geoip
async function getRegionFromIp(ip) {
    const geo = await geoip.lookup(ip);
    return geo && geo.region ? geo.region : 'Unknown';
}

// Function to get the full geolocation data for each IP using fast-geoip
async function getGeoDataFromIp(ip) {
    const geo = await geoip.lookup(ip);
    return geo ? geo : { ip: ip, region: 'Unknown', country: 'Unknown' };
}

const regionCoordinates = {
    'SH': { lat: 31.2304, lng: 121.4737 }, // Shanghai
    'HCW': { lat: 22.2760, lng: 114.1488 }, // Central and Western Hong Kong Island
    'GD': { lat: 23.1291, lng: 113.2644 }, // Guangdong (Guangzhou)
    'HN': { lat: 20.0174, lng: 110.3492 }, // Hainan (Haikou)
    'BJ': { lat: 39.9042, lng: 116.4074 }, // Beijing
    'NM': { lat: 40.8175, lng: 111.7656 }, // Inner Mongolia (Hohhot)
    'HB': { lat: 38.0428, lng: 114.5149 }, // Hebei (Shijiazhuang)
    'ZJ': { lat: 30.2741, lng: 120.1551 }, // Zhejiang (Hangzhou)
    'Unknown': { lat: 15.0000, lng: 115.0000 }, // South China Sea, outside China
    // Add more regions as needed
};

// Aggregate IPs by region
async function aggregateIPsByRegion(ipList) {
    const regionCounts = {};
    const geoDataList = [];

    for (const ip of ipList) {
        const region = await getRegionFromIp(ip);
        const geoData = await getGeoDataFromIp(ip);  // Get full geo data

        geoDataList.push(geoData);  // Collect full geo data for saving later

        if (region in regionCounts) {
            regionCounts[region] += 1;
        } else {
            regionCounts[region] = 1;
        }
    }

    // return regionCounts;
    return { regionCounts, geoDataList };
}

// Write aggregated data to a file
function saveAggregatedIp(filepath, regionCounts) {
    const outputLines = [];
    // Write regions and their frequencies
    for (const region in regionCounts) {
        outputLines.push(`${region}: ${regionCounts[region]} IPs`);
    }

    const outputData = outputLines.join('\n');
    fs.writeFileSync(filepath,outputData,'utf-8');
    console.log(`Aggregated data written to ${filepath}`);
}

// Function to save full geolocation data to a file
function saveGeoDataToFile(outputPath, geoDataList) {
    const outputData = JSON.stringify(geoDataList, null, 2); // Pretty print JSON
    fs.writeFileSync(outputPath, outputData, 'utf8');
    console.log(`Geolocation data saved to ${outputPath}`);
}

// Function to format aggregated data with coordinates for mapping
function formatDataForMapping(regionCounts) {
    const formattedData = [];

    for (const region in regionCounts) {
        const count = regionCounts[region];
        const coordinates = regionCoordinates[region] || { lat: 0, lng: 0 }; // Default to (0,0) if no coordinates are found

        formattedData.push({
            region: region,
            latitude: coordinates.lat,
            longitude: coordinates.lng,
            count: count
        });
    }

    return formattedData;
}

// Function to save the formatted data to a CSV file
function saveMappingDataToCsv(outputPath, formattedData) {
    const fields = ['region', 'latitude', 'longitude', 'count'];
    const opts = { fields, delimiter: ',' };
    const parser = new Parser(opts);

    const csv = parser.parse(formattedData);
    fs.writeFileSync(outputPath, csv, 'utf8');

    console.log(`Mapping data saved to ${outputPath}`);
}

// main function to run through the process
async function main() {
    try {
        // Retrieve log file from given URL
        console.log('Retrieving log file...');
        const ipList = readLogFile(path.join(__dirname, 'test', 'test_ip_1.txt'));
        console.log('Log file downloaded.');

        // Aggregate IPs by region
        console.log('Aggregating IPs by region...');
        // const regionCounts = await aggregateIPsByRegion(ipList);
        const { regionCounts, geoDataList } = await aggregateIPsByRegion(ipList); 

        // Format geo data with region, longitude and latitude
        console.log('Formatting data for mapping...');
        const formattedData = formatDataForMapping(regionCounts); 

        // Write results to a file
        const outputPath = path.join(__dirname, 'aggregated_ips_by_region.txt');
        saveAggregatedIp(outputPath,regionCounts);

        // Save the full geolocation data
        const geoDataOutputPath = path.join(__dirname, 'geo_data.json');
        saveGeoDataToFile(geoDataOutputPath, geoDataList);

        // Save the formatted mapping data to a CSV file
        const mappingDataOutputPath = path.join(__dirname, 'mapping_data.csv');
        saveMappingDataToCsv(mappingDataOutputPath, formattedData);
    } catch(error) {
        console.error('Error:', error);
    }
}
main();