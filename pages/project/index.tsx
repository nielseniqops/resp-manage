import type { NextPage } from "next";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import ShowProject from "@components/showproject";
import usePage from "@components/infinite-scroll";
import DataLoadingPage from "@components/dataLoading";



const AllProject: NextPage = ({}) => {
  const { user, isLoading } = useUser();
  //const { data } = useSWR<ProjectResponse>("/api/project");
  const { mergedData, handleScroll, listRef } = usePage("/api/project");

  return (
    <Layout title="All project list" hasTabBar={true} seoTitle="Project | NielsenIQ OPS">
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
//         "/api/project": {
//           ok: true,
//           project
//         }
//       }
//     }}>
//       <AllProject />
//     </SWRConfig>
//   );
// }

// export async function getServerSideProps(){
//   const project = await client?.project.findMany({
//     orderBy: [
//       {
//           createdAt: 'desc'
//       }
//     ],
//     take: 15,
//     skip: 0
//   });
//   return {
//     props:{
//       project: JSON.parse(JSON.stringify(project)),
//     }
//   }
// }

// export default Page;
export default AllProject
