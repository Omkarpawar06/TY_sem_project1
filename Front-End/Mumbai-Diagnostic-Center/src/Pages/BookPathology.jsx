// src/BookPathology.js
import React, { useState, useEffect } from "react";
import "../assets/Styles/BookPathology.css"; // Import the CSS file
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Register from "./Register";

function BookPathology() {
  const [options, setOptions] = useState([]);
  const [category, setCategory] = useState("");
  const userId = sessionStorage.getItem('userId');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // ... (Your existing test categories)

  useEffect(() => {
    switch (category) {
      case "Haematology":
        setOptions(Haematology);
        break;
      case "Biochemistry":
        setOptions(Biochemistry);
        break;
      case "Microbiology":
        setOptions(Microbiology);
        break;
      case "HistopathologyAndCytology":
        setOptions(HistopathologyAndCytology);
        break;
      case "stool":
        setOptions(stool);
        break;
      case "urine":
        setOptions(urine);
        break;
      case "BodyFluids":
        setOptions(BodyFluids);
        break;
      case "Serology":
        setOptions(Serology);
        break;
      case "HormoneTest":
        setOptions(HormoneTest);
        break;
      default:
        setOptions([]);
        break;
    }
  }, [category]);

  const nameRegex = /^[A-Za-z\s]+$/;
  const contactNoRegex = /^\d{10}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const onSubmit = async (data) => {
    const formdata = {
      userId: userId,
      category: category,
      name: data.name,
      contactNo: data.contactNo,
      email: data.email,
      date: data.apDate,
      time: data.timeSlot,
      testType: data.testType,
    };

    if (!nameRegex.test(data.name)) {
      alert("Invalid Name");
      return;
    }
    if (!contactNoRegex.test(data.contactNo)) {
      alert("Invalid Contact Number");
      return;
    }
    if (!emailRegex.test(data.email)) {
      alert("Invalid Email");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/Appointment/bookPathAppointment", formdata);
      console.log(response.data);
      if (response.data) {
        alert("Appointment Scheduled");
      }
    } catch (error) {
      console.error(error.response);
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  // Calculate today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="Pathcontainer">
      <form className="Pathform" onSubmit={handleSubmit(onSubmit)}>
        <h2>Book an Appointment</h2>
        <div className="form-group">
          <label htmlFor="patientName">Patient Name:</label>
          <input
            type="text"
            id="patientName"
            className="input"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>
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
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            className="input"
            min={today} // Set the minimum date to today
            {...register("apDate", {
              required: "Appointment date is required.",
            })}
          />
          {errors.apDate && <span className="error">{errors.apDate.message}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="timeslot">Timeslot:</label>
          <select
            id="timeslot"
            className="input"
            {...register("timeSlot", {
              required: "Please select the time slot.",
            })}
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

        <div className="form-group">
          <label htmlFor="Pathologytest">Select Category:</label>
          <select
            id="Pathologytest"
            onChange={(e) => setCategory(e.target.value)}
            className="input"
            defaultValue=""
          >
            <option value="">Select a Pathology Test</option>
            <option value="Haematology">Haematology</option>
            <option value="Serology">Serology</option>
            <option value="HormoneTest">Hormone Test</option>
            <option value="HistopathologyAndCytology">
              Histopathology & Cytology
            </option>
            <option value="BodyFluids">Body Fluids</option>
            <option value="urine">Urine</option>
            <option value="stool">Stool</option>
            <option value="Microbiology">Microbiology</option>
            <option value="Biochemistry">Biochemistry</option>
          </select>
          {errors.category && <span className="error">{errors.category.message}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="test">Select Test:</label>
          <select
            id="test"
            {...register("testType", { required: "Select the test." })}
            className="input"
          >
            <option value="">Select a test</option>
            {options.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.testType && <span className="error">{errors.testType.message}</span>}
        </div>
        <div className="form-group">
          <input type="submit" value="Submit" className="submit-button" />
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default BookPathology;
