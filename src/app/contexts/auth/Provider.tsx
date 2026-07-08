// Import Dependencies
import { useEffect, useReducer, ReactNode } from "react";

// Local Imports
import apiHelper from "@/utils/apiHelper";
import { isTokenValid, setSession, storage } from "@/utils/jwt";
import { AuthProvider as AuthContext, AuthContextType } from "./context";
import { User } from "@/@types/user";

// ----------------------------------------------------------------------

interface AuthAction {
  type:
    | "INITIALIZE"
    | "LOGIN_REQUEST"
    | "LOGIN_SUCCESS"
    | "LOGIN_ERROR"
    | "LOGOUT";
  payload?: Partial<AuthContextType>;
}

// Initial state
const initialState: AuthContextType = {
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  errorMessage: null,
  user: null,
  login: async () => false,
  logout: async () => {},
};

// Reducer handlers
const reducerHandlers: Record<
  AuthAction["type"],
  (state: AuthContextType, action: AuthAction) => AuthContextType
> = {
  INITIALIZE: (state, action) => ({
    ...state,
    isAuthenticated: action.payload?.isAuthenticated ?? false,
    isInitialized: true,
    user: action.payload?.user ?? null,
  }),

  LOGIN_REQUEST: (state) => ({
    ...state,
    isLoading: true,
  }),

  LOGIN_SUCCESS: (state, action) => ({
    ...state,
    isAuthenticated: true,
    isLoading: false,
    user: action.payload?.user ?? null,
  }),

  LOGIN_ERROR: (state, action) => ({
    ...state,
    errorMessage: action.payload?.errorMessage ?? "An error occurred",
    isLoading: false,
  }),

  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
};

// Reducer function
const reducer = (
  state: AuthContextType,
  action: AuthAction,
): AuthContextType => {
  const handler = reducerHandlers[action.type];
  return handler ? handler(state, action) : state;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const authToken = storage.getItem("authToken");

        if (authToken && isTokenValid(authToken)) {
          setSession(authToken);

          // const response = await axios.get<{ user: User }>("/user/profile");
          // const { user } = response.data;

          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              user: null,
            },
          });
        } else {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    init();
  }, []);

  const login = async (credentials: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    dispatch({ type: "LOGIN_REQUEST" });

    try {
      const response = await apiHelper.post("/branch/login", credentials);

      const { token, user } = response;

      setSession(token);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user },
      });

      return true;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || JSON.stringify(err);
      alert("Error: " + msg + "\nURL: " + err?.config?.url);
      dispatch({
        type: "LOGIN_ERROR",
        payload: {
          errorMessage: msg,
        },
      });
      return false;
    }
  };
  const logout = async () => {
    setSession(null);
    dispatch({ type: "LOGOUT" });
  };

  if (!children) {
    return null;
  }

  return (
    <AuthContext
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
}
