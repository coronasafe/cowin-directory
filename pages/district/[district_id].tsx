import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import NProgress from "nprogress";
import { useEffect } from "react";
import useSWR from "swr";
import DistrictInfo from "../../components/district-info";
import Search from "../../components/search";
import { calendarByDistrict, Center } from "../../lib/cowin";
import { getDistricts } from "../../lib/node-utils";
import { genDistrictName, sortCenters, todayDate } from "../../lib/utils";

type DistrictProps = {
  centers: Center[];
  districts: CT.District[];
  initSelected: CT.District;
  lastUpdatedISO: string;
};

const District = ({
  centers,
  districts,
  initSelected,
  lastUpdatedISO,
}: DistrictProps) => {
  // hybrid ssg and spa arch, page loads with static data that is built every 10 mins
  // and served from cache. On load the app will update the centers every 1 mins
  // static and dynamic :)
  const { data, isValidating } = useSWR(
    [initSelected.district_id, todayDate()],
    calendarByDistrict,
    {
      initialData: {
        centers,
        lastUpdatedISO,
      },
      refreshInterval: 60000,
    }
  );

  useEffect(() => {
    if (isValidating) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [isValidating]);

  return (
    <>
      <Head>
        <title>{genDistrictName(initSelected)}</title>
        <meta name="description" content={genDistrictName(initSelected)} />
      </Head>
      <Search districts={districts} showModal initSelected={initSelected} />
      <DistrictInfo
        centers={data?.centers ?? centers}
        lastUpdated={new Date(data?.lastUpdatedISO ?? lastUpdatedISO)}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const districts = getDistricts();
  const districtId = context?.params?.district_id as string;
  const initSelected = districts.find((x) => x.district_id === districtId);
  try {
    if (!initSelected) {
      throw Error("Invalid district id");
    }
    const calender = await calendarByDistrict(districtId, todayDate());
    return {
      props: {
        centers: sortCenters(calender.centers) ?? [],
        lastUpdatedISO: calender.lastUpdatedISO ?? new Date().toISOString(),
        districts,
        initSelected,
      },
      // revalidates every 5 mins
      revalidate: 5000,
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        centers: [],
        lastUpdatedISO: new Date().toISOString(),
        districts,
        initSelected,
      },
      // revalidates every 5 mins
      revalidate: 5000,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const districts = getDistricts();
  const paths = districts.map((d) => ({
    params: d,
  }));
  return { paths, fallback: "blocking" };
};

export default District;
