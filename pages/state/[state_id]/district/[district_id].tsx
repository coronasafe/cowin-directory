import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import useSWR from "swr";
import DistrictInfo from "../../../../components/district-info";
import Search from "../../../../components/search";
import { calendarByDistrict, Center } from "../../../../lib/cowin";
import { getDistricts } from "../../../../lib/node-utils";
import { genDistrictName, todayDate } from "../../../../lib/utils";

type DistrictProps = {
  centers: Center[];
  districts: CT.District[];
  initSelected: CT.District;
};

const District = ({ centers, districts, initSelected }: DistrictProps) => {
  // hybrid ssg and spa arch, page loads with static data that is built every 10 mins
  // and served from cache. On load the app will update the centers every 1 mins
  // static and dynamic :)
  const { data } = useSWR(
    [initSelected.district_id, todayDate()],
    calendarByDistrict,
    {
      initialData: {
        centers,
      },
      refreshInterval: 60000,
    }
  );
  return (
    <>
      <Head>
        <title>{genDistrictName(initSelected)}</title>
        <meta name="description" content={genDistrictName(initSelected)} />
      </Head>
      <Search districts={districts} showModal initSelected={initSelected} />
      <DistrictInfo centers={data?.centers ?? centers} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const districts = getDistricts();
  const districtId = context?.params?.district_id as string;
  const initSelected = districts.find((x) => x.district_id === districtId);
  const calender = await calendarByDistrict(districtId, todayDate());
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
  return { paths, fallback: "blocking" };
};

export default District;
