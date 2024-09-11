
# IP Geolocation Aggregator

This project processes IP logs to retrieve geolocation information, aggregates IPs by region, and outputs data for further mapping and analysis. The geolocation data is retrieved using the `fast-geoip` package, and results can be exported in different formats like JSON and CSV for ease of visualization.

## Features

- **Log File Parsing**: Reads IP addresses from a user-provided log file and filters out empty lines.
- **IP Geolocation**: Retrieves the geolocation information (region, country, etc.) for each IP using `fast-geoip`.
- **Region Aggregation**: Aggregates IP addresses by region and provides counts of IPs per region.
- **Mapping Support**: Formats the aggregated data with region, latitude, and longitude for mapping purposes.
- **Data Export**: Exports the geolocation data and aggregated results to JSON and CSV formats.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/wjy8023tvxq/ip-region-aggregator.git
    ```
2. Navigate to the project directory:
    ```bash
    cd ip-region-aggregator
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```

## Usage

1. Provide your own log file with a list of IP addresses. The file should contain one IP address per line. For example:
    ```
    192.168.0.1
    8.8.8.8
    203.0.113.195
    ```

    Ensure the log file is named appropriately, or update the file path in the code.

2. Run the program:
    ```bash
    node index.js
    ```

The program will:
- Read the IP addresses from the log file you provided.
- Aggregate the IPs by region and save the results in `aggregated_ips_by_region.txt`.
- Save the full geolocation data to `geo_data.json`.
- Format the data for mapping and save it as a CSV file (`mapping_data.csv`).

## Output Files

- **aggregated_ips_by_region.txt**: Contains the count of IPs aggregated by region.
- **geo_data.json**: Full geolocation data for each IP.
- **mapping_data.csv**: Data formatted for mapping with region, latitude, longitude, and count.

## Dependencies

- [`fast-geoip`](https://www.npmjs.com/package/fast-geoip): For retrieving IP geolocation data.
- [`json2csv`](https://www.npmjs.com/package/json2csv): To convert JSON data into CSV format.
- Node.js standard libraries: `fs`, `path`.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any feature requests or bugs.

## License

This project is licensed under the ISC License.
