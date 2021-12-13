// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripe = require("stripe")(
  "sk_test_51HjuphJzmGePpbSwgWlqU4jXgJXmA5XeAK4HK0fN2HD99Edif0LUogvXDrVsKxVKJLmlaKikOxdHB26lOw1MCWDg004csHW8rP"
);
const express = require("express");
const app = express();
app.use(express.static("."));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

const DOMAIN = "http://localhost:3000";

app.post("/create-checkout-session", async (req, res) => {
  let products = req.body.products;

  console.log(req.body.products);

  const arrProducts = [];

  products.forEach((product) => {
    let lineProducts = {
      price_data: {
        currency: "cop",
        product_data: {
          name: product.name,
          images: ['https://i.imgur.com/EHyR2nP.png'],
        },
        unit_amount: product.price,
      },
      quantity: product.quantity,
    };

    arrProducts.push(lineProducts);
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: arrProducts,
    mode: "payment",
    success_url: `${DOMAIN}/payment_success`,
    cancel_url: `${DOMAIN}/payment_failed`,
  });

  res.json({ id: session.id });
});

app.listen(5050, () => console.log("Running on port 5050"));
