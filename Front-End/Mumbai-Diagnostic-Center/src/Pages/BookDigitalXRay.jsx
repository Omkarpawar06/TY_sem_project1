// src/BookDigitalXRay.js
import React from "react";
import "../assets/Styles/BookPathology.css"; // Ensure this CSS file includes styles for .error
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify CSS

function BookDigitalXRay() {
  const userId = sessionStorage.getItem('userId');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Regex Patterns for Validation
  const nameRegex = /^[A-Za-z\s]+$/;
  const contactNoRegex = /^\d{10}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Handle Form Submission
  const onSubmit = async (data) => {
    const formdata = {
      userId: userId,
      name: data.name,
      contactNo: data.contactNo,
      email: data.email,
      date: data.apDate,
      time: data.timeSlot,
      test: data.test,
    };

    // Client-Side Validation
    if (!nameRegex.test(data.name)) {
      toast.error("Invalid Name. Only letters and spaces are allowed.");
      return;
    }
    if (!contactNoRegex.test(data.contactNo)) {
      toast.error("Invalid Contact Number. It must be 10 digits.");
      return;
    }
    if (!emailRegex.test(data.email)) {
      toast.error("Invalid Email Address.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/Appointment/bookDXrayAppointment", formdata);
      console.log(response.data);
      if (response.data) {
        toast.success("Appointment Scheduled Successfully!");
      }
    } catch (error) {
      console.error(error.response);
      toast.error(error.response?.data?.message || "An error occurred while scheduling the appointment.");
    }
  };

  // Calculate today's date in YYYY-MM-DD format for the min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Book an Appointment</h2>

        {/* Patient Name */}
        <div className="form-group">
          <label htmlFor="patientName">Patient Name:</label>
          <input
            type="text"
            id="patientName"
            className="input"
            {...register("name", { 
              required: "Name is required.",
              pattern: {
                value: nameRegex,
                message: "Only letters and spaces are allowed.",
              },
            })}
          />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>

        {/* Contact Number */}
        <div className="form-group">
          <label htmlFor="contactNo">Contact No:</label>
          <input
            type="tel"
            id="contactNo"
            className="input"
            {...register("contactNo", { 
              required: "Contact number is required.",
              pattern: {
                value: contactNoRegex,
                message: "Contact number must be 10 digits.",
              },
            })}
          />
          {errors.contactNo && <span className="error">{errors.contactNo.message}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className="input"
            {...register("email", { 
              required: "Email is required.",
              pattern: {
                value: emailRegex,
                message: "Invalid email address.",
              },
            })}
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        {/* Appointment Date */}
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            className="input"
            min={today} 
            {...register("apDate", { required: "Appointment date is required." })}
          />
          {errors.apDate && <span className="error">{errors.apDate.message}</span>}
        </div>

        {/* Timeslot */}
        <div className="form-group">
          <label htmlFor="timeslot">Timeslot:</label>
          <select
            id="timeslot"
            className="input"
            {...register("timeSlot", { required: "Please select the time slot." })}
          >
            <option value="">Select a timeslot</option>
            <option value="8:00AM">8:00 AM</option>
            <option value="11:00AM">11:00 AM</option>
            <option value="1:00PM">1:00 PM</option>
            <option value="3:00PM">3:00 PM</option>
            <option value="5:00PM">5:00 PM</option>
            <option value="7:00PM">7:00 PM</option>
          </select>
          {errors.timeSlot && <span className="error">{errors.timeSlot.message}</span>}
        </div>

        {/* Select Test */}
        <div className="form-group">
          <label htmlFor="test">Select Test:</label>
          <select
            id="test"
            className="input"
            {...register("test", { required: "Please select a test." })}
            defaultValue=""
          >
            <option value="">Select Test</option>
            <option value="Chest(PA)">Chest(PA)</option>
            <option value="Right/Left Chest Lateral">Right/Left Chest Lateral</option>
            <option value="Right/Left Chest Ribs">Right/Left Chest Ribs</option>
            <option value="L. S. Spine(AP/Lat)">L. S. Spine(AP/Lat)</option>
            <option value="Cervical Spine(AP/Lat)">Cervical Spine(AP/Lat)</option>
            <option value="Right/Left Elbow(AP/Lat)">Right/Left Elbow(AP/Lat)</option>
            <option value="Right/Left Wrist(AP/Lat)">Right/Left Wrist(AP/Lat)</option>
            <option value="Right/Left Hand(AP/Lat)">Right/Left Hand(AP/Lat)</option>
            <option value="P. N. S. (W/C)">P. N. S. (W/C)</option>
            <option value="Skull(AP/Lat)">Skull(AP/Lat)</option>
            <option value="Right/Left Mastoids">Right/Left Mastoids</option>
            <option value="Right/Left Shoulder(AP/Lat)">Right/Left Shoulder(AP/Lat)</option>
            <option value="Right/Left Knee Joint(AP/Lat)">Right/Left Knee Joint(AP/Lat)</option>
            <option value="Right/Left Ankle Joint(AP/Lat)">Right/Left Ankle Joint(AP/Lat)</option>
            <option value="Right/Left Foot(AP/Lat)">Right/Left Foot(AP/Lat)</option>
            <option value="Hip Joint(AP/Lat)">Hip Joint(AP/Lat)</option>
            <option value="Pelvis C Both Hip Joint(AP)">Pelvis C Both Hip Joint(AP)</option>
            <option value="T. M. Joints(Open/Closed)">T. M. Joints(Open/Closed)</option>
          </select>
          {errors.test && <span className="error">{errors.test.message}</span>}
        </div>

        {/* Submit Button */}
        <div className="form-group">
          <input type="submit" value="Submit" className="submit-button" />
        </div>
      </form>
      
      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default BookDigitalXRay;
