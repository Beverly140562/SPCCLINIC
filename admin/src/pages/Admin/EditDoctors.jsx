import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    specialization: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const token = localStorage.getItem("aToken");
        const res = await axios.get(`http://localhost:4000/api/admin/doctor/${id}`, {
          headers: {
            atoken: token,
          },
        });

        if (res.data.success) {
          setDoctor(res.data.doctor);
        }
      } catch (err) {
        console.error("Error fetching doctor details", err);
      }
    };
    fetchDoctor();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor({ ...doctor, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("aToken");
      const res = await axios.put(
        `http://localhost:4000/api/admin/doctor/${id}`,
        doctor,
        {
          headers: {
            atoken: token,
          },
        }
      );

      if (res.data.success) {
        alert("Doctor information updated successfully!");
        navigate("/admin/doctors");
      }
    } catch (err) {
      console.error("Error updating doctor", err);
      alert("Failed to update doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Doctor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={doctor.name}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={doctor.email}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
        <div>
          <label>Specialization</label>
          <input
            type="text"
            name="specialization"
            value={doctor.specialization}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={doctor.phone}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
        <div>
          <button
            type="submit"
            className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? "opacity-50" : ""}`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDoctor;
