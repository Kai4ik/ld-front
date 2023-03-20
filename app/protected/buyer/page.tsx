import { cookies } from "next/headers";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies/index.js";
import axios from "axios";
import Items from "./item";
import Orders from "./orders";
import { Item, Order } from "@/common/types";

const getData = async (cookies: RequestCookie[]) => {
  let token = "";

  cookies.forEach((cookie: { name: string; value: string }) => {
    if (cookie.name.includes("idToken")) token = cookie.value;
  });

  const itemsDataForUser = await axios.get(
    `http://localhost:8080/v1/api/items`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const orderDataForUser = await axios.get(
    `http://localhost:8080/v1/api/orders`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return { items: itemsDataForUser, orders: orderDataForUser };
};

export default async function page() {
  const cookieStore = cookies();

  const allCookies = cookieStore.getAll();
  const data = await getData(allCookies);
  const items: Item[] = data.items.data.items;
  const orders: Order[] = data.orders.data.orders;

  return (
    <>
      <Items
        items={items.map((item) => {
          item.inCart = false;
          return item;
        })}
      />
      <Orders orders={orders} />
    </>
  );
}
