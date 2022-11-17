import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import {User, Project} from "@prisma/client";

interface ProjectWithUser extends Project{
  user: User;
  _count: {respondent:number};
}

interface ProjectResponse{
  ok: boolean;
  list: ProjectWithUser[]; 
}

const usePage = (api:string) => {
  const [page, setPage] = useState(1);
  const [mergedData, setMergedData] = useState<ProjectWithUser[]>([]);
  const { data } = useSWR<ProjectResponse>(`${api}?page=${page}`);

  const listRef = useRef<any>();
  
  useEffect(()=>{
    setMergedData([]);
  }, [])

  const handleScroll = () => {
    const scrollHeight = listRef.current.scrollHeight;
    const scrollTop = listRef.current.scrollTop;
    const clientHeight = listRef.current.clientHeight;
    
    if (scrollTop + clientHeight >= scrollHeight) {
      setPage((prev) => prev + 1);
    }
  };
  
  useEffect(() => {
    if(data){
      if( data?.list !==  undefined && data?.list !== null ){
        if( page === 1 ){
          setMergedData(data?.list);
        }else{
          if( page >= 2 ){
            const mergedDataIds = mergedData.map((item)=> {return item?.id});
            const newData = data?.list.filter((item)=>{
              if( !mergedDataIds.includes(item.id) ){
                return item;
              }
            });
            setMergedData((prev) => prev?.concat(newData));
          }
        }
      }
    }
  }, [data]);

  return { mergedData, handleScroll, listRef }
};

export default usePage;