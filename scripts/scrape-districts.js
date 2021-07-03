// TODO: Implement a github action to run this script and commit changes like every day or week
const fs = require("fs");
const axios = require("axios");

const BASE_URL = "https://cdn-api.co-vin.in/api";
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36";
const FETCH_OPTIONS = {
  headers: {
    "User-Agent": USER_AGENT,
  },
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function scrapeDisticts() {
  try {
    const res = await axios(
      `${BASE_URL}/v2/admin/location/states`,
      FETCH_OPTIONS
    );
    const data = await res.data;
    const states = data.states.map((x) => ({
      ...x,
      state_id: x.state_id.toString(),
    }));
    const paths = [];
    for (const state of states) {
      await delay(100);
      const res = await axios(
        `${BASE_URL}/v2/admin/location/districts/${state.state_id}`,
        FETCH_OPTIONS
      );
      const data = await res.data;
      const districts = data.districts.map((x) => ({
        ...x,
        district_id: x.district_id.toString(),
      }));
      const districtPaths = districts.map((district) => ({
        state_id: `${state.state_id}`,
        state_name: state.state_name,
        district_id: `${district.district_id}`,
        district_name: district.district_name,
      }));
      paths.push(...districtPaths);
    }
    fs.writeFileSync("./districts.json", JSON.stringify(paths));
    console.log(`Wrote ${paths.length} districts`);
  } catch (error) {
    console.error(error);
  }
}

scrapeDisticts();
