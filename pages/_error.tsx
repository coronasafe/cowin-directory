import Head from "next/head";

type Response = { statusCode: number };

export default function Error({ statusCode }: Response) {
  return (
    <>
      <Head>
        <title>Cowin Directory - Error</title>
        <meta name="description" content="Cowin Directory" />
      </Head>
      <div className="items-center self-center flex flex-col mb-6 mt-12 mx-6 my-auto overflow-hidden w-full">
        <span className="sm:text-2xl md:text-2xl">
          {statusCode
            ? `An error ${statusCode} occurred on server`
            : "An error occurred on client"}
        </span>
      </div>
    </>
  );
}

type getServerSidePropsTypes = {
  res: Response;
  err: Response;
};

export async function getServerSideProps({
  res,
  err,
}: getServerSidePropsTypes) {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return {
    props: { statusCode },
  };
}
