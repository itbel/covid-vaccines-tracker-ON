const fetch = require("node-fetch");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const bucketName = process.env.bucketName
const fileKey = process.env.fileKey
const hoursInMilliseconds = process.env.updateFrequency


const saveToS3 = async (data) => {
  try {
    console.log("Saving new data to S3");
    const storeCovidData = await s3
      .putObject({
        Bucket: bucketName,
        Key: fileKey,
        Body: JSON.stringify(data),
      })
      .promise();
    console.log(storeCovidData);
    console.log("Stored successfully to S3");
    return;
  } catch (err) {
    console.log(err);
    console.error("An error occurred while trying to store to S3");
    return;
  }
};

const fetchFromS3 = async () => {
  try {
    console.log("Fetching from S3 bucket");
    const data = await s3
      .getObject({
        Bucket: bucketName,
        Key: fileKey,
      })
      .promise();
    const json_data = JSON.parse(data.Body.toString());
    console.log("Fetch from S3 successful");
    return {data: removeProperties(json_data.result.records), last_fetched: data.LastModified};
  } catch (err) {
    console.error(err);
    console.error("An error occurred while fetching from S3 Bucket");
  }
};

const removeProperties = (records) => {
  return records.map((record) => ({'Date': record.report_date.slice(0,10), 'Daily Doses': record.previous_day_total_doses_administered, 'Total Boosted': record.total_individuals_3doses}))
}
const fetchFromExtAPI = async () => {
   try {
    console.log("Fetching from Ontario Data Catalogue");
    const response = await fetch('https://data.ontario.ca/api/3/action/datastore_search?resource_id=8a89caa9-511c-4568-af89-7f2174b4378c&limit=7&sort=_id%20desc');
    const json_data = await response.json();
    await saveToS3(json_data);
    return removeProperties(json_data.result.records);
   }
   catch(err){
    console.error(
      "An error occurred while fetching from Ontario Data Catalogue"
    );
   }
};

exports.handler = async (event) => {
  const s3Object = await fetchFromS3();
  const currentDate = new Date();
  const fetchedDate = new Date(s3Object.last_fetched);
  const shouldUpdate = currentDate.getTime() - fetchedDate.getTime() >= hoursInMilliseconds;
  console.log(`S3 Object date is ${shouldUpdate ? "older" : "same or newer"}`);
  if(shouldUpdate)
   return {
      statusCode:200,
      body: await fetchFromExtAPI()
    };
  return {
    statusCode: 200,
    body: s3Object.data,
  };
};
