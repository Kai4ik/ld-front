import { cookies } from "next/headers";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies/index.js";
import axios from "axios";
import { getUsernameAndRole } from "@/utils/auth";
import * as jose from "jose";
import Items from "./item";
import { Item } from "@/common/types";

const getReceiptsData = async (cookies: RequestCookie[]) => {
  let token = "";

  cookies.forEach((cookie: { name: string; value: string }) => {
    if (cookie.name.includes("idToken")) token = cookie.value;
  });

  const userAndRole = getUsernameAndRole(JSON.stringify(jose.decodeJwt(token)));

  const itemsDataForUser = await axios.get(
    `http://localhost:8080/v1/api/itemsByUser?user=${userAndRole.email}`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return itemsDataForUser;
};

export default async function page() {
  const cookieStore = cookies();

  const allCookies = cookieStore.getAll();
  const data = await getReceiptsData(allCookies);
  const items: Item[] = data.data.items;
  return <Items items={items} />;
}
