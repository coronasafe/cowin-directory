// TODO: Implement a github action to run this script and commit changes like every day or week
const fs = require("fs");
const { getStates, getDistricts } = require("../lib/cowin");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function scrapeDisticts() {
  try {
    const states = await getStates();
    const paths = [];
    for (const state of states.states) {
      await delay(5000);
      const districts = await getDistricts(state.state_id);
      const districtPaths = districts.districts.map((district) => ({
        state_id: `${state.state_id}`,
        state_name: state.state_name,
        district_id: `${district.district_id}`,
        district_name: district.district_name,
      }));
      paths.push(...districtPaths);
    }
    fs.writeFileSync("./districts.json", JSON.stringify(paths));
  } catch (error) {
    console.error(error);
  }
}

scrapeDisticts();
