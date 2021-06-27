import { InferGetStaticPropsType } from "next";
import Head from "next/head";

import PathTree from "../components/pathtree";
import Search from "../components/search";
import { getDistricts } from "../lib/node-utils";

export default function IndexPage({
  districts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Vaccine Directory</title>
        <meta name="description" content="Vaccine Directory" />
      </Head>
      <Search districts={districts} />
      <PathTree districts={districts} />
    </>
  );
}

export async function getStaticProps() {
  const districts = getDistricts();
  return {
    props: {
      districts,
    },
  };
}
