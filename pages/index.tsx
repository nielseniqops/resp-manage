import type { NextPage } from "next";
import Layout from "@components/layout";
import ShowProject from "@components/showproject";
import usePage from "@components/infinite-scroll";
import DataLoadingPage from "@components/dataLoading";
import useUser from "@libs/client/useUser";

const Home: NextPage = ({}) => {
  const { user, isLoading } = useUser();
  const { mergedData, handleScroll, listRef } = usePage("/api/project/active");

  return (
    <Layout title="Active project list" hasTabBar={true} seoTitle="Project | NielsenIQ OPS">
      {!isLoading ? null : (
        <DataLoadingPage/>
      )}
      { mergedData ? <ShowProject projects={mergedData} infScroll={handleScroll} setRef={listRef}/> : null}
    </Layout>
  );
};


// const Page:NextPage<{project:ProjectResponse[]}> = ({project})=>{
//   return (
//     <SWRConfig value={{
//       fallback: {
//         "/api/project/active": {
//           ok: true,
//           project
//         }
//       }
//     }}>
//       <Home />
//     </SWRConfig>
//   );
// }

// export async function getServerSideProps(){
//   const list = await client?.project.findMany({
//     where: {
//       status: "Active"
//     },
//     orderBy: [
//       {
//           createdAt: 'desc'
//       }
//     ],
//     // take: 15,
//     // skip: 0
//   });
//   return {
//     props:{
//       project: JSON.parse(JSON.stringify(list)),
//     }
//   }
// }

export default Home;
