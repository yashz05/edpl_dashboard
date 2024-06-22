"use client";

import type { AuthProvider } from "@refinedev/core";
import axios from "axios";
import Cookies from "js-cookie";



export const authProvider: AuthProvider = {
  login: async ({ email, password, remember }) => {
    try {
      const options = {
        method: 'POST',
        url: `http://207.180.252.68:8092/api/auth/sales_team/login`,
        headers: { 'content-type': 'application/json' },
        data: { email, password }
      };

      const { data } = await axios.request(options);

      if (data && data.status === 200) {
        // Extract necessary data from response
        const { message, access, uuid } = data;

        // Set cookies with appropriate expiry
        Cookies.set("token", message, {
          expires: remember ? 30 : 1, // 30 days if remember, 1 day otherwise
          path: "/",
        });
        Cookies.set("date", access, {
          expires: remember ? 30 : 1,
          path: "/",
        });
        Cookies.set("uuid", uuid, {
          expires: remember ? 30 : 1,
          path: "/",
        });

        return {
          success: true,
          redirectTo: "/",
        };
      } else {
        return {
          success: false,
          error: {
            name: "LoginError",
            message: "Invalid username or password",
          },
        };
      }
    } catch (error) {
      // Handle request or other errors
      console.error("Login error:", error);
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "Error occurred during login",
        },
      };
    }
  },

  logout: async () => {
    Cookies.remove("auth", { path: "/" });
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const auth = Cookies.get("token");
    const date = Cookies.get("date");
    const uuid = Cookies.get("uuid");

    if (auth && date && uuid) {
      // All cookies exist and are not null
      return {
        authenticated: true,
      };
    } else {
      // Any of the cookies are missing or null
      return {
        authenticated: false,
        logout: true,
        redirectTo: "/wrfer",
      };
    }
  },

  getPermissions: async () => {
    const auth = Cookies.get("date");
    if (auth) {
      const parsedUser = auth;
      return parsedUser;
    }
    return null;
  },
  getIdentity: async () => {
    const auth = Cookies.get("uuid");
    if (auth) {
      const parsedUser = auth;
      return parsedUser;
    }
    return null;
  },
  onError: async (error) => {
    console.log(error);

    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
};
