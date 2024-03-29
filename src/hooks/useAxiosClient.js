import { axiosClient } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { useCookies } from "react-cookie";

const useAxiosClient = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    const [cookies] = useCookies();
    useEffect(() => {

        const requestIntercept = axiosClient.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${cookies.client}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosClient.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosClient(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosClient.interceptors.request.eject(requestIntercept);
            axiosClient.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh, cookies.client])

    return axiosClient;
}

export default useAxiosClient;