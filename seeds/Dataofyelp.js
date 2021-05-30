const mongoose = require("mongoose");
const Campground = require("../Schema/campground");
const random1000 = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose
  .connect(
    "mongodb+srv://Admin-Rajeev:Test123@cluster0.nzb1d.mongodb.net/Yelpcamp",
    {
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
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
  for (let i = 0; i < 15; i++) {
    const price = Math.floor(Math.random() * 1000) + 500;
    const title = `${random1000[i].city} , ${random1000[i].state}`;
    const description = descriptors[rann(descriptors)];
    const location = places[rann(places)];
    arr[i] = {
      title: title,
      price: price,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat quod commodi in fugit iusto, animi beatae porro excepturi, asperiores ipsam molestias dolores exercitationem nisi praesentium quos voluptatum, quo autem vero. Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus debitis, maxime enim maiores sunt repellat quia eveniet earum dignissimos mollitia quas vel veritatis temporibus reprehenderit distinctio reiciendis unde. Officiis, sint!",
      location: `${description} ${location}`,
      image: "https://source.unsplash.com/collection/9046579/600x400",
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
