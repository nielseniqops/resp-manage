import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface ProfileResponse {
    ok: boolean;
    profile: User;
}

export default function useUser(){
    const {data, error} = useSWR<ProfileResponse>(
        typeof window === "undefined" ? null : "/api/user/me"
    );
    return {user: data?.profile, isLoading: !data && !error};
}