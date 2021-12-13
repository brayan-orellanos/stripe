import React from "react";
import env from "react-dotenv";
import { loadStripe } from "@stripe/stripe-js";
import "./App.css";

const stripePromise = loadStripe(env.PUBLIC_KEY);

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api/**", { target: "http://localhost:5000" })
  );
  app.use(
    createProxyMiddleware("/otherApi/**", { target: "http://localhost:5000" })
  );
};

export default function App() {
  const handleClick = async () => {
    const products = [
      {
        name: "producto1",
        quantity: "5",
        price: "5000",
      },
      {
        name: "producto2",
        quantity: "3",
        price: "6000",
      },
      {
        name: "producto1",
        quantity: "2",
        price: "4000",
      },
    ];

    const productsObject = {
      products: products,
    };

    const stripe = await stripePromise;

    console.log(productsObject);

    let options = {
      body: JSON.stringify(productsObject),
      method: "POST",
      headers: {
        "Content-Type": "aplication/json",
      },
    };

    const response = await fetch(
      `https://shopingxd.herokuapp.com/create-checkout-session`,
      options
    );
    console.log(response);

    const session = await response.json();

    console.log(session);

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.log("xd");
    }
  };

  return (
    <div>
      <button role="link" onClick={handleClick}>
        Pagar ahora
      </button>
    </div>
  );
}

// const ProductDisplay = () => (
//   <section>
//     <div className="product">
//       <img
//         src="https://i.imgur.com/EHyR2nP.png"
//         alt="The cover of Stubborn Attachments"
//       />
//       <div className="description">
//       <h3>Stubborn Attachments</h3>
//       <h5>$20.00</h5>
//       </div>
//     </div>
//     <form action="/create-checkout-session" method="POST">
//       <button type="submit">
//         Checkout
//       </button>
//     </form>
//   </section>
// );

// const Message = ({ message }) => (
//   <section>
//     <p>{message}</p>
//   </section>
// );

// export default function App() {
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     // Check to see if this is a redirect back from Checkout
//     const query = new URLSearchParams(window.location.search);

//     if (query.get("success")) {
//       setMessage("Order placed! You will receive an email confirmation.");
//     }

//     if (query.get("canceled")) {
//       setMessage(
//         "Order canceled -- continue to shop around and checkout when you're ready."
//       );
//     }
//   }, []);

//   return message ? (
//     <Message message={message} />
//   ) : (
//     <ProductDisplay />
//   );
// }
