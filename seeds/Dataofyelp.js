const mongoose = require("mongoose");
const Campground = require("../Schema");
const random1000 = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose
  .connect("mongodb://localhost:27017/Yelpcamp", {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log(" I am connected to the data base");
  })
  .catch(() => {
    console.log(" i am having a Error Handling this case");
  });

let arr = [{}];

let rann = (arr) => {
  return (no = Math.floor(Math.random() * arr.length));
};
function generate() {
  for (let i = 0; i < 50; i++) {
    const title = `${random1000[i].city} , ${random1000[i].state}`;
    const description = descriptors[rann(descriptors)];
    const location = places[rann(places)];
    arr[i] = {
      title: title,
      description: `${description} ${location}`,
    };
  }
}
generate();
async function end() {
  await Campground.deleteMany({});
  console.log(" Done with deleting");
  await Campground.insertMany(arr);
  console.log(" Added new");
}
end().then(() => {
  mongoose.connection.close();
});
