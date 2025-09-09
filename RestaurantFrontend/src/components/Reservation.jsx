// Reservation.jsx
import React, { useState } from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../src/authState';

const Reservation = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    date: "",
    time: "",
    phone: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to make a reservation");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    
    try {
      const { data } = await axios.post(
        '/api/v1/reservation/send',
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      
      toast.success(data.message);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        date: "",
        time: "",
        phone: ""
      });
      navigate("/success");
    } catch (error) {
      console.error("Reservation error:", error);
      if (error.response?.status === 401) {
        toast.error("Please login to make a reservation");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Reservation failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="reservation" id="reservation">
      <div className="container">
        <div className="banner">
          <img src="/reservation.png" alt="reservation" />
        </div>
        <div className="banner">
          <div className="reservation_form_box">
            <h1>MAKE A RESERVATION</h1>
            <p>For Further Questions, Please Call</p>
            {!user && <p className="login-required">* Login required to make a reservation</p>}
             <form onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  minLength={3}
                  maxLength={30}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  minLength={3}
                  maxLength={30}
                />
              </div>
              <div>
                <input
                  type="date"
                  placeholder="Date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
                <input
                  type="time"
                  placeholder="Time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="email_tag"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  pattern="[0-9]{11}"
                  title="Phone number must be 11 digits"
                  required
                />
              </div>
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Processing..." : "RESERVE NOW"}
                <span><HiOutlineArrowNarrowRight /></span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reservation;