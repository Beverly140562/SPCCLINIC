import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient"; 

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener?.subscription?.unsubscribe(); 
    };
  }, []);

  //  Signup Function with Profile Insertion
  const signUpNewUser = async (name, email, password, phone, address, dob) => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) return { error };

    const userId = data?.user?.id;
    if (!userId) return { error: "User ID not found after signup" };

    const { error: insertError } = await supabase.from("students").insert([
      {
        student_id: userId,
        name,
        email,
        phone: phone || "Not Provided",
        address: JSON.stringify({ line1: address || "Not Provided", line2: "" }),
        gender: "Not Specified",
        dob: dob || "2000-01-01",
      },
    ]);

    if (insertError) return { error: insertError };

    return { data };
  };

  //  Sign-in
  const signInUser = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  //  Sign-out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out:", error);
  };

  return (
    <AuthContext.Provider value={{ session, signUpNewUser, signInUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

//  for easy access
export const UserAuth = () => useContext(AuthContext);
