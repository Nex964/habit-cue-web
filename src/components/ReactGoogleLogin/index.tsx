"use client"
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ReactGoogleLogin () {

  const router = useRouter();

  const googleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      console.log(tokenResponse);
      // fetching userinfo can be done on the client or the server
      const userInfo = await axios
        .get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then(res => res.data);

      localStorage.setItem("userId", userInfo.sub)
      router.push("task-list")
      
    },
  })

    return (
      <div className="w-fit">
        <button 
          className="dark:text-white rounded-md hover:bg-zinc-700 active:bg-zinc-400 p-2 px-4"
          onClick={googleLogin}>Login</button>
      </div>
    )
}
