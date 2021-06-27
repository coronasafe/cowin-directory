import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import DistrictInfo from "../../../../components/district-info";
import Search from "../../../../components/search";
import { calendarByDistrict, Center } from "../../../../lib/cowin";
import { getDistricts } from "../../../../lib/node-utils";
import { genDistrictName } from "../../../../lib/utils";

type DistrictProps = {
  centers: Center[];
  districts: CT.District[];
  initSelected: CT.District;
};

const District = ({ centers, districts, initSelected }: DistrictProps) => {
  return (
    <>
      <Head>
        <title>{genDistrictName(initSelected)}</title>
        <meta name="description" content={genDistrictName(initSelected)} />
      </Head>
      <Search districts={districts} showModal initSelected={initSelected} />
      <DistrictInfo centers={centers} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const districts = getDistricts();
  const districtId = context?.params?.district_id as string;
  const initSelected = districts.find((x) => x.district_id === districtId);
  const today = new Date();
  const calender = await calendarByDistrict(
    districtId,
    today.toLocaleDateString("en-IN", {}).replace(/\//g, "-")
  );
  return {
    props: { centers: calender.centers ?? [], districts, initSelected },
    // revalidates every 5 mins
    revalidate: 5000,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const districts = getDistricts();
  const paths = districts.map((d) => ({
    params: d,
  }));
  return { paths, fallback: false };
};

export default District;
